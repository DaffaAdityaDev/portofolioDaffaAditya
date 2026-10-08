import React from 'react';
import Link from 'next/link';
import DotMatrixArt from '@/components/ui/DotMatrixArt';
import { coverStyle } from '../CaseStudyArt/coverStyle';
import { ArrowSquare, CornerBrackets } from '../CaseStudyArt/parts';
import type { Engagement } from '@/types/project';
import { MONO_LABEL } from './constants';

/** What the page needs to link to the following case study. */
export type NextCaseStudyRef = Pick<Engagement, 'slug' | 'title' | 'image' | 'color'> & { kindLabel: string };

interface NextCaseStudyProps {
  next: NextCaseStudyRef;
}

/** Full-width link to the following case study, on its own poster. The art drifts on its own; no pointer tracking. */
const NextCaseStudy: React.FC<NextCaseStudyProps> = ({ next }) => {
  const cover = coverStyle(next);

  return (
    <nav aria-label="Next case study" className="pt-10 md:pt-12" style={cover.cssVars}>
      <Link
        href={`/case-studies/${next.slug}`}
        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
      >
        <div className="relative aspect-[16/10] overflow-hidden border border-white/[0.08] bg-[#060608] transition-colors duration-200 group-hover:border-[var(--cs-accent-line)] group-focus-visible:border-[var(--cs-accent-line)] md:aspect-[5/1]">
          <DotMatrixArt
            seed={next.slug}
            renderer={cover.renderer}
            ramp={cover.ramp}
            signal={cover.signal}
            imageSrc={next.image}
            composition="card"
            motion="idle"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.85) 26%, rgba(10,10,10,0.35) 55%, transparent 80%), radial-gradient(ellipse 60% 70% at 0% 100%, rgba(10,10,10,0.8), transparent 70%)',
            }}
          />
          <CornerBrackets />

          <div className="absolute inset-x-5 top-5 z-10 md:inset-x-8 md:top-8">
            <span className={`${MONO_LABEL} bg-[rgba(6,6,8,0.7)] px-2 py-1 text-zinc-300`}>
              Next case study
              <span className="hidden sm:inline"> · {next.kindLabel}</span>
            </span>
          </div>

          <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-6 md:inset-x-8 md:bottom-8">
            <span
              className="min-w-0 font-display font-semibold text-[#fafafa] [overflow-wrap:anywhere] [text-wrap:balance]"
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
