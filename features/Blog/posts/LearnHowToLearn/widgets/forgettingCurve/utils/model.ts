import type { CurvePoint, CurveResult } from '../types';
import { CURVE_MODEL as M } from '../constants';

const sampleDays = (): number[] =>
  Array.from({ length: M.days * M.samplesPerDay + 1 }, (_, index) => index / M.samplesPerDay);

/**
 * Walks day 0 to day 30. Between reviews recall decays from 100%. At each
 * review it jumps back to 100% and the next decay is slower, by more when the
 * review came after more forgetting, up to a cap.
 */
export function simulateCurve(reviewDays: number[]): CurveResult {
  const sorted = [...reviewDays].sort((a, b) => a - b);
  const points: CurvePoint[] = [];
  const reviews: CurvePoint[] = [];
  let stability: number = M.initialStability;
  let lastReview = 0;
  let next = 0;

  for (const day of sampleDays()) {
    // A sample that lands on a review day records the dip first, then the reset.
    while (next < sorted.length && sorted[next] <= day) {
      const recall = Math.exp(-(sorted[next] - lastReview) / stability);
      reviews.push({ day: sorted[next], recall });
      points.push({ day: sorted[next], recall });
      lastReview = sorted[next];
      // The more you had forgotten, the more the review strengthens the memory, up to the cap.
      stability *= 1 + M.forgetBoost * Math.min(1 - recall, M.maxForgotten);
      next += 1;
    }
    points.push({ day, recall: Math.exp(-(day - lastReview) / stability) });
  }

  const baseline = sampleDays().map((day) => ({ day, recall: Math.exp(-day / M.initialStability) }));

  // Averaged over the whole month, so a burst of reviews just before day 30 cannot game the score.
  const averageRecall = points.reduce((sum, point) => sum + point.recall, 0) / points.length;

  return { points, baseline, reviews, averageRecall, recallAtEnd: points[points.length - 1].recall };
}
