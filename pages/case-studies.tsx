import React from 'react';
import type { GetStaticProps } from 'next';
import Seo from '@/components/Seo';
// Below the fold: static HTML, JS loaded as the page nears the bottom.
import Footer from '@/components/Layout/LazyFooter';
import Container from '@/components/ui/Container';
import Eyebrow from '@/components/ui/Eyebrow';
import {
  ENGAGEMENTS,
  ENGAGEMENT_GROUPS,
  ENGAGEMENT_KIND_LABELS,
  type EngagementGroup,
  getEngagementProjects,
  projectTitle,
} from '@/features/Projects/engagements';
import CaseStudyCard, { type CaseStudyCardData } from '@/features/Projects/components/CaseStudyCard';
import CaseStudyIndexHeader from '@/features/Projects/components/CaseStudyIndexHeader';
import CaseStudyTabs, { CASE_STUDY_PANEL_ID, tabDomId } from '@/features/Projects/components/CaseStudyTabs';
import { filled, filledList } from '@/features/Projects/components/Engagement/utils';
import type { ShotItem } from '@/features/Projects/components/CaseStudyArt/ProductShot';
import { useLocationHash } from '@/hooks/useLocationHash';
import type { Engagement } from '@/types/project';

type CaseStudySection = Omit<EngagementGroup, 'kinds'> & { cards: CaseStudyCardData[] };

interface CaseStudiesIndexProps {
  sections: CaseStudySection[];
}

const ALL_TAB = 'all';

/** One screenshot per project in the engagement (at most two), falling back to the engagement image. */
const shotsFor = (engagement: Engagement): ShotItem[] => {
  const shots = getEngagementProjects(engagement)
    .filter((p) => filled(p.image))
    .map((p) => ({ src: p.image, alt: `${projectTitle(p.slug)} screenshot` }));
  if (shots.length > 0) return shots.slice(0, 2);
  return filled(engagement.image) ? [{ src: engagement.image, alt: `${engagement.title} screenshot` }] : [];
};

const toCard = (e: Engagement): CaseStudyCardData => ({
  slug: e.slug,
  title: e.title,
  summary: e.summary,
  image: e.image,
  accent: e.color.accent,
  kindLabel: ENGAGEMENT_KIND_LABELS[e.kind],
  company: e.context.company,
  role: e.context.role ?? null,
  period: filled(e.context.period) ? e.context.period : null,
  headlineMetric: filled(e.headlineMetric) ? e.headlineMetric : null,
  projectTitles: e.projectSlugs.map(projectTitle),
  stack: filledList(e.context.stack),
  shots: shotsFor(e),
});

// The engagement data is read here at build time only, so it stays out of the page's client chunk.
export const getStaticProps: GetStaticProps<CaseStudiesIndexProps> = async () => {
  return {
    props: {
      sections: ENGAGEMENT_GROUPS.map(({ kinds, ...group }) => ({
        ...group,
        cards: ENGAGEMENTS.filter((e) => kinds.includes(e.kind)).map(toCard),
      })).filter((section) => section.cards.length > 0),
    },
  };
};

export default function CaseStudiesIndex({ sections }: CaseStudiesIndexProps) {
  // The tab lives in the hash (#work, #side-projects) so a filtered view can be linked. The hash is
  // empty in the static HTML, so it always renders "All" and hydration matches.
  const [hash, setHash] = useLocationHash();
  const activeTab = sections.some((section) => section.id === hash) ? hash : ALL_TAB;
  const showAll = activeTab === ALL_TAB;
  const totalCount = sections.reduce((n, section) => n + section.cards.length, 0);

  const tabs = [
    { id: ALL_TAB, label: 'All', count: totalCount },
    ...sections.map(({ id, title, cards }) => ({ id, label: title, count: cards.length })),
  ];

  return (
    <>
      <Seo
        path="/case-studies"
        title="Case Studies"
        description="Case studies from my work, grouped by company, and from my side projects: the problem, my decisions, what I shipped and the impact."
      />

      <div className="overflow-x-clip bg-background font-sans text-neutral-100 selection:bg-accent-brand/30 selection:text-red-300">
        <Container as="main" wide className="pb-10 pt-24 md:pt-28">
          <CaseStudyIndexHeader
            totalCount={totalCount}
            aside={
              <CaseStudyTabs tabs={tabs} activeId={activeTab} onChange={(id) => setHash(id === ALL_TAB ? '' : id)} />
            }
          />

          {/* Every card is in the static HTML; a tab only hides the sections it filters out. */}
          <div id={CASE_STUDY_PANEL_ID} role="tabpanel" aria-labelledby={tabDomId(activeTab)}>
            {sections.map((section, sectionIndex) => (
              <section
                key={section.id}
                aria-labelledby={`cs-${section.id}-heading`}
                hidden={!showAll && activeTab !== section.id}
                className="mt-8 border-t border-border pt-6 md:mt-10"
              >
                {/* With one section showing, the selected tab already names it. */}
                <div className={showAll ? 'mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 md:mb-6' : 'sr-only'}>
                  <h2
                    id={`cs-${section.id}-heading`}
                    className="font-display text-2xl font-semibold tracking-tight text-white md:text-3xl"
                  >
                    {section.title}
                  </h2>
                  <Eyebrow as="p" className="tabular-nums">
                    {section.note} / {section.cards.length}
                  </Eyebrow>
                </div>

                {/* Every case study renders up front; the list is short enough not to need a "show all". */}
                <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                  {section.cards.map((card, i) => {
                    const wide = i % 3 === 0;
                    return (
                      <li key={card.slug} className={`min-w-0 ${wide ? 'md:col-span-2' : ''}`}>
                        <CaseStudyCard card={card} eager={sectionIndex === 0 && i === 0} wide={wide} />
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </Container>
        {/* Inside the clipping wrapper so nothing in the footer can widen the page on a phone. */}
        <Footer />
      </div>
    </>
  );
}
