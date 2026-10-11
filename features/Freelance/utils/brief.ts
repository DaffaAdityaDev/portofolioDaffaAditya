import { IDR_TIME_ZONES, MESSAGE_MAX_LENGTH, TIMELINE_OPTIONS } from '../constants/inquiry';
import { CONTACT_EMAIL, SERVICES } from '../constants/content';
import type { BriefFormData, BudgetCurrency } from '@/types/freelance';

/** Shows budgets in rupiah to visitors in Indonesia, in dollars to everyone else. */
export function guessCurrencyFromTimeZone(timeZone: string | undefined): BudgetCurrency {
  return timeZone && IDR_TIME_ZONES.includes(timeZone) ? 'IDR' : 'USD';
}

const serviceName = (form: BriefFormData) => SERVICES.find((s) => s.id === form.service)?.name ?? form.service;
const timelineLabel = (form: BriefFormData) => TIMELINE_OPTIONS.find((t) => t.id === form.timeline)?.label ?? form.timeline;

export function buildBriefSubject(form: BriefFormData): string {
  const who = form.company.trim() || form.name.trim() || 'New client';
  return `Project inquiry: ${serviceName(form)} · ${who}`;
}

/** Plain-text brief, used for the email the site sends and for the mail-app fallback. */
export function buildBriefText(form: BriefFormData): string {
  return [
    `Name: ${form.name.trim()}`,
    `Email: ${form.email.trim()}`,
    form.company.trim() ? `Company: ${form.company.trim()}` : null,
    `Project: ${serviceName(form)}`,
    `Budget: ${form.budget || 'Not given'}`,
    `Timeline: ${timelineLabel(form)}`,
    '',
    form.message.trim(),
  ]
    .filter((line) => line !== null)
    .join('\n');
}

export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Shared by the form and the API route, so both reject the same input. Returns an error message or null. */
export function validateBrief(form: Partial<BriefFormData>): string | null {
  if (!form.name?.trim()) return 'Please add your name.';
  if (!form.email?.trim() || !EMAIL_PATTERN.test(form.email.trim())) return 'Please add a valid email address.';
  if (!form.message?.trim()) return 'Please tell me a little about the project.';
  if (form.message.length > MESSAGE_MAX_LENGTH) return `Please keep the message under ${MESSAGE_MAX_LENGTH} characters.`;
  if (!SERVICES.some((s) => s.id === form.service)) return 'Please pick a project type.';
  return null;
}
