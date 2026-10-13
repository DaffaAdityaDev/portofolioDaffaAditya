import type { NextApiRequest, NextApiResponse } from 'next';
import { buildBriefHtml, buildBriefSheetRow, buildBriefSubject, buildBriefText, validateBrief } from '@/features/Freelance/utils/brief';
import { EMPTY_BRIEF, MIN_FILL_MS } from '@/features/Freelance/constants/inquiry';
import type { BriefFormData } from '@/types/freelance';

/**
 * Receives the /freelance project brief, emails it through Resend (https://resend.com) and appends it
 * as a row to a Google Sheet (through an Apps Script web app). Each channel is on when its env vars are set,
 * and the brief counts as delivered when at least one succeeds. With neither configured it answers 503,
 * and on any non-400 failure the page falls back to opening the visitor's mail app, so a brief is never
 * silently dropped.
 */

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const SHEET_TIMEOUT_MS = 8000;
// Per-instance memory only: enough to slow a single abusive client, not a global limit.
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  // Drop IPs whose hits have all expired, so the map does not grow with every visitor.
  for (const [key, times] of recent) if (now - times[times.length - 1] >= RATE_WINDOW_MS) recent.delete(key);
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

/** Runs a delivery channel; resolves to its error instead of throwing, or null on success. A channel that is off counts as failed. */
async function attempt(channel: (() => Promise<void>) | false): Promise<unknown> {
  if (!channel) return new Error('not configured');
  try {
    await channel();
    return null;
  } catch (err) {
    console.error('[api/brief]', err);
    return err;
  }
}

/** The Sheet script refused the row because today's cap is reached: likely a spam wave, so nothing is emailed either. */
class DailyLimitError extends Error {}

/**
 * Only the site's own pages may post here. Browsers always send Origin on a fetch POST; scripts that
 * call the API directly usually do not, or send another host.
 */
function sameOrigin(req: NextApiRequest): boolean {
  const origin = req.headers.origin;
  const host = req.headers['x-forwarded-host'] ?? req.headers.host;
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === String(host).split(',')[0].trim();
  } catch {
    return false;
  }
}

/** Asks Cloudflare whether the Turnstile token is real, unused and for this site. */
async function turnstilePassed(token: string, secret: string, ip: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

async function sendEmail(brief: BriefFormData, apiKey: string, to: string): Promise<void> {
  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.BRIEF_FROM_EMAIL || 'Freelance Request <onboarding@resend.dev>',
      to: [to],
      reply_to: brief.email.trim(),
      subject: buildBriefSubject(brief),
      text: buildBriefText(brief),
      html: buildBriefHtml(brief),
    }),
  });
  if (!sent.ok) throw new Error(`Resend answered ${sent.status}`);
}

/**
 * Apps Script answers the POST with a 302 to script.googleusercontent.com; fetch follows it as a GET,
 * which returns the script's JSON. The row is already written by then. The secret travels in the body
 * because doPost cannot read request headers.
 */
async function appendToSheet(brief: BriefFormData, url: string, secret: string): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, ...buildBriefSheetRow(brief) }),
    redirect: 'follow',
    signal: AbortSignal.timeout(SHEET_TIMEOUT_MS),
  });
  // A Google sign-in or error page instead of JSON means the deployment is not public or the URL is wrong.
  const result = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; limited?: boolean } | null;
  if (result?.limited) throw new DailyLimitError('Sheet daily limit reached');
  if (!res.ok || !result?.ok) throw new Error(`Sheet webhook failed: ${result?.error ?? `HTTP ${res.status}, not JSON`}`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_TO_EMAIL;
  const sheetUrl = process.env.SHEETS_WEBHOOK_URL;
  const sheetSecret = process.env.SHEETS_WEBHOOK_SECRET;
  if (!(apiKey && to) && !(sheetUrl && sheetSecret)) return res.status(503).json({ error: 'Sending is not configured' });

  if (!sameOrigin(req)) return res.status(403).json({ error: 'Forbidden' });

  const ip = String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  // Only known fields, as strings, so nothing unexpected reaches the email or the sheet.
  const body = (req.body ?? {}) as Record<string, unknown>;
  const brief = Object.fromEntries(
    Object.keys(EMPTY_BRIEF).map((key) => [key, typeof body[key] === 'string' ? (body[key] as string).slice(0, 4000) : '']),
  ) as unknown as BriefFormData;

  // Bots fill the hidden field; pretend success so they do not retry.
  if (brief.website) return res.status(200).json({ ok: true });
  // Nobody fills the form in under 3 seconds; bots do. Same silent success.
  if (typeof body.elapsedMs !== 'number' || body.elapsedMs < MIN_FILL_MS) return res.status(200).json({ ok: true });

  const invalid = validateBrief(brief);
  if (invalid) return res.status(400).json({ error: invalid });

  // Off until TURNSTILE_SECRET_KEY is set, together with NEXT_PUBLIC_TURNSTILE_SITE_KEY for the form.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret && !(await turnstilePassed(typeof body.turnstileToken === 'string' ? body.turnstileToken : '', turnstileSecret, ip))) {
    return res.status(400).json({ error: 'The spam check did not pass. Please wait a moment and send again.' });
  }

  // The Sheet goes first because it enforces the daily cap; when the cap is hit, the email is skipped too.
  const sheetError = await attempt(sheetUrl && sheetSecret ? () => appendToSheet(brief, sheetUrl, sheetSecret) : false);
  // Not 400: the page then opens the visitor's mail app, so a real client can still reach the inbox.
  if (sheetError instanceof DailyLimitError) return res.status(429).json({ error: 'Too many briefs today' });
  const emailError = await attempt(apiKey && to ? () => sendEmail(brief, apiKey, to) : false);

  // emailed: false tells the page to also open the visitor's mail app, so the brief still reaches the inbox.
  if (!emailError || !sheetError) return res.status(200).json({ ok: true, emailed: !emailError });
  return res.status(502).json({ error: 'Could not deliver the brief' });
}
