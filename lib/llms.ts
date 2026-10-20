import type { NextApiHandler } from 'next';
import { siteConfig } from '@/config/metadata.config';
import { BLOG_CATEGORY_LABELS } from '@/features/Blog/constants';
import { experienceData, type ExperienceItem } from '@/features/Experience/constants';
import { ENGAGEMENT_KIND_LABELS, ENGAGEMENTS } from '@/features/Projects/engagements';
import { CORE_COMPETENCIES, IDENTIFICATION, SKILL_GROUPS, SUMMARY } from '@/features/Resume/constants';
import { getSortedPostsData } from '@/lib/posts';
import { CURRENT_ROLE, RESUME_PDF_URL, absoluteUrl } from '@/lib/profile';
import type { Engagement } from '@/types/project';

/**
 * Markdown for /llms.txt and /llms-full.txt (https://llmstxt.org), built from the same data
 * modules the pages render, so the two files never drift from the site.
 */

export const LLMS_TXT_PATH = '/llms.txt';
export const LLMS_FULL_TXT_PATH = '/llms-full.txt';

const caseStudyUrl = (slug: string) => absoluteUrl(`/case-studies/${slug}`);
const postUrl = (id: string) => absoluteUrl(`/blog/post/${id}`);

const engagementFor = (item: ExperienceItem): Engagement | undefined =>
  ENGAGEMENTS.find(({ slug }) => item.caseStudy === `/case-studies/${slug}`);

/** Owner-confirmed figures for a role: its case study's metrics, or, without one, the milestones that quote a figure. */
function keyMetrics(item: ExperienceItem): string[] {
  const engagement = engagementFor(item);
  if (engagement) {
    return (engagement.impact ?? []).filter(({ metric }) => metric).map(({ metric, label }) => `${metric}: ${label}`);
  }
  return item.milestones.filter((milestone) => /\d+(%|\+)/.test(milestone));
}

const list = (items: readonly string[], indent = '') => items.map((item) => `${indent}- ${item}`).join('\n');

const section = (title: string, body: string) => `## ${title}\n\n${body}`;

function header(full: boolean): string {
  const intro = full
    ? `The full version of ${siteConfig.url}${LLMS_TXT_PATH}: every role, case study and skill listed on ${siteConfig.url}, generated from the site's data.`
    : `A short, link-first summary of ${siteConfig.url} for LLMs and agents. The expanded version is at ${absoluteUrl(LLMS_FULL_TXT_PATH)}.`;
  return `# ${IDENTIFICATION.name}\n\n> ${IDENTIFICATION.role} in ${IDENTIFICATION.location}. ${SUMMARY}\n\n${intro}`;
}

function about(): string {
  const { education } = siteConfig;
  return section(
    'About',
    list([
      `Name: ${IDENTIFICATION.name}`,
      `Role: ${IDENTIFICATION.role}`,
      `Current position: ${CURRENT_ROLE.role}, ${CURRENT_ROLE.company}, ${CURRENT_ROLE.year}`,
      `Location: ${IDENTIFICATION.location}`,
      `Availability: ${siteConfig.availability}`,
      `Education: ${education.degree}, ${education.school} (${education.year})`,
      `Core competencies: ${CORE_COMPETENCIES.join(', ')}`,
      `[Website](${siteConfig.url}): portfolio, case studies and blog`,
      `[Resume page](${absoluteUrl('/resume')})`,
    ]),
  );
}

function experience(full: boolean): string {
  const entries = experienceData.map((item) => {
    const engagement = engagementFor(item);
    const caseStudy = engagement ? ` [Case study](${caseStudyUrl(engagement.slug)})` : '';
    const head = `- **${item.role}**, ${item.company}, ${item.year}: ${item.description}${caseStudy}`;
    const details = full ? item.milestones : keyMetrics(item);
    if (!details.length) return head;
    return `${head}\n${list(details, '  ')}`;
  });
  return section('Experience', entries.join('\n'));
}

function engagementLine({ slug, title, summary, kind, context, headlineMetric }: Engagement): string {
  const facts = [ENGAGEMENT_KIND_LABELS[kind], context.role, context.period].filter(Boolean).join(', ');
  const metric = headlineMetric ? ` Headline: ${headlineMetric}.` : '';
  return `- [${title}](${caseStudyUrl(slug)}) (${facts}): ${summary}${metric}`;
}

function engagementDetail(engagement: Engagement): string {
  const { title, slug, summary, kind, context, links, problem, responsibilities, decisions, shipped, impact, lessons } =
    engagement;
  const facts = [
    `URL: ${caseStudyUrl(slug)}`,
    `Type: ${ENGAGEMENT_KIND_LABELS[kind]}`,
    `Company: ${context.company}${context.companyType ? ` (${context.companyType})` : ''}`,
    context.role && `Role: ${context.role}`,
    context.period && `Period: ${context.period}`,
    context.teamSize && `Team: ${context.teamSize}`,
    context.stack.length > 0 && `Stack: ${context.stack.join(', ')}`,
    links?.length && `Links: ${links.map(({ label, href }) => `[${label}](${href})`).join(', ')}`,
  ].filter((fact): fact is string => typeof fact === 'string');

  const parts = [`### ${title}`, summary, list(facts)];
  const sub = (heading: string, items?: string[]) => {
    if (items?.length) parts.push(`#### ${heading}\n\n${list(items)}`);
  };
  sub('Problem', problem);
  sub('Responsibilities', responsibilities);
  sub(
    'What shipped',
    shipped?.map(({ title: item, detail }) => (detail ? `${item}: ${detail}` : item)),
  );
  sub(
    'Key decisions',
    decisions?.map(({ title: item, choice, why }) => `${item}: ${choice}${why ? ` ${why}` : ''}`),
  );
  sub(
    'Impact',
    impact?.map(({ metric, label, note }) => `${metric ? `${metric}: ` : ''}${label}${note ? ` (${note})` : ''}`),
  );
  sub('Lessons', lessons);
  return parts.join('\n\n');
}

function caseStudies(full: boolean): string {
  const index = `All case studies: ${absoluteUrl('/case-studies')}`;
  const body = full ? ENGAGEMENTS.map(engagementDetail).join('\n\n') : ENGAGEMENTS.map(engagementLine).join('\n');
  return section('Case studies', `${index}\n\n${body}`);
}

function skills(full: boolean): string {
  const groups = SKILL_GROUPS.map(({ category, skills: items }) => `- ${category}: ${items.join(', ')}`).join('\n');
  const competencies = full ? `\n\nCore competencies:\n\n${list(CORE_COMPETENCIES)}` : '';
  return section('Skills', `${groups}${competencies}`);
}

function blog(full: boolean): string {
  const posts = getSortedPostsData().map(({ id, title, description, date, updated, category, timeToRead }) => {
    const meta = full
      ? [date, updated && `updated ${updated}`, BLOG_CATEGORY_LABELS[category], `${timeToRead} min read`]
          .filter(Boolean)
          .join(', ')
      : date;
    return `- [${title}](${postUrl(id)}) (${meta}): ${description}`;
  });
  return section('Blog posts', `All posts: ${absoluteUrl('/blog')}\n\n${posts.join('\n')}`);
}

function contact(): string {
  const { email, linkedin, github } = siteConfig.links;
  return section(
    'Contact',
    list([
      `Email: [${email}](mailto:${email})`,
      `[LinkedIn](${linkedin})`,
      `[GitHub](${github})`,
      `[Resume (PDF)](${RESUME_PDF_URL})`,
      `[Freelance services](${absoluteUrl('/freelance')}): services, process, FAQ and a project brief form`,
    ]),
  );
}

function optional(full: boolean): string {
  const other = full
    ? `[Short version](${absoluteUrl(LLMS_TXT_PATH)}): the link-first summary`
    : `[Full version](${absoluteUrl(LLMS_FULL_TXT_PATH)}): every milestone, case study detail and skill`;
  return section('Optional', list([other, `[Sitemap](${absoluteUrl('/sitemap.xml')})`]));
}

function build(full: boolean): string {
  return `${[
    header(full),
    about(),
    experience(full),
    caseStudies(full),
    skills(full),
    blog(full),
    contact(),
    optional(full),
  ].join('\n\n')}\n`;
}

export const buildLlmsTxt = () => build(false);
export const buildLlmsFullTxt = () => build(true);

/** API route that serves generated text, with the sitemap's cache policy. */
export const plainTextRoute =
  (generate: () => string): NextApiHandler =>
  (_req, res) => {
    try {
      const body = generate();
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
      res.status(200).send(body);
    } catch {
      res.status(500).json({ error: 'Error generating text' });
    }
  };
