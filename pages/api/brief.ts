import type { NextApiRequest, NextApiResponse } from 'next';
import { buildBriefSubject, buildBriefText, validateBrief } from '@/features/Freelance/utils/brief';
import { EMPTY_BRIEF } from '@/features/Freelance/constants/inquiry';
import type { BriefFormData } from '@/types/freelance';

/**
 * Receives the /freelance project brief and emails it through Resend (https://resend.com).
 * Needs RESEND_API_KEY and BRIEF_TO_EMAIL; without them it answers 503 and the page falls back
 * to opening the visitor's mail app, so a brief is never silently dropped.
 */

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
// Per-instance memory only: enough to slow a single abusive client, not a global limit.
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BRIEF_TO_EMAIL;
  if (!apiKey || !to) return res.status(503).json({ error: 'Sending is not configured' });

  const ip = String(req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown').split(',')[0].trim();
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many requests' });

  // Only known fields, as strings, so nothing unexpected reaches the email.
  const body = (req.body ?? {}) as Record<string, unknown>;
  const brief = Object.fromEntries(
    Object.keys(EMPTY_BRIEF).map((key) => [key, typeof body[key] === 'string' ? (body[key] as string).slice(0, 4000) : '']),
  ) as unknown as BriefFormData;

  // Bots fill the hidden field; pretend success so they do not retry.
  if (brief.website) return res.status(200).json({ ok: true });

  const invalid = validateBrief(brief);
  if (invalid) return res.status(400).json({ error: invalid });

  try {
    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.BRIEF_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: brief.email.trim(),
        subject: buildBriefSubject(brief),
        text: buildBriefText(brief),
      }),
    });
    if (!sent.ok) return res.status(502).json({ error: 'Email provider rejected the message' });
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: 'Email provider unreachable' });
  }
}
