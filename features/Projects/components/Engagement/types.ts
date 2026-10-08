import type { Engagement, EngagementLink, StoryBlock } from '@/types/project';

/** Slice of an engagement the case-study page renders, built in getStaticProps. */
export type CaseStudyEngagement = Pick<Engagement, 'slug' | 'title' | 'summary' | 'image' | 'color' | 'context'> & {
  /** Display label of the engagement kind, e.g. "Freelance". */
  kindLabel: string;
  /** Links with both a label and an href. */
  links: EngagementLink[];
  story: StoryBlock[];
};
