import type { StaticImageData } from 'next/image';
import type { FaqItem, ProcessStep, Service, WorkProof } from '@/types/freelance';
import artifyoShot from '../../../public/image/projects/artifyo.webp';
import alimanShot from '../../../public/image/projects/aliman.webp';
import profilePhoto from '../../../public/image/profile-768.webp';

/**
 * Copy for the /freelance page.
 *
 * Each fact is stated once. Metrics and client claims must also appear in
 * features/Projects/engagements.ts, which holds the owner-confirmed figures.
 */

export const CONTACT_EMAIL = 'daffaaditya.me@gmail.com';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/daffaadityarahman-14b588192/';
export const GITHUB_URL = 'https://github.com/DaffaAdityaDev';

/** Days after launch in which bugs in the agreed scope are fixed for free. */
export const FIX_WINDOW_DAYS = 30;

/** How a fixed-price project is paid. */
export const PAYMENT_TERMS = '50% to start, 50% at launch';

/** The one availability phrase, used by every status badge on the page. */
export const AVAILABILITY = 'Open for new projects';

/** When the owner is reachable: client work happens outside office hours. */
export const CALL_WINDOW = 'After 17:00 WIB';
export const REPLY_WINDOW = 'Within 24 hours';

/**
 * Cal.com event for the free 30-minute call, as "username/event", e.g. 'daffa-aditya/30min'.
 * Empty until it exists: every "Book a call" button and the booking calendar stay hidden.
 */
export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK ?? '';

export const HERO_COPY = {
  kicker: 'Freelance software engineer · Jakarta',
  headline: 'I build the software your business runs on.',
  subtext:
    'Websites, finance and admin systems, and MVPs for businesses and founders. You work directly with me, from the first call to launch.',
} as const;

/** The terms of every engagement. This is the only place they are listed. */
export const ENGAGEMENT_SPEC: readonly { label: string; value: string }[] = [
  { label: 'Pricing', value: 'Fixed price in a written proposal' },
  { label: 'Payment', value: PAYMENT_TERMS },
  { label: 'Progress', value: 'A working preview every week' },
  { label: 'After launch', value: `${FIX_WINDOW_DAYS}-day bug-fix warranty` },
  { label: 'Ownership', value: 'Code, domain and accounts in your name' },
  { label: 'Availability', value: 'Calls after 17:00 WIB, chat anytime' },
];

/** Freelance results only, quoted from engagements.ts. */
export const PROOF_METRICS: readonly { metric: string; label: string; client: string }[] = [
  { metric: '< 1s', label: 'Page load on 3G and 4G', client: 'Artifyo Creative Studio' },
  { metric: '500+', label: 'Students moved from paper books to one ledger', client: 'Aliman Bulus Boarding School' },
];

export const SERVICES: readonly Service[] = [
  {
    id: 'website',
    name: 'Business websites',
    tagline: 'Company profiles, portfolios and marketing sites',
    goodFor:
      'For businesses and studios that need a site that loads instantly on a phone, shows up on Google and gets visitors to get in touch.',
    youGet: [
      'Mobile-first design that loads in under a second',
      'A CMS so you can edit text and images yourself',
      'WhatsApp and email contact built in',
      'Search basics: meta tags, share previews, sitemap',
    ],
    example: { label: 'Artifyo Creative Studio', href: '/case-studies/artifyo' },
    weeks: [1, 6],
  },
  {
    id: 'admin-system',
    name: 'Admin & finance systems',
    tagline: 'Internal tools, records and ledgers',
    goodFor:
      'For organizations still tracking money and operations in spreadsheets or paper books that need one reliable system.',
    youGet: [
      'One database for every transaction and record',
      'Separate access for admins, cashiers, treasurers and leadership',
      'Invoices and reports generated from your records',
      'Full payment history kept across years, never overwritten',
    ],
    example: { label: 'Aliman Bulus Boarding School', href: '/case-studies/aliman-bulus' },
    weeks: [3, 12],
  },
  {
    id: 'web-app',
    name: 'Web apps & MVPs',
    tagline: 'Customer-facing products for early-stage founders',
    goodFor: 'For founders who want a real product in front of customers quickly, to test the idea and start taking payments.',
    youGet: [
      'User accounts: sign up, log in, password reset',
      'The core workflow, ready for real users',
      'Online payments via Stripe, Midtrans or Xendit',
      'Clean code that is easy to keep building on',
    ],
    weeks: [4, 16],
  },
  {
    id: 'improve',
    name: 'Audit, speed & fixes',
    tagline: 'For a site or app you already have',
    goodFor: 'For an existing site or app that feels slow, breaks on phones or keeps throwing bugs.',
    youGet: [
      'A written report of what is slow or unsafe, and why',
      'The fixes, made in your code and deployed',
      'Before-and-after speed measurements',
      'Notes so your next developer can pick it up',
    ],
    weeks: [1, 4],
  },
];

/** Freelance engagements only. Employer work belongs in About, labelled as the day job. */
export const WORK_PROOF: readonly WorkProof[] = [
  {
    id: 'artifyo',
    client: 'Artifyo Creative Studio',
    kind: 'Business website',
    year: '2025',
    title: 'A studio site that stays fast on mobile data',
    problem:
      'The studio needed a high-resolution portfolio that does not crawl on a phone, a service catalog with prices and an easy way to get in touch.',
    built:
      'A gallery that keeps its layout while large images load, a priced catalog of branding, video and design packages, and one-tap WhatsApp consultations.',
    metric: '< 1s',
    metricLabel: 'Page load on 3G and 4G',
    image: artifyoShot,
    imageAlt: 'Artifyo Creative Studio website',
    href: '/case-studies/artifyo',
    liveUrl: 'https://artifyo.id/',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 'aliman-bulus',
    client: 'Aliman Bulus Boarding School',
    kind: 'Finance system',
    year: '2025',
    title: 'From paper books to one finance ledger',
    problem:
      'Tuition and fees for 500+ students were kept in paper books, and the finance team balanced them by hand every month.',
    built:
      'A ledger where two payments posted at the same moment never overwrite each other, with dashboards for each role, a monthly ledger check, invoices and reports for each admin level.',
    metric: '500+',
    metricLabel: 'Students on one ledger instead of paper',
    clientNote: "Delivered on time, per the school's CEO.",
    // Add a real quote only with the client's exact wording and permission, e.g.
    // testimonial: { quote: '…', name: '…', role: 'Head of Finance, Aliman Bulus' },
    image: alimanShot,
    imageAlt: 'Aliman Bulus finance system dashboard',
    href: '/case-studies/aliman-bulus',
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Docker'],
  },
];

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    title: 'Discovery call',
    duration: '30 min · free',
    body: 'We talk through your goals and what a good outcome looks like. No commitment.',
  },
  {
    title: 'Scope and price',
    duration: '2-3 days',
    body: 'A written proposal: the feature list, a week-by-week plan and one all-in price.',
  },
  {
    title: 'Build',
    duration: 'Weekly',
    body: 'Every week you get a link to the real product to try on your phone, so feedback lands while changes are cheap.',
  },
  {
    title: 'Launch',
    duration: 'Last week',
    body: 'It goes live on your hosting, tested on real phones. The code moves to your GitHub, and you get docs and a video walkthrough.',
  },
];

/** The day job, shown next to the photo in the hero and in the About highlights. */
const CREDENTIAL = 'Software Engineer at Run System (PT Global Sukses Solusi Tbk)';

export const ABOUT_ME_DATA = {
  name: 'Daffa Aditya',
  role: 'Software Engineer',
  location: 'Jakarta, Indonesia',
  image: profilePhoto as StaticImageData,
  imageAlt: 'Daffa Aditya, software engineer',
  credential: CREDENTIAL,
  bio: 'I am a software engineer in Jakarta. I build fast web apps, admin and finance systems, and the databases behind them, and I care most that what I ship is easy to use and stays reliable.',
  highlights: [
    `Day job: ${CREDENTIAL} since 2024, delivering integrations for BUMN and government program clients on Accounting+.`,
    'Led the intern team that built an inventory system for Ombudsman RI and deployed it to production in three months.',
    'Freelance: a studio website that loads in under a second on 3G and 4G, and a school finance ledger with 500+ students on it.',
  ],
};

export const FAQS: readonly FaqItem[] = [
  {
    q: 'You have a full-time job. When do you work on my project?',
    a: 'I work on client projects outside my office hours, and calls are scheduled after 17:00 WIB (UTC+7). You can message me any time, and I reply within 24 hours.',
  },
  {
    q: 'How do you price a project?',
    a: 'Tell me what you need and your budget. Within 2-3 days I send a written proposal with the feature list, a week-by-week plan and one fixed price. If the budget does not fit the scope, I suggest what to cut or move to a later phase.',
  },
  {
    q: 'How do payment and invoices work?',
    a: `${PAYMENT_TERMS}. The second half is due only once everything is tested and live on your domain, and every payment comes with an invoice.`,
  },
  {
    q: 'Who owns the code when we are done?',
    a: 'You do. The code moves to your GitHub, and the domain, hosting and every service account are registered in your name from day one. You are never locked in to me, and any developer can pick the project up from the docs I hand over.',
  },
  {
    q: 'What if I want to change something mid-project?',
    a: 'That is normal. Because we work in weekly steps, we look at the time and cost impact before any code is written. You can swap a feature out or move it to a later phase.',
  },
  {
    q: 'What happens after launch?',
    a: `Bugs in the agreed scope are fixed free for ${FIX_WINDOW_DAYS} days. After that, an optional monthly care plan covers hosting checks, dependency updates and small changes. Its price is in the proposal.`,
  },
];
