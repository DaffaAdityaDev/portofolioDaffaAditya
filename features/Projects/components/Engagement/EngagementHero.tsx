import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowDown } from 'lucide-react';
import DotMatrixArt from '@/components/ui/DotMatrixArt';
import type { CoverStyle } from '../CaseStudyArt/coverStyle';
import { MONO_LABEL } from './constants';
import type { CaseStudyEngagement } from './types';
import HeroShots, { type HeroShot } from './HeroShots';

interface EngagementHeroProps {
  engagement: CaseStudyEngagement;
  cover: CoverStyle;
  /** Id and label of the first section, for the scroll cue. */
  firstSection: { id: string; label: string };
  /** Screenshots of the engagement's projects, in display order. */
  shots: HeroShot[];
}

/**
 * Compact poster: the engagement's art fills the header, the title sits on a dark scrim on the
 * left and the project screenshots stand on the right as framed product shots. The art only
 * drifts on its own (static under reduced motion); nothing here follows the pointer.
 */
const EngagementHero: React.FC<EngagementHeroProps> = ({ engagement, cover, firstSection, shots }) => {
  return (
    <header className="relative isolate overflow-hidden">
      {/* Art: behind the whole header. Decorative. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <DotMatrixArt
          seed={engagement.slug}
          renderer={cover.renderer}
          ramp={cover.ramp}
          signal={cover.signal}
          imageSrc={engagement.image}
          composition="hero"
          motion="idle"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: [
              // The title column stays near-black; the art shows through around the shots.
              'linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.8) 30%, rgba(10,10,10,0.3) 52%, rgba(10,10,10,0.12) 100%)',
              'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.6) 14%, transparent 34%)',
              'linear-gradient(to bottom, rgba(10,10,10,0.9) 0%, transparent 22%)',
            ].join(', '),
          }}
        />
        {/* Below lg the text runs the full width, so the whole field is darkened. */}
        <div className="pointer-events-none absolute inset-0 bg-[rgba(10,10,10,0.55)] lg:hidden" />
      </div>

      <div className="mx-auto w-full max-w-[1320px] px-4 pb-6 pt-20 sm:px-6 md:pb-2 md:pt-24 lg:px-10">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/case-studies"
            className={`${MONO_LABEL} group flex items-center gap-2 bg-[rgba(6,6,8,0.7)] px-2 py-1.5 text-zinc-300 transition-colors duration-200 hover:text-red-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500`}
          >
            <ArrowLeft size={14} aria-hidden="true" className="transition-transform duration-200 motion-safe:group-hover:-translate-x-0.5" />
            <span>
              Back<span className="sr-only sm:not-sr-only"> to case studies</span>
            </span>
          </Link>
          <p className={`${MONO_LABEL} bg-[rgba(6,6,8,0.7)] px-2 py-1.5 text-right text-zinc-300`}>
            {engagement.kindLabel}
          </p>
        </div>

        {/* Title beside the product shots from lg up; stacked below that. */}
        <div className="mt-6 grid items-center gap-6 md:mt-8 md:gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          <div className="min-w-0">
            <h1
              className="font-display font-semibold text-[#fafafa] [overflow-wrap:break-word] [hyphens:none] [text-wrap:balance]"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 4rem)', lineHeight: 0.92, letterSpacing: '-0.045em' }}
            >
              {engagement.title}
            </h1>
            <p
              className="mt-4 max-w-[44ch] text-zinc-300 [text-wrap:pretty]"
              style={{ fontSize: 'clamp(1.0625rem, 1.2vw, 1.1875rem)', lineHeight: 1.55 }}
            >
              {engagement.summary}
            </p>
          </div>

          {shots.length > 0 && (
            <div className="min-w-0 w-full md:mx-auto md:w-[min(100%,620px)] lg:w-full">
              <HeroShots shots={shots} />
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-3 md:mt-8">
          <span className={`${MONO_LABEL} text-zinc-400`}>{engagement.context.company}</span>
          <span aria-hidden="true" className="h-px flex-1" />
          <a
            href={`#${firstSection.id}`}
            className={`${MONO_LABEL} hidden items-center gap-2 text-zinc-400 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 sm:flex`}
          >
            Scroll
            <ArrowDown size={14} aria-hidden="true" />
            {firstSection.label}
          </a>
        </div>
      </div>
    </header>
  );
};

export default EngagementHero;
