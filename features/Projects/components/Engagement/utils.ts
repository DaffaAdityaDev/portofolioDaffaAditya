import type { ColorSpec } from '@/types/project';

/** True when the string has visible text. */
export const filled = (s?: string): s is string => !!s?.trim();

/** Drops empty strings, so a list of blanks counts as empty. */
export const filledList = (a?: string[]): string[] => a?.filter(filled) ?? [];

/** Square HUD chip in the engagement's accent color. */
export const pillClass = (color: ColorSpec): string =>
  `text-[11px] font-mono uppercase tracking-[0.12em] border ${color.pillsBorder} ${color.pillsText} ${color.pillsBg} px-2 py-1 rounded-none`;
