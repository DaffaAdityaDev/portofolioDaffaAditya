import { SAME_AS, siteConfig } from '@/config/metadata.config';
import { experienceData } from '@/features/Experience/constants';
import { DOWNLOAD_URL, IDENTIFICATION, SKILL_GROUPS, SUMMARY } from '@/features/Resume/constants';

/**
 * Facts about the owner derived from the site's data modules, for machine readers:
 * /llms.txt, /llms-full.txt and the home page JSON-LD. Nothing here is typed in twice;
 * change the data modules and every reader follows.
 */

export const absoluteUrl = (path: string): string => (path.startsWith('http') ? path : `${siteConfig.url}${path}`);

/** The newest entry in experienceData is the current role. */
export const CURRENT_ROLE = experienceData[0];

/** "Lawencon Internasional, placed at PNM" -> "Lawencon Internasional". */
export const CURRENT_EMPLOYER = CURRENT_ROLE.company.split(', placed at ')[0];

export const RESUME_PDF_URL = absoluteUrl(DOWNLOAD_URL);

const SOFT_SKILLS_CATEGORY = 'Soft Skills';

/** Technical skills only, in SKILL_GROUPS order. */
export const TECHNICAL_SKILLS = SKILL_GROUPS.filter(({ category }) => category !== SOFT_SKILLS_CATEGORY).flatMap(
  ({ skills }) => skills,
);

/** schema.org Person for the home page. */
export function buildPersonJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: IDENTIFICATION.role,
    description: SUMMARY,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.profileImage),
    email: `mailto:${siteConfig.links.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Jakarta', addressCountry: 'ID' },
    worksFor: {
      '@type': 'Organization',
      name: CURRENT_EMPLOYER,
      description: CURRENT_ROLE.description,
    },
    hasOccupation: {
      '@type': 'Occupation',
      name: CURRENT_ROLE.role,
    },
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: siteConfig.education.school,
    },
    knowsAbout: TECHNICAL_SKILLS,
    sameAs: SAME_AS,
  };
}
