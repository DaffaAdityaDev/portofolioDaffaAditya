import type { CSSProperties } from 'react';
import { fnv1a, type DotMatrixRamp, type DotMatrixRenderer } from '@/components/ui/DotMatrixArt/field';
import type { ColorSpec, Engagement } from '@/types/project';

type Accent = ColorSpec['accent'];

/** The site's system red. Used for the signal, unless the engagement's own accent is red. */
export const SIGNAL_RED = '#ef4444';
const SIGNAL_ON_RED = '#fafafa';
const ART_BG = '#060608';

/** Explicit renderer per engagement; future slugs fall back to the seed hash. */
export const RENDERER_BY_SLUG: Record<string, DotMatrixRenderer> = {
  'run-system': 'pixel',
  'ombudsman-ri': 'halftone',
  qqtech: 'glyph',
  artifyo: 'halftone',
  'aliman-bulus': 'pixel',
  recyclops: 'glyph',
};
const RENDERER_FALLBACK: DotMatrixRenderer[] = ['pixel', 'halftone', 'glyph'];

/** Navy, indigo, deep teal: picked by hash, so engagements that share an accent still look different. */
export const NIGHT_TONES = ['#0b1a3a', '#1a1446', '#0b2530'] as const;
const WARM_NIGHT: Partial<Record<Accent, string>> = { orange: '#2a1206', red: '#2a0a0a' };

interface AccentEntry {
  ramp2: string;
  ramp3: string;
  ramp4: string;
  /** -400 tone: AA as text on #0a0a0a. */
  text: string;
}

/**
 * ramp3 is the accent's -400 and ramp4 its -200: saturated enough that the hot core glows in
 * colour instead of washing out to near-white grey.
 */
export const ACCENT_TOKENS: Record<Accent, AccentEntry> = {
  emerald: { ramp2: '#0f766e', ramp3: '#34d399', ramp4: '#a7f3d0', text: '#34d399' },
  blue: { ramp2: '#4338ca', ramp3: '#60a5fa', ramp4: '#bfdbfe', text: '#60a5fa' },
  purple: { ramp2: '#7c3aed', ramp3: '#c084fc', ramp4: '#e9d5ff', text: '#c084fc' },
  cyan: { ramp2: '#0e7490', ramp3: '#22d3ee', ramp4: '#a5f3fc', text: '#22d3ee' },
  orange: { ramp2: '#c2410c', ramp3: '#fb923c', ramp4: '#fed7aa', text: '#fb923c' },
  red: { ramp2: '#b91c1c', ramp3: '#f87171', ramp4: '#fecaca', text: '#f87171' },
};

export interface AccentTokens extends AccentEntry {
  /** Text colour at 10% alpha. */
  soft: string;
  /** Text colour at 35% alpha. */
  line: string;
}

export const accentTokens = (accent: Accent): AccentTokens => {
  const entry = ACCENT_TOKENS[accent] ?? ACCENT_TOKENS.emerald;
  return { ...entry, soft: `${entry.text}1a`, line: `${entry.text}59` };
};

export interface CoverStyle {
  renderer: DotMatrixRenderer;
  ramp: DotMatrixRamp;
  signal: string;
  /** --cs-accent, --cs-accent-soft, --cs-accent-line, for the page wrapper or a card. */
  cssVars: CSSProperties;
}

/** Only the slug and accent are read, so the index can pass a slim card instead of the engagement. */
type CoverInput = Pick<Engagement, 'slug'> & { color: Pick<ColorSpec, 'accent'> };

const coverCache = new Map<string, CoverStyle>();

export function coverStyle({ slug, color }: CoverInput): CoverStyle {
  const key = `${slug}|${color.accent}`;
  const cached = coverCache.get(key);
  if (cached) return cached;

  const hash = fnv1a(slug);
  const tokens = accentTokens(color.accent);
  const night = WARM_NIGHT[color.accent] ?? NIGHT_TONES[hash % NIGHT_TONES.length];
  const style: CoverStyle = {
    renderer: RENDERER_BY_SLUG[slug] ?? RENDERER_FALLBACK[hash % RENDERER_FALLBACK.length],
    ramp: [ART_BG, night, tokens.ramp2, tokens.ramp3, tokens.ramp4],
    signal: color.accent === 'red' ? SIGNAL_ON_RED : SIGNAL_RED,
    cssVars: {
      '--cs-accent': tokens.text,
      '--cs-accent-soft': tokens.soft,
      '--cs-accent-line': tokens.line,
    } as CSSProperties,
  };
  coverCache.set(key, style);
  return style;
}
