import React from 'react';
import type { GetStaticProps } from 'next';
import Seo from '@/components/Seo';
// Below the fold: static HTML, JS loaded as the page nears the bottom.
import Footer from '@/components/Layout/LazyFooter';
import Container from '@/components/ui/Container';
import { ENGAGEMENTS, ENGAGEMENT_KIND_LABELS, getEngagementProjects, projectTitle } from '@/features/Projects/engagements';
import CaseStudyCard, { type CaseStudyCardData } from '@/features/Projects/components/CaseStudyCard';
import CaseStudyIndexHeader, { type KindCount } from '@/features/Projects/components/CaseStudyIndexHeader';
import { filled, filledList } from '@/features/Projects/components/Engagement/utils';
import type { ShotItem } from '@/features/Projects/components/CaseStudyArt/ProductShot';
import type { Engagement, EngagementKind } from '@/types/project';

interface CaseStudiesIndexProps {
  cards: CaseStudyCardData[];
  totalCount: number;
  kindCounts: KindCount[];
}

const KIND_ORDER: EngagementKind[] = ['work', 'freelance', 'side'];

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
  const kindCounts = KIND_ORDER.map((kind) => ({
    kind,
    label: ENGAGEMENT_KIND_LABELS[kind],
    count: ENGAGEMENTS.filter((e) => e.kind === kind).length,
  })).filter((k) => k.count > 0);

  return {
    props: {
      cards: ENGAGEMENTS.map(toCard),
      totalCount: ENGAGEMENTS.length,
      kindCounts,
    },
  };
};

export default function CaseStudiesIndex({ cards, totalCount, kindCounts }: CaseStudiesIndexProps) {
  return (
    <>
      <Seo
        path="/case-studies"
        title="Case Studies"
        description="Case studies grouped by company: the problem, my decisions, what I shipped and the impact."
      />

      <div className="overflow-x-clip bg-background font-sans text-neutral-100 selection:bg-accent-brand/30 selection:text-red-300">
        <Container as="main" wide className="pb-10 pt-24 md:pt-28">
          <CaseStudyIndexHeader totalCount={totalCount} kindCounts={kindCounts} />

          <section aria-labelledby="cs-index-heading" className="mt-8 border-t border-border pt-6 md:mt-10">
            <h2 id="cs-index-heading" className="sr-only">
              Index
            </h2>

            {/* Every case study renders up front; the list is short enough not to need a "show all". */}
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
              {cards.map((card, i) => {
                const wide = i % 3 === 0;
                return (
                  <li key={card.slug} className={`min-w-0 ${wide ? 'md:col-span-2' : ''}`}>
                    <CaseStudyCard card={card} eager={i === 0} wide={wide} />
                  </li>
                );
              })}
            </ul>
          </section>
        </Container>
        {/* Inside the clipping wrapper so nothing in the footer can widen the page on a phone. */}
        <Footer />
      </div>
    </>
  );
}
