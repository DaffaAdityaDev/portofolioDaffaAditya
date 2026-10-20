

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  /** Company logo; leave out until there is one (the modal skips it). */
  image?: string;
  description: string;
  /** Roles without a case study may quote owner-confirmed figures here. */
  milestones: string[];
  /** Case study page for this role, when there is one (e.g. '/case-studies/run-system'). */
  caseStudy?: string;
}

export const experienceData: ExperienceItem[] = [
  {
    year: '2026 - NOW',
    role: 'Frontend Engineer (Contract)',
    company: 'Lawencon Internasional, placed at PNM',
    description:
      'Placed by Lawencon in the Innovation division of PT Permodalan Nasional Madani (PNM), modernizing internal systems with React and Next.js, a shared component library, CI and automated tests.',
    milestones: [
      'Modernize PNM\'s internal systems with React and Next.js frontends integrated with CodeIgniter services and SQL Server.',
      'Implemented a shared library of 20+ reusable UI components, increasing team delivery by ~70% (from 3-4 to 5-7 features per week) and reducing UI regressions.',
      'Built CI pipelines on GitLab CI and Jenkins that run Playwright end-to-end tests on every merge request, catching regressions before release.',
      'Hardened applications against OWASP Top 10 risks with input validation, XSS prevention and security headers, and improved page performance with code splitting, lazy loading and caching.',
    ],
  },
  {
    year: '2024 - 2026 (1 yr 6 mos)',
    role: 'Software Engineer',
    company: 'PT Global Sukses Solusi Tbk (Run System)',
    image: '/image/experience/RUNS.webp',
    caseStudy: '/case-studies/run-system',
    description:
      'I worked on Run System\'s two products in Jakarta: Accounting+, a multi-service accounting SaaS, and an enterprise low-code platform. I delivered third-party integrations for BUMN and government-program clients and mentored the interns.',
    milestones: [
      'Built Accounting+, a multi-service accounting SaaS, plus its companion apps: e-signature by email and a POS cashier app.',
      'Maintained the core system and third-party integrations, including payments, of the enterprise low-code platform, and helped build its visual editor.',
      'Delivered third-party integrations that took BUMN and government-program clients live.',
      'Improved server payload delivery by about 45% with TanStack Query caching, alongside other performance and system design work.',
      'Led and mentored interns, reviewing their code.',
    ],
  },
  {
    year: '2023 (3 months)',
    role: 'Software Engineer (Internship)',
    company: 'Ombudsman Republik Indonesia',
    image: '/image/experience/ombudsman.webp',
    caseStudy: '/case-studies/ombudsman-ri',
    description:
      'Led the intern team; shipped an office and inventory management system with RBAC and audit logging to production in 3 months.',
    milestones: [
      'Led the intern team, working directly for the institution.',
      'Shipped an office and inventory management system to production: item tracking, role-based access control and audit logging.',
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
      'Built Recyclops with my capstone team: an Android app that classifies waste with a machine learning model and looks items up by barcode scan.',
      'Took part in mentoring sessions and code reviews during the program.',
    ],
  },
  {
    year: '2017 - 2018 (6 months)',
    role: 'IT Support (Internship)',
    company: 'PT Jasa Marga (Persero) Tbk',
    image: '/image/experience/jasa_marga.webp',
    description:
      'Gave day-to-day IT support across departments and looked after the office servers and databases.',
    milestones: [
      'Handled hardware and network support requests across departments.',
      'Maintained Linux servers and SQL databases, including their backups.',
      'Kept office workstations, printers and the internal network running.',
    ],
  },
];
