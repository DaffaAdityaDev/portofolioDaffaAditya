import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { formatExperience } from '@/utils/experience';
import { useExperience } from '@/hooks/useExperience';

const SubtleDigit = ({ char }: { char: string }) => {
  return (
    <span className="relative inline-block w-[0.55em] text-center tabular-nums">
      {/* No entrance in the static HTML, or the digits would be invisible until hydration. A changed
          digit (the visitor's clock past the build day, or a day rollover) rolls in under its new key. */}
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={char}
          className="inline-block w-full"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {char}
        </m.span>
      </AnimatePresence>
    </span>
  );
};

const Pair = ({ value }: { value: string }) => (
  <>
    <SubtleDigit char={value[0]} />
    <SubtleDigit char={value[1]} />
  </>
);

/**
 * The `[ 03Y 03M 07D ]` readout, updated once a day.
 *
 * The static HTML and hydration show the build-time count (useExperience's server snapshot), so
 * nothing mismatches; right after hydrating, React re-reads the visitor's clock and updates only
 * the digits and label that differ.
 */
const ExperienceTicker: React.FC = () => {
  const experience = useExperience();

  return (
    <div
      aria-label={formatExperience(experience)}
      className="flex items-baseline font-mono text-white tracking-tighter whitespace-nowrap overflow-hidden px-3.5 py-1.5 rounded-lg w-fit"
    >
      <span className="text-muted-foreground mr-1 text-sm md:text-base font-light">[</span>

      <div className="flex items-baseline text-sm md:text-base font-medium" aria-hidden="true">
        <span className="text-white font-semibold">
          <Pair value={experience.y} />
        </span>
        <span className="text-2xs text-neutral-300 ml-0.5 mr-1 font-bold">Y</span>

        <span className="text-white font-semibold">
          <Pair value={experience.m} />
        </span>
        <span className="text-2xs text-neutral-300 ml-0.5 mr-1 font-bold">M</span>

        <span className="text-white font-semibold">
          <Pair value={experience.d} />
        </span>
        <span className="text-2xs text-neutral-300 ml-0.5 font-bold">D</span>
      </div>

      <span className="text-muted-foreground ml-1 text-sm md:text-base font-light">]</span>
    </div>
  );
};

export default ExperienceTicker;
