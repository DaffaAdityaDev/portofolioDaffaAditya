import { calculateDuration } from './date';

/**
 * Start of the experience count: the first internship (QQTech / Ombudsman RI, 2023).
 * The exact start month is an assumption; adjust it here and the hero ticker and About stats follow.
 * Midnight UTC, so the server and every visitor's browser count from the same instant.
 */
export const EXPERIENCE_START_DATE = new Date(Date.UTC(2023, 6, 1));
export const EXPERIENCE_LABEL = 'Experience';

export type Experience = ReturnType<typeof calculateDuration>;

export const readExperience = (): Experience => calculateDuration(EXPERIENCE_START_DATE);

/**
 * The count at build time (next.config.js inlines BUILD_TIME), which is what the static HTML shows.
 * Hydration renders this same value, and React then patches only what the visitor's clock changes.
 */
export const BUILD_EXPERIENCE: Experience = calculateDuration(
  EXPERIENCE_START_DATE,
  process.env.BUILD_TIME ? new Date(process.env.BUILD_TIME) : new Date(),
);

/** Whole years of experience, counted from the same start date as the ticker. */
export const experienceYears = (): number => Number(readExperience().y);

export const formatExperience = (e: Experience) =>
  `${Number(e.y)} Years, ${Number(e.m)} Months, ${Number(e.d)} Days`;

/** Milliseconds until the day count changes: whole days since a UTC midnight roll over at the next UTC midnight. */
export const msUntilNextDay = (): number => {
  const now = new Date();
  const next = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return next - now.getTime() + 1000;
};
