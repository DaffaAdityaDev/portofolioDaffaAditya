/**
 * Pure Mathematical Utilities for Animations, Interpolations, and Geometry
 * 
 * Rules:
 * - Pure functions with zero side-effects
 * - Strict type-safety, no 'any'
 * - High performance, GC-friendly (no unnecessary object allocations in RAF loops)
 */

/**
 * Clamps a number between a minimum and maximum value.
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation between two values with an interpolation factor.
 * @param start - Starting value
 * @param end - Target value
 * @param factor - Lerp factor (typically 0.0 to 1.0)
 */
export const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

/**
 * Maps a value from an input range to a corresponding value in an output range.
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  if (inMax - inMin === 0) return outMin;
  const normalized = (value - inMin) / (inMax - inMin);
  return outMin + normalized * (outMax - outMin);
};

/**
 * Normalizes a number between 0 and 1 given an input domain.
 */
export const normalize = (value: number, min: number, max: number): number => {
  if (max - min === 0) return 0;
  return clamp((value - min) / (max - min), 0, 1);
};

/**
 * Rounds a floating-point number to a specified number of decimal places.
 */
export const roundTo = (value: number, decimals: number = 2): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};

/**
 * Frame-rate independent smooth damping (ideal for RAF game/physics loops).
 * @param current - Current value
 * @param target - Target value
 * @param lambda - Smoothing speed (higher = faster snap)
 * @param dt - Delta time in seconds
 */
export const damp = (current: number, target: number, lambda: number, dt: number): number => {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
};
