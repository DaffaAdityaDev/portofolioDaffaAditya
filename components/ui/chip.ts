import { cn } from '@/utils/cn';

/**
 * The site's mono label chip: the blog kicker, category and dates, and the emerald metric/tech chips.
 * `accent` is the red category chip, `muted` the neutral one, `success` the emerald one.
 */
const TONES = {
  accent: 'border-red-900/50 bg-red-900/10 text-accent-brand',
  muted: 'border-border bg-background text-neutral-500',
  success: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
};

export const chipClasses = ({
  tone = 'muted',
  className,
}: { tone?: keyof typeof TONES; className?: string } = {}) =>
  cn(
    'inline-flex items-center rounded-lg border px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest',
    TONES[tone],
    className,
  );
