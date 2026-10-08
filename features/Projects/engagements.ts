import type { Engagement, EngagementKind, Project } from '@/types/project';
import { CASE_STUDIES_META, projectsData } from './constants';

/**
 * Case studies, one per company or client ("engagement"). Projects at the same company share a page.
 *
 * Every figure here is owner-confirmed; other pages may only quote metrics that appear in this file.
 * Leave a field out when it is empty, never `field: undefined`: these objects go through getStaticProps,
 * which rejects undefined values. Sections without data do not render.
 *
 * Array order is the index order: work, then freelance, then side projects.
 */

export const ENGAGEMENT_KIND_LABELS: Record<EngagementKind, string> = {
  work: 'Work',
  freelance: 'Freelance',
  side: 'Side project',
};

export const ENGAGEMENTS: Engagement[] = [
  {
    slug: 'run-system',
    title: 'Run System',
    summary:
      'Software Engineer at Run System. I work on both of its products: Accounting+, a multi-service accounting SaaS, and the enterprise low-code platform, where I maintain the core system and third-party integrations such as payments.',
    kind: 'work',
    projectSlugs: ['accounting-plus', 'platform'],
    image: '/image/projects/accplus.webp',
    color: CASE_STUDIES_META['accounting-plus'].color,
    links: [
      { label: 'Accounting+', href: 'https://accountingplus.id/' },
      { label: 'Run System', href: 'https://runsystem.io/' },
    ],
    headlineMetric: 'BUMN & government clients',
    context: {
      company: 'PT Global Sukses Solusi Tbk (Run System)',
      companyType: 'Publicly listed enterprise software company',
      role: 'Software Engineer',
      period: '2024 - now',
      stack: ['Next.js', 'TypeScript', 'TanStack Query', 'Zustand'],
    },
    problem: [
      'Accounting+ needed ledger screens that show balances in real time, with validation across its tax and accounting modules.',
      'It also ships companion apps: an e-signature app for signing documents sent by email, and a POS cashier app.',
      'Clients from state-owned enterprises (BUMN) and government programs needed third-party integrations to go live.',
      'The low-code platform, where customers build business tools without code, needed its core system and third-party integrations such as payments kept running as it grew.',
    ],
    responsibilities: [
      'Build and maintain the frontend of Accounting+.',
      'Deliver third-party integrations for BUMN and government program clients.',
      'Handle frontend performance work and take part in system design.',
      'Manage and mentor the interns: plan their work, review their code and give feedback.',
      'Maintain the core system of the low-code platform and its third-party integrations, including payments.',
      'Help build the visual editor of the low-code platform.',
      'Help set component standards and review practices across teams.',
    ],
    shipped: [
      {
        title: 'Real-time ledger screens',
        detail: 'Ledger views that show balances in real time, with validation across tax and accounting modules.',
        project: 'accounting-plus',
      },
      {
        title: 'Server data caching',
        detail: 'TanStack Query caching with stale-while-revalidate.',
        project: 'accounting-plus',
      },
      {
        title: 'Third-party integrations',
        detail: 'Integrations delivered for BUMN and government program clients.',
        project: 'accounting-plus',
      },
      {
        title: 'Core system and payment integrations',
        detail: 'Maintenance of the platform core and its third-party integrations, including payments.',
        project: 'platform',
      },
      {
        title: 'Visual editor (contributor)',
        detail: 'Helped build the editor where customers lay out screens without code.',
        project: 'platform',
      },
    ],
    impact: [
      {
        metric: '45%',
        label: 'Better server payload delivery with TanStack Query caching',
        project: 'accounting-plus',
      },
      { label: 'BUMN and government program clients live through the integrations I delivered' },
    ],
    story: [
      { kind: 'h', text: 'The job' },
      {
        kind: 'p',
        text: 'I joined Run System in 2024 as a software engineer, and I work on both of its products. The first is Accounting+, a multi-service accounting SaaS for businesses. Next to the main app it ships companion apps: an e-signature app where people sign documents sent to them by email, and a POS cashier app for stores.',
      },
      {
        kind: 'p',
        text: 'The second is an enterprise low-code platform, where customers make their own business tools in a visual editor. There I maintain the core system and the third-party integrations, such as payments, and I helped build the visual editor.',
      },
      { kind: 'h', text: 'What I do' },
      {
        kind: 'p',
        text: 'On Accounting+ I build and maintain the frontend. I made ledger screens that show balances in real time, with validation across the tax and accounting modules, and added TanStack Query caching with stale-while-revalidate so pages load faster. On the platform I keep the core system running and maintain its third-party integrations, including the payment flow.',
      },
      {
        kind: 'p',
        text: 'My role covers the frontend as a whole, not only features. I handle performance work and take part in system design. I deliver third-party integrations for clients from state-owned enterprises (BUMN) and government programs. I also lead the interns on the team. I break work into tasks they can own, mentor them while they build, and review their code with feedback they can act on, so what they ship is ready for production.',
      },
      {
        kind: 'image',
        src: '/image/projects/platform.webp',
        alt: 'The Run System low-code platform with its visual editor',
        caption: 'The low-code platform, where I maintain the core system and integrations.',
      },
      { kind: 'h', text: 'How it went' },
      {
        kind: 'p',
        text: 'For users, Accounting+ shows balances that update in real time, lets them sign documents straight from their email and runs their stores on the POS app. Pages load faster too: caching made server payload delivery about 45% better.',
      },
      {
        kind: 'p',
        text: 'For the business, the third-party integrations I delivered are what let clients from state-owned enterprises and government programs go live, and the payment integrations I maintain on the platform are how payments go through.',
      },
      {
        kind: 'p',
        text: 'Inside the team, the interns I lead ship real features to production, and I helped set the component standards and review practices used across teams.',
      },
    ],
  },
  {
    slug: 'ombudsman-ri',
    title: 'Ombudsman RI',
    summary:
      'Software engineering intern at Ombudsman RI. I led the team that built and deployed a full inventory management system in three months, with item tracking, role-based access and audit logging.',
    kind: 'work',
    projectSlugs: ['ombudsman-item-management'],
    image: '/image/projects/ombudsman.webp',
    color: CASE_STUDIES_META['ombudsman-item-management'].color,
    links: [{ label: 'Ombudsman RI', href: 'https://ombudsman.go.id/' }],
    headlineMetric: 'Led team',
    context: {
      company: 'Ombudsman Republik Indonesia',
      companyType: 'State institution',
      role: 'Software Engineer (Internship)',
      period: '2023, 3 months',
      stack: ['React', 'TypeScript', 'TanStack Query', 'Tailwind CSS', 'Laravel', 'Docker'],
    },
    problem: [
      'Ombudsman needed an inventory system to track its items, with role-based access and secure data handling.',
      'Records had to hold up under audit, so transaction history could not be removed by normal delete actions.',
      'The system was meant for Ombudsman\'s administrative offices across the country.',
    ],
    responsibilities: [
      'Lead the project team for three months, through to a full delivery and production deployment.',
      'Build the inventory management system with React and Laravel.',
      'Build role-based access control.',
      'Build reporting features and database workflows.',
      'Build audit logging for government assets.',
      'Deploy the system in Docker containers with automated process supervision.',
      'Keep public sector data consistent across reports and records.',
    ],
    decisions: [
      {
        title: 'Keep the audit log out of reach of delete actions',
        problem: 'Transaction history had to survive administrative audits.',
        choice: 'Write audit records to an immutable log, separate from normal delete actions.',
        why: 'It keeps the history intact for audits and reporting requirements.',
      },
      {
        title: 'Scope actions by role',
        problem: 'The brief asked for role-based access to government assets.',
        choice: 'Apply strictly scoped role-based access rules to every action.',
        why: 'It prevents unauthorized database operations.',
      },
      {
        title: 'Run the system in containers',
        problem: 'The system was used by offices across the country.',
        choice: 'Deploy with Docker containers and automated process supervision.',
      },
    ],
    shipped: [
      { title: 'Item tracking', detail: 'One place to track Ombudsman\'s items and assets.' },
      { title: 'Role-based access control', detail: 'Each action is scoped to the user\'s role.' },
      { title: 'Immutable audit logging', detail: 'Audit records cannot be removed by normal delete actions.' },
      { title: 'Reporting features', detail: 'Reports built on clean database workflows.' },
      { title: 'Containerized deployment', detail: 'Docker with automated process supervision.' },
    ],
    impact: [
      { label: 'Used by Ombudsman administrative offices across the country' },
      { label: 'Audit history protected from deletion and unauthorized changes' },
    ],
    lessons: [
      'A clear plan matters more than speed: agree on the scope early and split it by person.',
      'With a fixed deadline, ship the core first and leave polish for last.',
      'With a state institution, settle the rules early, like what must never be deleted.',
    ],
    story: [
      { kind: 'h', text: 'The job' },
      {
        kind: 'p',
        text: 'In 2023 I spent three months at Ombudsman Republik Indonesia as a software engineering intern, working directly for the institution, and I led the team on the project. Ombudsman needed an inventory system to track its items. It had to support role-based access and handle data securely. It was meant for Ombudsman\'s administrative offices across the country.',
      },
      {
        kind: 'p',
        text: 'One requirement shaped most of the work. Records had to hold up under audit. That meant transaction history could not be removed by a normal delete action.',
      },
      { kind: 'h', text: 'What I built' },
      {
        kind: 'p',
        text: 'We built the system with React and TypeScript on the front end, TanStack Query for data fetching, Tailwind CSS for styling and Laravel on the back end. It gave Ombudsman one place to track its items and assets. On top of that I added role-based access control, reporting features and the database workflows behind them.',
      },
      {
        kind: 'image',
        src: '/image/projects/ombudsman.webp',
        alt: 'Inventory management system built for Ombudsman RI',
        caption: 'The inventory system for Ombudsman RI.',
      },
      {
        kind: 'p',
        text: 'For the audit requirement, I wrote audit records to an immutable log, kept separate from normal delete actions. Users could still manage items day to day, but the history stayed intact for audits and reporting.',
      },
      {
        kind: 'p',
        text: 'For access, I applied strictly scoped role rules to every action, not just to what the screen showed. That way a user could not run a database operation their role did not allow.',
      },
      {
        kind: 'p',
        text: 'I also deployed the system in Docker containers with automated process supervision, since offices across the country would rely on it.',
      },
      { kind: 'h', text: 'How it went' },
      {
        kind: 'p',
        text: 'Within the three months, the team delivered the full application and got it deployed to production. It was used by Ombudsman administrative offices across the country. The audit history stayed protected from deletion and unauthorized changes, and reports and records stayed consistent with each other.',
      },
      {
        kind: 'p',
        text: 'What I took away: leading a team as an intern taught me that a clear plan matters more than speed. We agreed on the scope in the first weeks and split it by person. With a fixed three-month window, we shipped the core first (tracking, roles, audit) and left polish for last, so there was always something working to deploy. And working directly with a state institution, I learned to settle the rules early, like what must never be deleted, because changing them late is expensive.',
      },
    ],
  },
  {
    slug: 'qqtech',
    title: 'QQTech',
    summary: 'I worked on the corporate website, blog and internal HR system for QQTech, on Laravel, Vue.js and PostgreSQL.',
    kind: 'work',
    projectSlugs: ['qqtech-website'],
    image: '/image/projects/qltech.webp',
    color: CASE_STUDIES_META['qqtech-website'].color,
    links: [{ label: 'QQTech', href: 'https://qqltech.com/' }],
    headlineMetric: 'Sub-second initial page load',
    context: {
      company: 'QQTech',
      role: 'Software Engineer (Internship)',
      period: '2023',
      stack: ['Laravel', 'Vue.js', 'PostgreSQL', 'Redis'],
    },
    problem: [
      'The company needed a corporate website and a blog that present its products and services, plus an internal HR system.',
      'The HR system had to cover staff onboarding and documentation.',
      'Interfaces were to be built from Figma prototypes made by the UI/UX designers.',
    ],
    responsibilities: [
      "Build the corporate website and blog, with animations that present the company's products and services.",
      'Build the HR system for staff onboarding and documents.',
      'Write REST endpoints in Laravel on PostgreSQL.',
      'Design the relational PostgreSQL schema.',
      'Turn Figma prototypes from the UI/UX designers into working interfaces.',
      'Keep the first page load fast with code splitting, asset compression and Redis caching.',
    ],
    decisions: [
      {
        title: 'Split code and compress static assets',
        choice: 'Split the frontend code and compress static assets.',
        why: 'Together with Redis caching, the first page load stays under a second.',
      },
      {
        title: 'Modular API controllers',
        choice: 'Structure the Laravel API as modular controllers that serve the Vue.js frontends.',
      },
    ],
    shipped: [
      { title: 'Corporate website', detail: 'A modern design with smooth animations that presents the products and services.' },
      { title: 'Blog system', detail: 'A blog and CMS for publishing company content.' },
      { title: 'HR system', detail: 'A portal for staff onboarding and documentation workflows.' },
      { title: 'REST API', detail: 'Laravel endpoints on PostgreSQL behind the HR system.' },
      { title: 'Admin dashboard' },
    ],
    impact: [
      { metric: '< 1s', label: 'Initial page load, with code splitting, asset compression and Redis caching' },
      { label: 'Simpler staff onboarding and documentation' },
    ],
    story: [
      { kind: 'h', text: 'The job' },
      {
        kind: 'p',
        text: 'In 2023 I interned at QQTech as a software engineer, working full-stack on three things: the corporate website, the company blog and an internal HR system. The stack was Laravel, Vue.js and PostgreSQL, with Redis for caching.',
      },
      {
        kind: 'p',
        text: 'The brief was clear. The website and blog had to present the company\'s products and services. The HR system had to handle staff onboarding and documentation. The UI/UX designers made the screens as Figma prototypes, and my job was to turn them into working interfaces.',
      },
      { kind: 'h', text: 'What I built' },
      {
        kind: 'p',
        text: 'I started with the corporate website. It has a modern design and smooth animations that walk visitors through the products and services. Next to it I built the blog, with a CMS so the company could publish its own content.',
      },
      {
        kind: 'image',
        src: '/image/projects/qltech.webp',
        alt: 'QQTech corporate website home page',
        caption: 'The corporate website, built from the designers\' Figma prototypes.',
      },
      {
        kind: 'p',
        text: 'The HR system was the bigger piece. It is a portal for onboarding new staff and managing their documents, with an admin dashboard on top. I designed the relational schema in PostgreSQL and wrote the REST endpoints in Laravel. I kept the API as modular controllers, so each Vue.js frontend could use the parts it needed.',
      },
      {
        kind: 'p',
        text: 'I also wanted the site to feel instant. I split the frontend code, compressed the static assets and cached frequently read data in Redis. That kept the first page load under a second.',
      },
      { kind: 'h', text: 'How it went' },
      {
        kind: 'p',
        text: 'The website, blog, HR portal, admin dashboard and API all shipped. For staff, onboarding moved into one portal: new employees get their documents in one place, and HR manages them from one dashboard. For the business, the CMS lets the company publish its own blog posts without a developer, and the website presents its products in one place and loads in under a second.',
      },
    ],
  },
  {
    slug: 'artifyo',
    title: 'Artifyo',
    summary:
      "Freelance web developer for Artifyo Creative Studio. I built the studio's website: a portfolio of its work, a service catalog and a WhatsApp inquiry link.",
    kind: 'freelance',
    projectSlugs: ['artifyo'],
    image: '/image/projects/artifyo.webp',
    color: CASE_STUDIES_META['artifyo'].color,
    links: [{ label: 'Artifyo', href: 'https://artifyo.id/' }],
    headlineMetric: '< 1s load on 3G and 4G',
    context: {
      company: 'Artifyo Creative Studio',
      companyType: 'Digital creative agency',
      role: 'Freelance web developer',
      period: '2025',
      stack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    problem: [
      'The studio needed a website that shows its high-resolution work and lets visitors get in touch.',
      'It needed a catalog of its services and prices for branding, video animation and design.',
      'Images had to load without shifting the layout or making scrolling slow.',
      'The site had to be mobile-first and load quickly on 3G and 4G.',
    ],
    responsibilities: [
      'Build and deploy the site with Next.js and TypeScript.',
      'Build an aspect-ratio grid with lazy loading for the studio\'s high-resolution work.',
      'Build the service catalog and pricing for branding, video animation and design packages.',
      'Connect the site to WhatsApp so visitors can start a consultation.',
      'Make the layout mobile-first and keep it fast on 3G and 4G.',
    ],
    decisions: [
      {
        title: 'Reserve space for every image',
        problem: 'Images had to load in without moving the content around them.',
        choice: 'Fixed aspect-ratio containers with lazy-loaded images.',
        why: 'The page keeps its shape while media loads.',
      },
      {
        title: 'Send inquiries to WhatsApp',
        problem: 'Visitors needed a way to contact the studio from the site.',
        choice: 'A direct link that opens a WhatsApp chat.',
        why: 'The studio takes consultations over WhatsApp.',
      },
    ],
    shipped: [
      { title: 'Media grid', detail: 'Aspect-ratio grid with lazy loading for high-resolution work.' },
      { title: 'Service catalog and pricing', detail: 'Branding, video animation and design packages.' },
      { title: 'WhatsApp inquiry flow', detail: 'Visitors start a consultation directly in WhatsApp.' },
      { title: 'Mobile-first layout', detail: 'Responsive pages built for phones first and kept fast on 3G and 4G.' },
    ],
    impact: [
      { metric: '< 1s', label: 'Load time on 3G and 4G connections' },
      { label: 'Visitors can start a consultation through WhatsApp' },
      { label: 'High-resolution work loads with minimal layout shift' },
    ],
    lessons: [
      'On image-heavy pages, reserving each image\'s space before it loads is the simplest way to avoid layout shift.',
      'Check the site on a slow mobile connection, not only on fast Wi-Fi.',
    ],
    story: [
      { kind: 'h', text: 'The job' },
      {
        kind: 'p',
        text: "In 2025 I took on a freelance project for Artifyo Creative Studio, a digital creative agency. They needed a website. It had to show their work, list what they offer and let people get in touch.",
      },
      {
        kind: 'p',
        text: "The brief was clear. The studio's work is high-resolution, so the site had to show it well. It also needed a catalog of services and prices for branding, video animation and design. And it had to be mobile-first and load quickly on 3G and 4G, not just on office Wi-Fi.",
      },
      { kind: 'h', text: 'What I built' },
      {
        kind: 'p',
        text: "I built and deployed the site with Next.js, TypeScript and Tailwind CSS. The main piece is a grid that shows the studio's work. Next to it sits the service catalog with its branding, video animation and design packages, each with pricing.",
      },
      {
        kind: 'image',
        src: '/image/projects/artifyo.webp',
        alt: "The Artifyo Creative Studio website showing the studio's work",
        caption: "The Artifyo site, built around the studio's work.",
      },
      {
        kind: 'p',
        text: "Images were the main risk. On a page full of large media, things tend to jump around as each picture arrives. I wanted the images to load without moving the content around them. So every image sits in a container with a fixed aspect ratio, and the images load lazily. The page keeps its shape while the media comes in.",
      },
      {
        kind: 'p',
        text: "For contact, I kept it simple. The studio takes consultations over WhatsApp, so I added a direct link that opens a WhatsApp chat. A visitor can go from looking at the work to talking with the studio in one tap.",
      },
      { kind: 'h', text: 'How it went' },
      {
        kind: 'p',
        text: "The site loads in under a second on 3G and 4G. The high-resolution work loads with minimal layout shift. Visitors can start a consultation through WhatsApp, which is how the studio already works.",
      },
      {
        kind: 'p',
        text: "What I took away is fairly plain. On image-heavy pages, reserving each image's space before it loads is the simplest way to avoid layout shift. And it is worth checking a site on a slow mobile connection, not only on fast Wi-Fi.",
      },
    ],
  },
  {
    slug: 'aliman-bulus',
    title: 'Aliman Bulus',
    summary:
      'Freelance full-stack work for Aliman Bulus Boarding School: a finance system for tuition tracking, monthly ledger checks and admin reports. I wrote the UI specs, built the Next.js frontend and the PostgreSQL ledger backend.',
    kind: 'freelance',
    projectSlugs: ['aliman-bulus'],
    image: '/image/projects/aliman.webp',
    color: CASE_STUDIES_META['aliman-bulus'].color,
    links: [{ label: 'Aliman Bulus', href: 'https://alimanbulus.net/' }],
    headlineMetric: '500+ students on one ledger',
    context: {
      company: 'Aliman Bulus Boarding School',
      companyType: 'Boarding school',
      role: 'Freelance full-stack developer',
      period: '2025',
      stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Docker'],
    },
    problem: [
      'The school needed a system to track student tuition and fees, which until then were kept in paper books.',
      'Treasurers needed a monthly ledger audit and reports for several admin levels.',
      'Records had to cover hundreds of students and keep history across years, with invoices built from it.',
      'Payments posted at the same time had to update balances correctly.',
    ],
    responsibilities: [
      'Write the UI specifications before building the screens.',
      'Build the Next.js frontend and the Node.js backend on PostgreSQL.',
      'Design the database schema for multi-year financial records.',
      'Implement the double-entry ledger logic for student payments.',
      'Build role-based dashboards for school treasurers.',
      'Tune SQL indexes for the ledger queries.',
    ],
    decisions: [
      {
        title: 'Lock balances when posting payments',
        problem: 'Several payments can be posted for the same student at once, and each must land on the balance.',
        choice: 'Atomic database transactions with pessimistic write locks.',
        why: 'Balances are not overwritten, so ledgers and audit reports stay consistent across semesters.',
      },
      {
        title: 'Normalized double-entry schema',
        problem: 'The school wanted history across many years and invoices built from it.',
        choice: 'Normalized PostgreSQL schemas (via Prisma) with double-entry ledger records.',
        why: 'They support multi-year financial history and invoice generation.',
      },
      {
        title: 'Role-based access for finance data',
        problem: 'Reports were needed for several admin levels, not one shared view.',
        choice: 'Role-based access control with dashboards per role.',
        why: 'It keeps the numbers transparent for treasurers and keeps the data secure.',
      },
    ],
    shipped: [
      { title: 'Tuition and fee tracking', detail: 'Student payments are recorded in a double-entry ledger.' },
      { title: 'Monthly ledger audit', detail: 'Treasurers reconcile the ledger each month without paper books.' },
      { title: 'Invoice generation', detail: 'Invoices are built from the stored financial records.' },
      { title: 'Reports for each admin level', detail: 'Each admin tier gets its own financial report.' },
      { title: 'Role-based dashboards for treasurers', detail: 'Each role sees only the data it is allowed to see.' },
      { title: 'Search and filters', detail: 'Staff can search and filter ledger data.' },
    ],
    impact: [
      { metric: '500+', label: 'Students tracked on the ledger instead of paper books' },
      { metric: '< 10ms', label: 'SQL response time after index tuning' },
      { label: 'Finance team spends less time balancing books by hand', note: 'Delivered on time, per the school CEO.' },
    ],
    lessons: [
      'For money records, I plan for concurrent writes from the start; a race in a balance update is easy to miss in testing.',
      'Writing the UI spec first helped keep a short freelance timeline.',
    ],
    story: [
      { kind: 'h', text: 'The job' },
      {
        kind: 'p',
        text: 'In 2025 I took on a freelance project for Aliman Bulus Boarding School. The school tracked student tuition and fees in paper books. They wanted a finance system instead: one place to record payments, run a monthly ledger audit and produce reports for several admin levels.',
      },
      {
        kind: 'p',
        text: 'The records had to cover hundreds of students and keep history across years. Invoices had to come out of that history. And when several payments were posted at the same time, every one of them had to land on the balance correctly.',
      },
      { kind: 'h', text: 'What I built' },
      {
        kind: 'p',
        text: 'I worked across the whole stack. Before building any screens, I wrote the UI specifications. Then I built the Next.js frontend and a Node.js backend on PostgreSQL, using Prisma, Tailwind CSS and Docker.',
      },
      {
        kind: 'p',
        text: 'The core is a double-entry ledger for student payments. I designed a normalized schema so the school could keep financial history over many years and generate invoices from it. On top of that sit role-based dashboards for treasurers, where each role sees only the data it is allowed to see. Each admin tier gets its own report, and staff can search and filter the ledger data.',
      },
      {
        kind: 'image',
        src: '/image/projects/aliman.webp',
        alt: 'Aliman Bulus finance system',
        caption: 'The finance system I built for the school.',
      },
      {
        kind: 'p',
        text: 'The part I was most careful with was posting payments. Two payments for the same student can arrive at once, and a naive update can overwrite one of them. I wrapped each posting in an atomic database transaction with a pessimistic write lock. Balances are not overwritten, so the ledger and the audit reports stay consistent across semesters. I also tuned the SQL indexes for the ledger queries, which brought response times under 10ms.',
      },
      { kind: 'h', text: 'How it went' },
      {
        kind: 'p',
        text: 'More than 500 students are now tracked on the ledger instead of paper books. Treasurers reconcile it each month without the old books, and the finance team spends less time balancing numbers by hand. The school\'s CEO noted that it was delivered on time.',
      },
      {
        kind: 'p',
        text: 'What I took away: with money records, I plan for concurrent writes from the start, because a race in a balance update is easy to miss in testing. And writing the UI spec first helped me keep to a short freelance timeline.',
      },
    ],
  },
  {
    slug: 'recyclops',
    title: 'Recyclops',
    summary:
      'An Android app I built that shows people how to sort their waste, where to take it, and rewards them with points for recycling.',
    kind: 'side',
    projectSlugs: ['recyclops'],
    image: '/image/projects/recyclops.webp',
    color: CASE_STUDIES_META['recyclops'].color,
    links: [{ label: 'Source on GitHub', href: 'https://github.com/DaffaAdityaDev/recyclops' }],
    headlineMetric: 'Works offline',
    context: {
      company: 'Side project',
      companyType: 'Personal project',
      role: 'Android Developer',
      period: '2022',
      stack: ['Android', 'Kotlin', 'Firebase', 'Google Maps API'],
    },
    problem: [
      'Many people want to recycle but do not know how to sort an item or where to take it.',
      'The app had to answer both on the spot: sort the item, scan its barcode, and find the nearest recycling point.',
      'It had to work on a weak signal and catch up with the server once the connection returned.',
    ],
    responsibilities: [
      'Build the native Android app in Kotlin, with Firebase as the backend.',
      'Build waste classification, so users know how to sort an item.',
      'Add camera barcode scanning and routing to the nearest recycling point.',
      'Build the points system that rewards each recycling action.',
      'Make the app work offline and sync to Firebase when back online.',
    ],
    shipped: [
      { title: 'Waste classification', detail: 'Users can check how to sort an item before they throw it away.' },
      { title: 'Camera barcode scanning', detail: 'Users scan a product barcode with the phone camera to look it up.' },
      { title: 'Route to the nearest recycling point', detail: 'The app uses the user location to find and route to the closest recycling point.' },
      { title: 'Points and carbon savings tracker', detail: 'Each recycling action earns points and adds to an estimate of carbon saved.' },
      { title: 'Community map and leaderboard', detail: 'Users see recycling activity on a map and compare points with others.' },
      { title: 'Offline sync for weak connections', detail: 'Actions are saved on the device and sync to Firebase when the connection returns.' },
    ],
    impact: [
      { label: 'Works in low-connectivity areas', note: 'Actions are saved on the device and sync to Firebase later.' },
    ],
    story: [
      { kind: 'h', text: 'The idea' },
      {
        kind: 'p',
        text: 'Most people are willing to recycle. What stops them is two small questions: how do I sort this, and where do I take it? Recyclops is an Android app I built in 2022 to answer both on the spot, and to reward people with points so the habit sticks.',
      },
      { kind: 'h', text: 'What it does' },
      {
        kind: 'p',
        text: 'A user picks up an item and checks how to sort it, or scans its barcode with the phone camera to look it up. When the bag is full, the app finds the nearest recycling point and routes them there with Google Maps. Every recycling action earns points.',
      },
      {
        kind: 'image',
        src: '/image/projects/recyclops.webp',
        alt: 'Recyclops Android app screens',
        caption: 'Recyclops on Android.',
      },
      { kind: 'h', text: 'How I built it' },
      {
        kind: 'p',
        text: 'I built it as a native Android app in Kotlin, with Firebase as the backend. Recycling points are often in places with a weak signal, so the app works offline: each action is saved on the device first and syncs to Firebase once the connection is back. Nothing a user does gets lost because of a bad connection.',
      },
      { kind: 'h', text: 'How it went' },
      {
        kind: 'p',
        text: 'The app covers the full loop, from sorting an item to dropping it off and getting points for it, and it keeps working where the signal drops. The source code is public on GitHub.',
      },
    ],
  },
];

export const getEngagement = (slug: string) => ENGAGEMENTS.find((e) => e.slug === slug);

export const getEngagementProjects = (e: Engagement): Project[] =>
  e.projectSlugs.map((s) => projectsData.find((p) => p.slug === s)).filter((p): p is Project => !!p);

/** Display name of a projectsData slug, e.g. 'accounting-plus' -> 'ACCOUNTING+'. */
export const projectTitle = (slug: string) =>
  projectsData.find((p) => p.slug === slug)?.title.replace(/_/g, ' ') ?? slug;
