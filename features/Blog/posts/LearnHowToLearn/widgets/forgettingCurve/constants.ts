import type { PresetId, SchedulePreset } from '@/features/Blog/posts/LearnHowToLearn/widgets/forgettingCurve/types';

/**
 * Illustrative model, not fitted to data: recall = exp(-t / S). S is the
 * memory's stability in days. A review multiplies S by 1 + forgetBoost x
 * (share forgotten, capped at maxForgotten), so a review given while recall is
 * still high adds little, and waiting until it is almost gone adds nothing more.
 */
export const CURVE_MODEL = {
  days: 30,
  initialStability: 2,
  forgetBoost: 5,
  /** Past this share forgotten the review is relearning, so the gain stops growing. */
  maxForgotten: 0.5,
  /** Samples per day, enough for a smooth curve. */
  samplesPerDay: 8,
} as const;

export const SCHEDULE_PRESETS: Record<PresetId, SchedulePreset> = {
  none: { id: 'none', label: 'No review', days: [] },
  cram: { id: 'cram', label: 'Cram (day 1 to 4)', days: [1, 2, 3, 4] },
  spaced: { id: 'spaced', label: 'Spaced (day 1, 3, 7, 14)', days: [1, 3, 7, 14] },
};

export const PRESET_ORDER: PresetId[] = ['none', 'cram', 'spaced'];

export const CURVE_CHART = {
  width: 640,
  height: 240,
  padLeft: 40,
  padRight: 12,
  padTop: 12,
  padBottom: 26,
  curveColor: '#d4d4d4',
  baselineColor: '#ef4444',
  reviewColor: '#ef4444',
  gridColor: '#262626',
  axisTextClass: 'fill-neutral-500 font-mono',
  minWidthClass: 'min-w-[560px]',
} as const;
