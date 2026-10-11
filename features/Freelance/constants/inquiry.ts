import type { BriefFormData, BudgetCurrency, TimelineId } from '@/types/freelance';

/**
 * Options for the project inquiry form. There is no price calculator: the client shares a
 * budget range and gets a fixed price in a written proposal.
 */

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

/** Longest message the form and the API accept. */
export const MESSAGE_MAX_LENGTH = 3000;

export const EMPTY_BRIEF: BriefFormData = {
  name: '',
  email: '',
  company: '',
  service: 'website',
  currency: 'USD',
  budget: '',
  timeline: 'flexible',
  message: '',
  website: '',
};
