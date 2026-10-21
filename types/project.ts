/**
 * Project Domain Models & Case Study Types
 * Single source of truth for project catalog, metrics, and case-study presentations.
 */

export interface ColorSpec {
  accent: 'red' | 'blue' | 'emerald' | 'orange' | 'purple' | 'cyan';
  glow: string;
  pillsBorder: string;
  pillsText: string;
  pillsBg: string;
}

export interface CaseStudyMeta {
  metric: string;
  color: ColorSpec;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  client: string;
  description: string;
  year: string;
  type: string;
  category: string;
  featured: boolean;
  link: string;
  liveLink?: string;
  image: string;
  color: string;
  tech: string[];
  nature: 'work' | 'freelance' | 'side' | string;
  achievements?: string[];
}

/* ------------------------------------------------------------------ */
/* Engagement case studies: one page per company or client.            */
/* ------------------------------------------------------------------ */

/** Usually matches Project.nature, but can differ (Recyclops: a capstone filed under work). An internship is a role detail, not a kind. */
export type EngagementKind = 'work' | 'freelance' | 'side';

export interface EngagementLink {
  label: string;
  href: string;
}

export interface EngagementContext {
  /** Public company name, or an anonymized descriptor when the owner asks for one. Always shown. */
  company: string;
  /** e.g. "Government agency". Optional. */
  companyType?: string;
  /** Job title during the engagement. */
  role?: string;
  /** Free text, e.g. "2024 - now", "2023, 3 months". */
  period?: string;
  /** Free text, e.g. "5 engineers, 2 on frontend". */
  teamSize?: string;
  /** Main tools. Shown as pills. Required, may be []. */
  stack: string[];
}

export interface KeyDecision {
  title: string;
  /** The problem that forced a choice. */
  problem?: string;
  /** The alternatives considered. Not shown when empty. */
  options?: string[];
  /** What was chosen. Required. */
  choice: string;
  /** Why this option won. */
  why?: string;
  /** projectsData slug. Shown as a tag only when the engagement has more than one project. */
  project?: string;
}

export interface ShippedItem {
  title: string;
  detail?: string;
  project?: string;
}

export interface ImpactItem {
  /** What changed, in words. Required. */
  label: string;
  /** Relative or absolute figure, e.g. "-45%", "500+". Optional: an item without one is a plain line. */
  metric?: string;
  before?: string;
  after?: string;
  /** How it was measured, or over what period. */
  note?: string;
  project?: string;
}

export type EngagementArtifact =
  | { kind: 'diagram'; title: string; src: string; alt: string; width: number; height: number; caption?: string }
  | { kind: 'snippet'; title: string; language: string; code: string; caption?: string };

/** One block of the case-study article, in reading order. */
export type StoryBlock =
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'image'; src: string; alt: string; caption?: string };

export interface Engagement {
  slug: string;
  /** Page H1 and index row title. */
  title: string;
  /** One or two plain sentences. Used as the hero subline, the index row text and the meta description. */
  summary: string;
  kind: EngagementKind;
  /** projectsData slugs grouped here, in display order. */
  projectSlugs: string[];
  /** Hero image (public path). */
  image: string;
  /** 1200x630 share image (public path). Falls back to the site's default OG image. */
  ogImage?: string;
  color: ColorSpec;
  links?: EngagementLink[];
  /** Short owner-confirmed figure for the index row. When missing the row shows the role. */
  headlineMetric?: string;
  context: EngagementContext;
  /** 1. Context is `context`. Sections 2 to 8 below. Each is optional. */
  problem?: string[];
  responsibilities?: string[];
  decisions?: KeyDecision[];
  shipped?: ShippedItem[];
  impact?: ImpactItem[];
  artifacts?: EngagementArtifact[];
  lessons?: string[];
  /** The case study as a short first-person article. When present, the page renders this. */
  story?: StoryBlock[];
}
