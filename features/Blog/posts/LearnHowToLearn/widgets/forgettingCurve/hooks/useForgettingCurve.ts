import { useMemo, useState } from 'react';
import type { PresetId } from '../types';
import { PRESET_ORDER, SCHEDULE_PRESETS } from '../constants';
import { simulateCurve } from '../utils/model';

const sameDays = (a: number[], b: number[]) => a.length === b.length && a.every((day, index) => day === b[index]);

/** The chosen review days and the curve they produce, recomputed when the days change. */
export function useForgettingCurve() {
  const [reviewDays, setReviewDays] = useState<number[]>(SCHEDULE_PRESETS.spaced.days);
  const result = useMemo(() => simulateCurve(reviewDays), [reviewDays]);
  // A custom schedule that happens to match a preset lights that preset up too.
  const activePreset = PRESET_ORDER.find((id) => sameDays(SCHEDULE_PRESETS[id].days, reviewDays)) ?? null;

  const applyPreset = (id: PresetId) => setReviewDays(SCHEDULE_PRESETS[id].days);
  const toggleDay = (day: number) =>
    setReviewDays((days) => (days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort((a, b) => a - b)));

  return { reviewDays, result, activePreset, applyPreset, toggleDay };
}
