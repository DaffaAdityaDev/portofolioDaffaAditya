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
