import React from 'react';
import Link from 'next/link';
import DotMatrixArt from '@/components/ui/DotMatrixArt';
import { coverStyle } from './CaseStudyArt/coverStyle';
import { ArrowSquare, CornerBrackets } from './CaseStudyArt/parts';
import { PosterShots, type ShotItem } from './CaseStudyArt/ProductShot';
import type { ColorSpec } from '@/types/project';

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

const MONO_LABEL = 'font-mono text-[11px] uppercase tracking-[0.14em]';
const HUD_CHIP = `${MONO_LABEL} bg-[rgba(6,6,8,0.75)] px-2 py-1 text-zinc-300`;

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
        className={`grid h-full min-w-0 border border-white/[0.08] bg-[#0c0c0e] transition-colors duration-200 hover:border-[var(--cs-accent-line)] focus-visible:border-[var(--cs-accent-line)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500 ${
          wide ? 'md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]' : 'grid-rows-[auto_1fr]'
        }`}
      >
        <div
          className={`relative aspect-[16/10] overflow-hidden bg-[#060608] ${
            wide ? 'md:aspect-auto md:min-h-[300px] md:border-r md:border-white/[0.08]' : ''
          }`}
        >
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
            style={{ background: 'linear-gradient(to top, #060608 0%, rgba(6,6,8,0.6) 45%, transparent 100%)' }}
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
              className="min-w-0 font-display font-semibold text-[#fafafa] [overflow-wrap:anywhere] [text-wrap:balance]"
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
            <p className={`${MONO_LABEL} leading-[1.6] text-zinc-300 [overflow-wrap:anywhere]`}>{company}</p>
            {headlineMetric && (
              <p className={`${MONO_LABEL} leading-[1.6] text-[var(--cs-accent)] [overflow-wrap:anywhere]`}>
                Impact {headlineMetric}
              </p>
            )}
            {showSecondary && (
              <p className={`${MONO_LABEL} leading-[1.6] text-zinc-400 [overflow-wrap:anywhere]`}>{secondary}</p>
            )}
            {projectTitles.length > 1 && (
              <p className={`${MONO_LABEL} leading-[1.6] text-zinc-400 [overflow-wrap:anywhere]`}>
                Projects: {projectTitles.join(' + ')}
              </p>
            )}
          </div>

          <p className="max-w-[62ch] text-[15px] leading-[1.6] text-zinc-300 [text-wrap:pretty] sm:text-base">
            {summary}
          </p>
          {stack.length > 0 && (
            <p className={`${MONO_LABEL} mt-2 text-zinc-400 [overflow-wrap:anywhere]`}>{stack.join(' / ')}</p>
          )}
        </div>
      </Link>
    </article>
  );
};

export default CaseStudyCard;
