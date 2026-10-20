import { clamp, lerp } from '@/utils/math';
import type { PriceTier } from '../types';

/**
 * Average price per GB for a month of traffic under tiered pricing. Each tier
 * is charged only for the part of the volume that falls inside it.
 */
export function blendedPricePerGb(volumeGb: number, tiers: readonly PriceTier[]): number {
  if (volumeGb <= 0) return 0;

  let remaining = volumeGb;
  let cost = 0;
  for (const tier of tiers) {
    const used = Math.min(remaining, tier.sizeGb);
    cost += used * tier.pricePerGb;
    remaining -= used;
    if (remaining <= 0) break;
  }
  return cost / volumeGb;
}

/**
 * Maps a slider position to a price. Checkpoints sit at whole positions
 * (0, 1, 2, ...) and prices between two checkpoints are interpolated.
 */
export function positionToPrice(position: number, checkpoints: readonly number[]): number {
  const last = checkpoints.length - 1;
  const clamped = clamp(position, 0, last);
  const index = Math.min(Math.floor(clamped), last - 1);
  return lerp(checkpoints[index], checkpoints[index + 1], clamped - index);
}

/** Inverse of positionToPrice. Checkpoints must be sorted from cheapest to dearest. */
export function priceToPosition(price: number, checkpoints: readonly number[]): number {
  const last = checkpoints.length - 1;
  if (price <= checkpoints[0]) return 0;
  if (price >= checkpoints[last]) return last;

  const index = checkpoints.findIndex((_, i) => i < last && price <= checkpoints[i + 1]);
  return index + (price - checkpoints[index]) / (checkpoints[index + 1] - checkpoints[index]);
}

/** Pulls a position onto the nearest checkpoint when it is within `radius` of one. */
export function snapPosition(position: number, radius: number): number {
  const nearest = Math.round(position);
  return Math.abs(position - nearest) <= radius ? nearest : position;
}
