import React from 'react';
import { coverStyle } from '../CaseStudyArt/coverStyle';
import { CONTEXT_LABEL } from './constants';
import type { CaseStudyEngagement } from './types';
import EngagementHero from './EngagementHero';
import type { HeroShot } from './HeroShots';
import SpecSheet from './SpecSheet';
import LinksFooter from './LinksFooter';
import StoryBody from './StoryBody';
import NextCaseStudy, { type NextCaseStudyRef } from './NextCaseStudy';

export type { NextCaseStudyRef } from './NextCaseStudy';
export type { CaseStudyEngagement } from './types';
export type { HeroShot } from './HeroShots';

interface EngagementLayoutProps {
  engagement: CaseStudyEngagement;
  /** Screenshots of the engagement's projects, in display order. */
  shots: HeroShot[];
  /** Project titles, for the spec sheet. */
  projectTitles: string[];
  next: NextCaseStudyRef;
}

const FIRST_SECTION = { id: 'context', label: CONTEXT_LABEL };

/** One case study per engagement: hero, the story as an article with the spec sheet beside it, links, next. */
const EngagementLayout: React.FC<EngagementLayoutProps> = ({ engagement, shots, projectTitles, next }) => {
  const cover = coverStyle(engagement);

  return (
    <main className="relative overflow-x-clip bg-[#0a0a0a] pb-12 font-sans text-zinc-100" style={cover.cssVars}>
      <EngagementHero engagement={engagement} cover={cover} firstSection={FIRST_SECTION} shots={shots} />

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-10">
        <div id={FIRST_SECTION.id} className="scroll-mt-24 pt-8 md:pt-10 xl:grid xl:grid-cols-[minmax(0,1fr)_380px] xl:gap-14">
          <article className="min-w-0 max-w-[68ch]">
            <StoryBody blocks={engagement.story} skipImages={shots.map((s) => s.src)} />
          </article>
          <aside className="mt-12 xl:sticky xl:top-24 xl:mt-0 xl:self-start">
            <SpecSheet engagement={engagement} projectTitles={projectTitles} />
          </aside>
        </div>
        {engagement.links.length > 0 && <LinksFooter links={engagement.links} />}
        <NextCaseStudy next={next} />
      </div>
    </main>
  );
};

export default EngagementLayout;
