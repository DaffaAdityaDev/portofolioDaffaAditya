import type { BriefFormData, BudgetCurrency, ProjectTypeId, TimelineId } from '@/types/freelance';

/**
 * Options for the project inquiry form. There is no price calculator: the client shares a
 * budget range and gets a fixed price in a written proposal.
 */

/** Chips for "What are you building?". Service ids match SERVICES so a Services card can preselect one. */
// A Record, so adding a service or project type without a chip label fails to compile. Chips follow this order.
const PROJECT_TYPE_LABELS: Record<ProjectTypeId, string> = {
  website: 'Business website',
  'landing-page': 'Landing page',
  'online-store': 'Online store',
  'web-app': 'Web app or MVP',
  'admin-system': 'Admin or finance system',
  integration: 'API & integrations',
  improve: 'Audit, speed & fixes',
  other: 'Something else',
};
export const PROJECT_TYPES = (Object.keys(PROJECT_TYPE_LABELS) as ProjectTypeId[]).map((id) => ({ id, label: PROJECT_TYPE_LABELS[id] }));

/** Longest free-text project type the form and the API accept. */
export const SERVICE_OTHER_MAX_LENGTH = 120;

export const BUDGET_OPTIONS: Record<BudgetCurrency, readonly string[]> = {
  IDR: ['Under Rp 10 jt', 'Rp 10–25 jt', 'Rp 25–50 jt', 'Rp 50–100 jt', 'Over Rp 100 jt', 'Not sure yet'],
  USD: ['Under $1k', '$1k–3k', '$3k–7k', '$7k–15k', 'Over $15k', 'Not sure yet'],
};

export const TIMELINE_OPTIONS: readonly { id: TimelineId; label: string }[] = [
  { id: 'asap', label: 'As soon as possible' },
  { id: '1-2-months', label: 'In 1–2 months' },
  { id: '3-months-plus', label: 'In 3+ months' },
  { id: 'flexible', label: 'Flexible' },
];

/** Indonesian time zones, used once to show budgets in rupiah by default. */
export const IDR_TIME_ZONES: readonly string[] = ['Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Ujung_Pandang', 'Asia/Jayapura'];

/** Cloudflare Turnstile site key. Empty turns the spam check off on both the form and the API. */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

/** Briefs sent faster than this after the form appeared are from bots: nobody types a brief in 3 seconds. */
export const MIN_FILL_MS = 3000;

/** More links than this in one message is almost always SEO spam. */
export const MAX_LINKS = 3;

/** Longest message the form and the API accept. */
export const MESSAGE_MAX_LENGTH = 3000;

export const EMPTY_BRIEF: BriefFormData = {
  name: '',
  email: '',
  company: '',
  service: 'website',
  serviceOther: '',
  currency: 'USD',
  budget: '',
  timeline: 'flexible',
  message: '',
  website: '',
};
