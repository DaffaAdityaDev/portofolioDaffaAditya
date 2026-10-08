

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  image: string;
  description: string;
  milestones: string[];
  /** Case study page for this role, when there is one (e.g. '/case-studies/run-system'). */
  caseStudy?: string;
}

const runSystemYears = new Date().getFullYear() - 2024;

export const experienceData: ExperienceItem[] = [
  {
    year: `2024 - NOW (${runSystemYears > 1 ? `${runSystemYears}+ years` : '1+ year'})`,
    role: 'Software Engineer',
    company: 'PT Global Sukses Solusi Tbk (Run System)',
    image: '/image/experience/RUNS.webp',
    caseStudy: '/case-studies/run-system',
    description:
      'I work on Run System\'s two products in Jakarta: Accounting+, a multi-service accounting SaaS, and an enterprise low-code platform. I deliver third-party integrations for BUMN and government-program clients and mentor the interns.',
    milestones: [
      'Build Accounting+, a multi-service accounting SaaS, plus its companion apps: e-signature by email and a POS cashier app.',
      'Maintain the core system and third-party integrations, including payments, of the enterprise low-code platform, and helped build its visual editor.',
      'Deliver third-party integrations that took BUMN and government-program clients live.',
      'Improved server payload delivery by about 45% with TanStack Query caching, alongside other performance and system design work.',
      'Lead and mentor interns, reviewing their code.',
    ],
  },
  {
    year: '2023 (3 months)',
    role: 'Software Engineer (Internship)',
    company: 'Ombudsman Republik Indonesia',
    image: '/image/experience/ombudsman.webp',
    caseStudy: '/case-studies/ombudsman-ri',
    description:
      'Led the intern team; shipped an inventory system with RBAC and audit logging to production in 3 months.',
    milestones: [
      'Led the intern team, working directly for the institution.',
      'Shipped an inventory system to production: item tracking, role-based access control and audit logging.',
      'Built for Ombudsman administrative offices across the country.',
    ],
  },
  {
    year: '2023',
    role: 'Software Engineer (Internship)',
    company: 'QQTech (PT Quantum Leap)',
    image: '/image/experience/quantum_leap.webp',
    caseStudy: '/case-studies/qqtech',
    description:
      'Built QQTech\'s corporate website, its blog/CMS and an internal HR portal with Laravel, Vue and PostgreSQL.',
    milestones: [
      'Built the corporate website and a blog/CMS for the company.',
      'Built an internal HR portal that simplified staff onboarding and documentation.',
      'Got the first page load under one second with code splitting, asset compression and Redis caching.',
    ],
  },
  {
    year: '2023 (6 months)',
    role: 'Mobile Developer Cohort',
    company: 'Bangkit Academy (Google, GoTo, Traveloka)',
    image: '/image/experience/bangkit.webp',
    description:
      'Six-month Android program run by Google, GoTo and Traveloka. I learned Kotlin and Android architecture and built a capstone app with a team.',
    milestones: [
      'Completed the Android track: Kotlin, Android architecture components and clean architecture.',
      'Built a team capstone Android app with an on-device machine learning model.',
      'Took part in mentoring sessions and code reviews during the program.',
    ],
  },
  {
    year: '2017 - 2018 (6 months)',
    role: 'IT Support (Internship)',
    company: 'PT Jasa Marga (Persero) Tbk',
    image: '/image/experience/jasa_marga.webp',
    description:
      'Gave day-to-day IT support across departments: hardware, networking and software installs.',
    milestones: [
      'Handled hardware and network support requests across departments.',
      'Kept office workstations, printers and the internal network running.',
      'Helped with software installs and troubleshooting.',
    ],
  },
];
