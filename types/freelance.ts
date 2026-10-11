import type { StaticImageData } from 'next/image';

/**
 * Freelance domain types: services, proof of work and the project inquiry form.
 * Runtime values live in features/Freelance/constants; brief formatting lives in features/Freelance/utils.
 */

export type ServiceId = 'website' | 'admin-system' | 'web-app' | 'improve';

export interface Service {
  id: ServiceId;
  /** Short name used in cards, the inquiry form and the brief. */
  name: string;
  /** One line under the name. */
  tagline: string;
  /** Who this is for, in the client's terms. */
  goodFor: string;
  /** Concrete things the client receives. */
  youGet: readonly string[];
  /** Typical calendar weeks, smallest to largest scope. */
  weeks: readonly [number, number];
  /** Case study that proves this service, when there is one. */
  example?: { label: string; href: string };
}

/** A real client quote, published only with the client's wording and permission. */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface WorkProof {
  id: string;
  client: string;
  kind: string;
  year: string;
  title: string;
  problem: string;
  built: string;
  /** Owner-confirmed headline figure, quoted from features/Projects/engagements.ts. */
  metric: string;
  metricLabel: string;
  image: StaticImageData;
  imageAlt: string;
  href: string;
  /** Public site, only when visitors can see the work there. */
  liveUrl?: string;
  /** A verified client statement from engagements.ts, paraphrased, never a quote. */
  clientNote?: string;
  testimonial?: Testimonial;
  stack: readonly string[];
}

export interface ProcessStep {
  title: string;
  duration: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export type BudgetCurrency = 'IDR' | 'USD';

export type TimelineId = 'asap' | '1-2-months' | '3-months-plus' | 'flexible';

export interface BriefFormData {
  name: string;
  email: string;
  company: string;
  service: ServiceId;
  currency: BudgetCurrency;
  /** Label of the chosen budget range, or empty when not picked. */
  budget: string;
  timeline: TimelineId;
  message: string;
  /** Honeypot: hidden from people, filled in by bots. */
  website: string;
}

/**
 * 'sent': delivered by the site. 'mail-app': handed to the visitor's mail app because direct
 * sending is not configured or failed. 'error': nothing could be sent.
 */
export type BriefStatus = 'idle' | 'sending' | 'sent' | 'mail-app' | 'error';
