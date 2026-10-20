import React from 'react';
import Eyebrow from '@/components/ui/Eyebrow';
import type { EngagementKind } from '@/types/project';

export interface KindCount {
  kind: EngagementKind;
  label: string;
  count: number;
}

interface CaseStudyIndexHeaderProps {
  totalCount: number;
  /** Non-empty kinds, in display order. */
  kindCounts: KindCount[];
}

/** Poster-style title block with plain counts per kind. */
const CaseStudyIndexHeader: React.FC<CaseStudyIndexHeaderProps> = ({ totalCount, kindCounts }) => {
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
        <div className="min-w-0 lg:col-span-8">
          <h1
            className="font-display font-semibold text-white [text-wrap:balance]"
            style={{ fontSize: 'clamp(2.5rem, 4.5vw + 0.75rem, 5.25rem)', lineHeight: 0.88, letterSpacing: '-0.045em' }}
          >
            Technical <br />
            Case Studies
          </h1>
          <p className="mt-4 max-w-[52ch] text-base leading-[1.6] text-neutral-300 [text-wrap:pretty] md:text-[17px]">
            What I worked on, the decisions I made, what I shipped and what changed. Grouped by company.
          </p>
        </div>

        <dl
          aria-label="Engagements by kind"
          className="flex flex-wrap gap-x-5 gap-y-1 self-end font-mono text-2xs uppercase tracking-widest text-muted-foreground lg:col-span-4 lg:col-start-9 lg:justify-end"
        >
          {kindCounts.map(({ kind, label, count }) => (
            <div key={kind} className="flex items-baseline gap-2">
              <dt>{label}</dt>
              <dd className="tabular-nums text-neutral-200">{count}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
};

export default CaseStudyIndexHeader;
