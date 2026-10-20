import React from 'react';
import Link from 'next/link';
import DotMatrixArt from '@/components/ui/DotMatrixArt';
import { coverStyle } from '../CaseStudyArt/coverStyle';
import { ArrowSquare, CornerBrackets } from '../CaseStudyArt/parts';
import type { Engagement } from '@/types/project';
import { HUD_CHIP, MONO_LABEL } from './constants';

/** What the page needs to link to the following case study. */
export type NextCaseStudyRef = Pick<Engagement, 'slug' | 'title' | 'image' | 'color'> & { kindLabel: string };

interface NextCaseStudyProps {
  next: NextCaseStudyRef;
}

/** The page background at `pct`% opacity, for the scrim. */
const bg = (pct: number) => `color-mix(in srgb, var(--background) ${pct}%, transparent)`;

const SCRIM = `linear-gradient(to top, var(--background) 0%, ${bg(85)} 26%, ${bg(35)} 55%, transparent 80%), radial-gradient(ellipse 60% 70% at 0% 100%, ${bg(80)}, transparent 70%)`;

/** Full-width link to the following case study, on its own poster. The art drifts on its own; no pointer tracking. */
const NextCaseStudy: React.FC<NextCaseStudyProps> = ({ next }) => {
  const cover = coverStyle(next);

  return (
    <nav aria-label="Next case study" className="pt-10 md:pt-12" style={cover.cssVars}>
      <Link href={`/case-studies/${next.slug}`} className="group block rounded-lg">
        <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface-1 transition-colors duration-200 group-hover:border-[var(--cs-accent-line)] group-focus-visible:border-[var(--cs-accent-line)] md:aspect-[5/1]">
          <DotMatrixArt
            seed={next.slug}
            renderer={cover.renderer}
            ramp={cover.ramp}
            signal={cover.signal}
            imageSrc={next.image}
            composition="card"
            motion="idle"
          />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: SCRIM }} />
          <CornerBrackets />

          <div className="absolute inset-x-5 top-5 z-10 md:inset-x-8 md:top-8">
            <span className={`${MONO_LABEL} ${HUD_CHIP} py-1 text-neutral-300`}>
              Next case study
              <span className="hidden sm:inline"> · {next.kindLabel}</span>
            </span>
          </div>

          <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-6 md:inset-x-8 md:bottom-8">
            <span
              className="min-w-0 font-display font-semibold text-white [overflow-wrap:anywhere] [text-wrap:balance]"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4.75rem)', lineHeight: 0.88, letterSpacing: '-0.045em' }}
            >
              {next.title}
            </span>
            <ArrowSquare size="lg" />
          </div>
        </div>
      </Link>
    </nav>
  );
};

export default NextCaseStudy;
