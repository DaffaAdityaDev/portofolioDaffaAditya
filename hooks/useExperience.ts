import { useSyncExternalStore } from 'react';
import { BUILD_EXPERIENCE, msUntilNextDay, readExperience, type Experience } from '@/utils/experience';

// The last reading, replaced only when the day count changes, so getSnapshot returns a stable object.
let current: Experience = BUILD_EXPERIENCE;
const getSnapshot = (): Experience => {
  const next = readExperience();
  if (next.y !== current.y || next.m !== current.m || next.d !== current.d) current = next;
  return current;
};
const getServerSnapshot = (): Experience => BUILD_EXPERIENCE;

// The count changes once a day, so the only event is the day rolling over.
const subscribe = (onChange: () => void) => {
  let timer: ReturnType<typeof setTimeout>;
  const schedule = () => {
    timer = setTimeout(() => {
      onChange();
      schedule();
    }, msUntilNextDay());
  };
  schedule();
  return () => clearTimeout(timer);
};

/**
 * Experience duration in years, months and days.
 *
 * The static HTML and hydration use the build-time count; right after hydrating React re-reads the
 * visitor's clock and patches only the parts that differ. Client-only mounts read the clock directly.
 */
export const useExperience = (): Experience => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
