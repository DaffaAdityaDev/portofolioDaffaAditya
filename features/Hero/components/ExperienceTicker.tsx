import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { calculateDuration } from '@/utils/date';

/**
 * Start of the experience count: the first internship (QQTech / Ombudsman RI, 2023).
 * The exact start month is an assumption; adjust it here and the About stats follow.
 * The label always says "incl. internships" so the number is not read as full-time years.
 */
export const EXPERIENCE_START_DATE = new Date('2023-07-01T00:00:00');
export const EXPERIENCE_LABEL = 'Experience (incl. internships)';

type Experience = ReturnType<typeof calculateDuration>;

const readExperience = (): Experience => calculateDuration(EXPERIENCE_START_DATE);

/** Whole years of experience, counted from the same start date as the ticker. */
export const experienceYears = (): number => Number(readExperience().y);

export const formatExperience = (e: Experience) =>
  `${Number(e.y)} Years, ${Number(e.m)} Months, ${Number(e.d)} Days`;

/** Milliseconds until the next local midnight, when the day count changes. */
const msUntilMidnight = () => {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime() + 1000;
};

/**
 * Experience duration in years, months and days. It changes once a day, so it re-reads the
 * clock at the next local midnight instead of ticking.
 */
export const useExperience = (): Experience => {
  const [experience, setExperience] = useState(readExperience);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setExperience(readExperience());
        schedule();
      }, msUntilMidnight());
    };
    setExperience(readExperience());
    schedule();
    return () => clearTimeout(timer);
  }, []);

  return experience;
};

const SubtleDigit = React.memo(({ char, appear }: { char: string; appear: boolean }) => {
  return (
    <span className="relative inline-block w-[0.55em] text-center tabular-nums">
      {/* No entrance in the static HTML, or the digits would be invisible until hydration. */}
      <AnimatePresence mode="popLayout" initial={appear}>
        <m.span
          key={char}
          className="inline-block w-full"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          // The server and the browser read the clock at different moments (and maybe zones).
          suppressHydrationWarning
        >
          {char}
        </m.span>
      </AnimatePresence>
    </span>
  );
});
SubtleDigit.displayName = 'SubtleDigit';

const Pair = ({ value, appear }: { value: string; appear: boolean }) => (
  <>
    <SubtleDigit char={value[0]} appear={appear} />
    <SubtleDigit char={value[1]} appear={appear} />
  </>
);

export interface ExperienceTickerProps {
  glassBg?: boolean;
}

/** The `[ 03Y 03M 07D ]` readout, updated once a day. */
const ExperienceTicker: React.FC<ExperienceTickerProps> = ({ glassBg = false }) => {
  const experience = useExperience();

  // The static HTML carries the server's reading of the clock. Around midnight (or in another
  // time zone) the day can differ from the browser's, and React only patches text that changes
  // from its own first render. Remounting the digits once after hydration replaces them all.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <div
      aria-label={formatExperience(experience)}
      className={`flex items-baseline font-mono text-white tracking-tighter whitespace-nowrap overflow-hidden px-3.5 py-1.5 rounded-xl w-fit ${
        glassBg ? 'bg-[#0a0a0a]/80 border border-neutral-800 shadow-inner' : ''
      }`}
    >
      <span className="text-neutral-400 mr-1 text-sm md:text-base font-light">[</span>

      <div key={hydrated ? 'client' : 'server'} className="contents">
        <div className="flex items-baseline text-sm md:text-base font-medium" aria-hidden="true">
          <span className="text-white font-semibold">
            <Pair value={experience.y} appear={hydrated} />
          </span>
          <span className="text-[8px] text-neutral-300 ml-0.5 mr-1 font-bold">Y</span>

          <span className="text-white font-semibold">
            <Pair value={experience.m} appear={hydrated} />
          </span>
          <span className="text-[8px] text-neutral-300 ml-0.5 mr-1 font-bold">M</span>

          <span className="text-white font-semibold">
            <Pair value={experience.d} appear={hydrated} />
          </span>
          <span className="text-[8px] text-neutral-300 ml-0.5 font-bold">D</span>
        </div>
      </div>

      <span className="text-neutral-400 ml-1 text-sm md:text-base font-light">]</span>
    </div>
  );
};

export default ExperienceTicker;
