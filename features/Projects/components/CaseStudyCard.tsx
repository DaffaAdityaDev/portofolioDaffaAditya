import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { placeholderStyle } from '@/components/ui/DotMatrixArt/field';
import { coverStyle } from './CaseStudyArt/coverStyle';
import { ArrowSquare, CornerBrackets } from './CaseStudyArt/parts';
import { PosterShots, type ShotItem } from './CaseStudyArt/ProductShot';
import type { ColorSpec } from '@/types/project';
import { HUD_CHIP as CHIP, MONO_LABEL } from './Engagement/constants';

/**
 * What one index card reads, precomputed in getStaticProps so the engagement data stays out of the
 * client chunk. Optional fields are `null`, never `undefined`: getStaticProps rejects undefined.
 */
export interface CaseStudyCardData {
  slug: string;
  title: string;
  summary: string;
  /** Poster image fed to the dot-matrix art. */
  image: string;
  accent: ColorSpec['accent'];
  kindLabel: string;
  company: string;
  role: string | null;
  period: string | null;
  headlineMetric: string | null;
  /** Display names of the grouped projects. */
  projectTitles: string[];
  stack: string[];
  /** Up to two screenshots, one per project, falling back to the engagement image. */
  shots: ShotItem[];
}

interface CaseStudyCardProps {
  card: CaseStudyCardData;
  /** Loads the screenshots eagerly; true for the first card, which sits above the fold. */
  eager: boolean;
  /** Spans both columns; from md up the poster and the text sit side by side. */
  wide: boolean;
}

// Canvas only, so the renderer stays off the server render and out of the page chunk. The card paints
// the same gradient placeholder underneath, so the static HTML still shows each poster's colours.
const DotMatrixArt = dynamic(() => import('@/components/ui/DotMatrixArt'), { ssr: false });

const HUD_CHIP = `${MONO_LABEL} ${CHIP} py-1 text-neutral-300`;

/** Fades the bottom of the screenshots into the card body. */
const SHOT_FADE =
  'linear-gradient(to top, var(--surface-1) 0%, color-mix(in srgb, var(--surface-1) 60%, transparent) 45%, transparent 100%)';

/**
 * One engagement on the index: a generated poster with the project screenshot(s) framed on top,
 * then the title, company, summary and stack. The whole card is one link and one tab stop.
 */
const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ card, eager, wide }) => {
  const { slug, title, summary, image, accent, kindLabel, company, role, period, headlineMetric, projectTitles, stack, shots } =
    card;
  const cover = coverStyle({ slug, color: { accent } });
  const secondary = headlineMetric ? null : role ?? kindLabel;
  const showSecondary = secondary !== null && secondary.toLowerCase() !== company.toLowerCase();

  return (
    <article className="group h-full" style={cover.cssVars}>
      <Link
        href={`/case-studies/${slug}`}
        className={`grid h-full min-w-0 overflow-hidden rounded-lg border border-border bg-surface-1 transition-colors duration-200 hover:border-[var(--cs-accent-line)] focus-visible:border-[var(--cs-accent-line)] ${
          wide ? 'md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : 'grid-rows-[auto_1fr]'
        }`}
      >
        <div
          className={`relative aspect-[16/10] overflow-hidden bg-surface-1 ${
            wide ? 'md:aspect-auto md:min-h-[300px] md:border-r md:border-border' : ''
          }`}
        >
          <div aria-hidden="true" className="absolute inset-0" style={placeholderStyle(slug, cover.ramp, 'card')} />
          <DotMatrixArt
            seed={slug}
            renderer={cover.renderer}
            ramp={cover.ramp}
            signal={cover.signal}
            imageSrc={image}
            composition="card"
            motion="idle"
          />
          <CornerBrackets />

          <PosterShots shots={shots} eager={eager} wide={wide} />

          {/* Fades the bottom of the screenshots into the card. Decorative. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[7] h-[14%]"
            style={{ background: SHOT_FADE }}
          />

          <div className="absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-3">
            <span className={HUD_CHIP}>
              {kindLabel}
            </span>
            {period && <span className={`${HUD_CHIP} text-right`}>{period}</span>}
          </div>
        </div>

        <div className={`flex min-w-0 flex-col gap-3 p-5 ${wide ? 'md:gap-4 md:p-8' : ''}`}>
          <div className="flex items-start justify-between gap-4">
            <h3
              className="min-w-0 font-display font-semibold text-white [overflow-wrap:anywhere] [text-wrap:balance]"
              style={{
                fontSize: wide ? 'clamp(1.75rem, 3vw, 2.75rem)' : 'clamp(1.5rem, 2.2vw, 2rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.035em',
              }}
            >
              {title}
            </h3>
            <ArrowSquare />
          </div>

          <div className="flex min-w-0 flex-wrap gap-x-4 gap-y-1">
            <p className={`${MONO_LABEL} leading-[1.6] text-neutral-300 [overflow-wrap:anywhere]`}>{company}</p>
            {headlineMetric && (
              <p className={`${MONO_LABEL} leading-[1.6] text-[var(--cs-accent)] [overflow-wrap:anywhere]`}>
                Impact {headlineMetric}
              </p>
            )}
            {showSecondary && (
              <p className={`${MONO_LABEL} leading-[1.6] text-muted-foreground [overflow-wrap:anywhere]`}>{secondary}</p>
            )}
            {projectTitles.length > 1 && (
              <p className={`${MONO_LABEL} leading-[1.6] text-muted-foreground [overflow-wrap:anywhere]`}>
                Projects: {projectTitles.join(' + ')}
              </p>
            )}
          </div>

          <p className="max-w-[62ch] text-[15px] leading-[1.6] text-neutral-300 [text-wrap:pretty] sm:text-base">
            {summary}
          </p>
          {stack.length > 0 && (
            <p className={`${MONO_LABEL} mt-2 text-muted-foreground [overflow-wrap:anywhere]`}>{stack.join(' / ')}</p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default CaseStudyCard;
