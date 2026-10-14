import { IDR_TIME_ZONES, MAX_LINKS, MESSAGE_MAX_LENGTH, PROJECT_TYPES, SERVICE_OTHER_MAX_LENGTH, TIMELINE_OPTIONS } from '../constants/inquiry';
import { CONTACT_EMAIL } from '../constants/content';
import type { BriefFormData, BudgetCurrency } from '@/types/freelance';

/** Shows budgets in rupiah to visitors in Indonesia, in dollars to everyone else. */
export function guessCurrencyFromTimeZone(timeZone: string | undefined): BudgetCurrency {
  return timeZone && IDR_TIME_ZONES.includes(timeZone) ? 'IDR' : 'USD';
}

const serviceName = (form: BriefFormData) =>
  form.service === 'other'
    ? form.serviceOther.trim() || 'Something else'
    : PROJECT_TYPES.find((t) => t.id === form.service)?.label ?? form.service;

/** The brief's fields, trimmed and resolved to labels. Every output (email, Sheet row, mail-app text) renders from this. */
function briefFields(form: BriefFormData) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    company: form.company.trim(),
    projectType: serviceName(form),
    budget: form.budget || 'Not given',
    timeline: TIMELINE_OPTIONS.find((t) => t.id === form.timeline)?.label ?? form.timeline,
    message: form.message.trim(),
  };
}

/** Labelled detail rows shared by the text and HTML emails; company is left out when empty. */
const detailRows = (f: ReturnType<typeof briefFields>): [string, string][] =>
  [
    ['Name', f.name],
    ['Email', f.email],
    ['Company', f.company],
    ['Project', f.projectType],
    ['Budget', f.budget],
    ['Timeline', f.timeline],
  ].filter(([, value]) => value) as [string, string][];

export function buildBriefSubject(form: BriefFormData): string {
  const f = briefFields(form);
  return `Project inquiry: ${f.projectType} · ${f.company || f.name || 'New client'}${form.budget ? ` · ${form.budget}` : ''}`;
}

/** Plain-text brief, used for the email the site sends and for the mail-app fallback. */
export function buildBriefText(form: BriefFormData): string {
  const f = briefFields(form);
  return [...detailRows(f).map(([label, value]) => `${label}: ${value}`), '', f.message].join('\n');
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The same brief as an HTML email: a details table, the message, and a reply button. Inline styles only, for mail clients. */
export function buildBriefHtml(form: BriefFormData): string {
  const f = briefFields(form);
  const email = escapeHtml(f.email);
  // URL-encoded, so an address like "x@y.co?bcc=…" (which the email check allows) can't add recipients or headers.
  const mailto = `mailto:${escapeHtml(encodeURIComponent(f.email).replace('%40', '@'))}`;
  const rows = detailRows(f).map(([label, value]) => [
    label,
    label === 'Email' ? `<a href="${mailto}" style="color:#dc2626">${email}</a>` : escapeHtml(value),
  ]);
  const reply = `${mailto}?subject=${encodeURIComponent(`Re: ${buildBriefSubject(form)}`)}`;
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#18181b">
<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e4e4e7;border-collapse:collapse">
<tr><td style="padding:20px 24px;border-bottom:1px solid #e4e4e7">
<div style="font:600 11px/1 monospace;letter-spacing:2px;text-transform:uppercase;color:#dc2626">New project brief</div>
<div style="margin-top:8px;font-size:20px;font-weight:700">${escapeHtml(f.projectType)} · ${escapeHtml(f.company || f.name)}</div>
</td></tr>
<tr><td style="padding:8px 24px">
<table role="presentation" width="100%" style="border-collapse:collapse;font-size:14px">
${rows.map(([label, value]) => `<tr><td style="padding:8px 0;width:96px;color:#71717a;border-bottom:1px solid #f4f4f5">${label}</td><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">${value}</td></tr>`).join('')}
</table>
</td></tr>
<tr><td style="padding:16px 24px">
<div style="font:600 11px/1 monospace;letter-spacing:2px;text-transform:uppercase;color:#71717a">Message</div>
<div style="margin-top:8px;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(f.message)}</div>
</td></tr>
<tr><td style="padding:8px 24px 24px">
<a href="${reply}" style="display:inline-block;padding:12px 20px;background:#18181b;color:#fff;text-decoration:none;font-size:14px;font-weight:600">Reply to ${escapeHtml(f.name)}</a>
</td></tr>
</table></body></html>`;
}

// Sheets runs a cell starting with these as a formula; a leading apostrophe keeps it as text.
const sheetText = (value: string) => (/^[=+\-@\t\r]/.test(value) ? `'${value}` : value);

/** A brief as the Google Sheet stores it: resolved labels, not ids. The Apps Script adds the timestamp and tracker columns. */
export function buildBriefSheetRow(form: BriefFormData) {
  return Object.fromEntries(Object.entries(briefFields(form)).map(([key, value]) => [key, sheetText(value)])) as ReturnType<typeof briefFields>;
}

export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// One match per URL: "https://www.x.com" counts once, because \S+ consumes the rest of it.
const LINK_PATTERN = /(?:https?:\/\/|www\.)\S+/gi;

/** Shared by the form and the API route, so both reject the same input. Returns an error message or null. */
export function validateBrief(form: Partial<BriefFormData>): string | null {
  if (!form.name?.trim()) return 'Please add your name.';
  if (!form.email?.trim() || !EMAIL_PATTERN.test(form.email.trim())) return 'Please add a valid email address.';
  if (!form.message?.trim()) return 'Please tell me a little about the project.';
  if (form.message.length > MESSAGE_MAX_LENGTH) return `Please keep the message under ${MESSAGE_MAX_LENGTH} characters.`;
  if ((form.message.match(LINK_PATTERN)?.length ?? 0) > MAX_LINKS) return `Please include at most ${MAX_LINKS} links in the message.`;
  if (!PROJECT_TYPES.some((t) => t.id === form.service)) return 'Please pick a project type.';
  if (form.service === 'other' && !form.serviceOther?.trim()) return 'Please say what you are building.';
  if ((form.serviceOther?.length ?? 0) > SERVICE_OTHER_MAX_LENGTH) return `Please keep the project type under ${SERVICE_OTHER_MAX_LENGTH} characters.`;
  return null;
}
