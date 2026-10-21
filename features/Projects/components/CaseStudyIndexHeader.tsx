import React from 'react';
import Eyebrow from '@/components/ui/Eyebrow';

interface CaseStudyIndexHeaderProps {
  totalCount: number;
  /** Bottom-right slot, level with the end of the intro: the index tabs. */
  aside: React.ReactNode;
}

/** Poster-style title block. */
const CaseStudyIndexHeader: React.FC<CaseStudyIndexHeaderProps> = ({ totalCount, aside }) => {
  return (
    <header className="relative">
      <div className="flex items-center gap-4">
        <Eyebrow as="span" className="shrink-0">
          Case studies
        </Eyebrow>
        <span aria-hidden="true" className="h-px min-w-6 flex-1 bg-border" />
        <Eyebrow as="span" className="shrink-0">
          {totalCount} {totalCount === 1 ? 'case study' : 'case studies'}
        </Eyebrow>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-y-6 md:mt-10 lg:grid-cols-12 lg:gap-x-8">
        <div className="min-w-0 lg:col-span-7">
          <h1
            className="font-display font-semibold text-white [text-wrap:balance]"
            style={{ fontSize: 'clamp(2.5rem, 4.5vw + 0.75rem, 5.25rem)', lineHeight: 0.88, letterSpacing: '-0.045em' }}
          >
            Technical <br />
            Case Studies
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-[1.6] text-neutral-300 [text-wrap:pretty] md:text-[17px]">
            What I worked on, the decisions I made, what I shipped and what changed. Work is grouped by company; side projects have their own tab.
          </p>
        </div>

        <div className="min-w-0 self-end lg:col-span-5 lg:col-start-8 lg:flex lg:justify-end">{aside}</div>
      </div>
    </header>
  );
};

export default CaseStudyIndexHeader;
