import React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import dynamic from 'next/dynamic';
import Seo from '@/components/Seo';
import { ENGAGEMENTS, ENGAGEMENT_KIND_LABELS, getEngagementProjects, projectTitle } from '@/features/Projects/engagements';
import EngagementLayout, {
  type CaseStudyEngagement,
  type HeroShot,
  type NextCaseStudyRef,
} from '@/features/Projects/components/Engagement/EngagementLayout';
import { filled } from '@/features/Projects/components/Engagement/utils';

// Below the fold: the site footer closes the page, as on the blog.
const Footer = dynamic(() => import('@/components/Layout/Footer'), { ssr: true });

// One page per engagement (company or client). Old per-project slugs redirect here from next.config.js.

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ENGAGEMENTS.map((e) => ({ params: { slug: e.slug } })),
  fallback: false,
});

export interface CaseStudyPageProps {
  engagement: CaseStudyEngagement;
  /** Screenshots of the engagement's projects, in display order. */
  shots: HeroShot[];
  /** Project titles, for the spec sheet. */
  projectTitles: string[];
  /** The following engagement, wrapping to the first. */
  next: NextCaseStudyRef;
}

// Everything is computed here so the engagement data stays out of the client bundle.
export const getStaticProps: GetStaticProps<CaseStudyPageProps, { slug: string }> = async ({ params }) => {
  const index = params ? ENGAGEMENTS.findIndex((e) => e.slug === params.slug) : -1;
  if (index < 0) return { notFound: true };
  const e = ENGAGEMENTS[index];
  const following = ENGAGEMENTS[(index + 1) % ENGAGEMENTS.length];
  // Only defined fields: getStaticProps rejects undefined values.
  const engagement: CaseStudyEngagement = {
    slug: e.slug,
    title: e.title,
    summary: e.summary,
    kindLabel: ENGAGEMENT_KIND_LABELS[e.kind],
    image: e.image,
    color: e.color,
    context: e.context,
    links: (e.links ?? []).filter((l) => filled(l.label) && filled(l.href)),
    story: e.story ?? [],
  };
  const next: NextCaseStudyRef = {
    slug: following.slug,
    title: following.title,
    kindLabel: ENGAGEMENT_KIND_LABELS[following.kind],
    image: following.image,
    color: following.color,
  };
  return {
    props: {
      engagement,
      shots: getEngagementProjects(e).map((p) => ({ src: p.image, title: projectTitle(p.slug) })),
      projectTitles: e.projectSlugs.map(projectTitle),
      next,
    },
  };
};

export default function CaseStudyPage({ engagement, shots, projectTitles, next }: CaseStudyPageProps) {
  return (
    <>
      <Seo
        path={`/case-studies/${engagement.slug}`}
        title={`${engagement.title} case study | Daffa Aditya`}
        description={engagement.summary}
        image={engagement.image}
        type="article"
      />
      <div className="selection:bg-red-600 selection:text-white">
        <EngagementLayout engagement={engagement} shots={shots} projectTitles={projectTitles} next={next} />
      </div>
      <Footer />
    </>
  );
}
