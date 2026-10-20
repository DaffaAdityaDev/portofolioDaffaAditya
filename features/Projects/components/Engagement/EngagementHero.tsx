import React from 'react';
import { ArrowDown } from 'lucide-react';
import DotMatrixArt from '@/components/ui/DotMatrixArt';
import Container from '@/components/ui/Container';
import BackLink from '@/components/ui/BackLink';
import type { CoverStyle } from '../CaseStudyArt/coverStyle';
import { HUD_CHIP, MONO_LABEL } from './constants';
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

/** The page background at `pct`% opacity, for the scrim gradients. */
const bg = (pct: number) => `color-mix(in srgb, var(--background) ${pct}%, transparent)`;

// The title column stays near-black; the art shows through around the shots.
const SCRIM = [
  `linear-gradient(to right, ${bg(92)} 0%, ${bg(80)} 30%, ${bg(30)} 52%, ${bg(12)} 100%)`,
  `linear-gradient(to top, var(--background) 0%, ${bg(60)} 14%, transparent 34%)`,
  `linear-gradient(to bottom, ${bg(90)} 0%, transparent 22%)`,
].join(', ');

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
        <div className="pointer-events-none absolute inset-0" style={{ background: SCRIM }} />
        {/* Below lg the text runs the full width, so the whole field is darkened. */}
        <div className="pointer-events-none absolute inset-0 bg-background/55 lg:hidden" />
      </div>

      <Container wide className="pb-6 pt-20 md:pb-2 md:pt-24">
        {/* Top row */}
        <div className="flex items-center justify-between gap-4">
          <BackLink href="/case-studies" className={HUD_CHIP}>
            Back<span className="sr-only sm:not-sr-only"> to case studies</span>
          </BackLink>
          <p className={`${MONO_LABEL} ${HUD_CHIP} text-right text-neutral-300`}>{engagement.kindLabel}</p>
        </div>

        {/* Title beside the product shots from lg up; stacked below that. */}
        <div className="mt-6 grid items-center gap-6 md:mt-8 md:gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12">
          <div className="min-w-0">
            <h1
              className="font-display font-semibold text-white [overflow-wrap:break-word] [hyphens:none] [text-wrap:balance]"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 4rem)', lineHeight: 0.92, letterSpacing: '-0.045em' }}
            >
              {engagement.title}
            </h1>
            <p
              className="mt-4 max-w-[44ch] text-neutral-300 [text-wrap:pretty]"
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

        <div className="mt-6 flex items-center gap-4 border-t border-border pt-3 md:mt-8">
          <span className={`${MONO_LABEL} text-muted-foreground`}>{engagement.context.company}</span>
          <span aria-hidden="true" className="h-px flex-1" />
          <a
            href={`#${firstSection.id}`}
            className={`${MONO_LABEL} hidden items-center gap-2 text-muted-foreground transition-colors duration-200 hover:text-white sm:flex`}
          >
            Scroll
            <ArrowDown size={14} aria-hidden="true" />
            {firstSection.label}
          </a>
        </div>
      </Container>
    </header>
  );
};

export default EngagementHero;
