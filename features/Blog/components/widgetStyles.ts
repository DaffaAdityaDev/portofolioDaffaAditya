// Look shared by every blog widget, flow diagrams or not.
import type { StepTone } from '@/features/Blog/flow/types';

/** Colours of a widget's states, used for strokes, fills and particles. */
export const WIDGET_COLORS = {
  idle: '#404040',
  normal: '#38bdf8',
  error: '#ef4444',
  recovery: '#34d399',
  text: '#a3a3a3',
} as const satisfies Record<StepTone | 'idle' | 'text', string>;

/** Small mono caption above a meter or chart. */
export const WIDGET_LABEL_CLASS = 'font-mono text-2xs uppercase tracking-wider text-neutral-500';

/** Small bordered state badge. Add a tone's border and text colour, or WIDGET_BADGE_IDLE_CLASS. */
export const WIDGET_BADGE_CLASS =
  'inline-block rounded-lg border px-2 py-0.5 font-mono text-2xs uppercase tracking-wider transition-colors duration-300';
/** Tone of a badge with nothing to report yet, or not the current one. */
export const WIDGET_BADGE_IDLE_CLASS = 'border-border text-muted-foreground';
