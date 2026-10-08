export type PresetId = 'none' | 'cram' | 'spaced';

export interface SchedulePreset {
  id: PresetId;
  label: string;
  /** Days on which you review, counted from the day you first learn the material (day 0). */
  days: number[];
}

/** One sample of the modeled curve. */
export interface CurvePoint {
  day: number;
  /** Modeled recall, 0 to 1. */
  recall: number;
}

export interface CurveResult {
  points: CurvePoint[];
  /** The same material with no reviews at all, for comparison. */
  baseline: CurvePoint[];
  /** Recall just before each review, where the curve jumps back up. */
  reviews: CurvePoint[];
  /** Mean recall over every sample from day 0 to day 30. */
  averageRecall: number;
  recallAtEnd: number;
}
