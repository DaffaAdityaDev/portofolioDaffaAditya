import type { Project, ColorSpec, CaseStudyMeta } from '@/types/project';

export type { Project, ColorSpec, CaseStudyMeta };

export const projectsData: Project[] = [
  {
    id: 1,
    title: "PLATFORM",
    slug: "platform",
    client: "Run System",
    description: "Run System's enterprise low-code platform, where customers build business tools in a visual editor. I maintain the core system and its third-party integrations, including payments, and helped build the visual editor.",
    year: "2024",
    type: "WEB_APP",
    category: "WEB_APP",
    featured: true,
    link: "/case-studies/run-system",
    liveLink: "https://runsystem.io/",
    image: "/image/projects/platform.webp",
    color: "from-blue-600 to-indigo-900",
    tech: ["Nextjs", "TypeScript", "Zustand"],
    nature: "work",
    achievements: [
      "Maintain the core system of the low-code platform.",
      "Maintain its third-party integrations, including the payment flow.",
      "Helped build the visual editor where customers lay out screens without code."
    ]
  },
  {
    id: 2,
    title: "ACCOUNTING+",
    slug: "accounting-plus",
    client: "Run System",
    description: "A multi-service accounting SaaS with companion apps for e-signature by email and POS cashiering. I build and maintain the frontend and deliver third-party integrations for BUMN and government-program clients.",
    year: "2024",
    type: "WEB_APP",
    category: "WEB_APP",
    featured: true,
    link: "/case-studies/run-system",
    liveLink: "https://accountingplus.id/",
    image: "/image/projects/accplus.webp",
    color: "from-blue-600 to-indigo-900",
    tech: ["Nextjs", "TypeScript", "TanStack Query"],
    nature: "work",
    achievements: [
      "Built ledger screens that show balances in real time, with validation across the tax and accounting modules.",
      "Made server payload delivery about 45% better with TanStack Query caching (stale-while-revalidate).",
      "Delivered third-party integrations that let BUMN and government-program clients go live."
    ]
  },
  {
    id: 3,
    title: "OMBUDSMAN_ITEM_MANAGEMENT",
    slug: "ombudsman-item-management",
    client: "Ombudsman RI",
    description: "An inventory management system for Ombudsman RI with item tracking, role-based access control and audit logging. Built during a 3-month internship at the institution, where I led the intern team.",
    year: "2023",
    type: "WEB_APP",
    category: "WEB_APP",
    featured: true,
    link: "/case-studies/ombudsman-ri",
    liveLink: "https://ombudsman.go.id/",
    image: "/image/projects/ombudsman.webp",
    color: "from-blue-600 to-indigo-900",
    tech: ["React", "TypeScript", "TanStack Query", "Laravel"],
    nature: "work",
    achievements: [
      "Led the intern team and shipped the full system to production within three months.",
      "Built role-based access control scoped to every action, and an audit log that normal delete actions cannot touch.",
      "Deployed it in Docker containers with automated process supervision."
    ]
  },
  {
    id: 4,
    title: "QQTECH_WEBSITE",
    slug: "qqtech-website",
    client: "QQTech",
    description: "The corporate website, blog with CMS and internal HR portal for QQTech, built during my 2023 internship with Laravel, Vue.js and PostgreSQL.",
    year: "2023",
    type: "WEBSITE",
    category: "WEBSITE",
    featured: true,
    link: "/case-studies/qqtech",
    liveLink: "https://qqltech.com/",
    image: "/image/projects/qltech.webp",
    color: "from-purple-600 to-fuchsia-900",
    tech: ["Laravel", "Vuejs", "PostgreSQL"],
    nature: "work",
    achievements: [
      "Built the corporate website and a blog with a CMS from the designers' Figma prototypes.",
      "Built the HR portal for staff onboarding and documents, with Laravel REST endpoints on PostgreSQL.",
      "Kept the first page load under a second with code splitting, asset compression and Redis caching."
    ]
  },
  {
    id: 5,
    title: "Recyclops",
    slug: "recyclops",
    client: "Bangkit Academy Capstone",
    description: "A native Android app, built as a team capstone, that classifies waste with machine learning, routes people to the nearest recycling point and rewards them with points. It works offline.",
    year: "2023",
    type: "MOBILE",
    category: "MOBILE",
    featured: true,
    link: "/case-studies/recyclops",
    liveLink: "https://github.com/DaffaAdityaDev/recyclops",
    image: "/image/projects/recyclops.webp",
    color: "from-green-600 to-emerald-900",
    tech: ["Kotlin", "Android", "Firebase"],
    nature: "side",
    achievements: [
      "Built the app in Kotlin with Firebase as the backend, and connected the waste classification model to it.",
      "Added camera barcode scanning and routing to the nearest recycling point with Google Maps.",
      "Made it work offline: actions are saved on the device and sync to Firebase when the connection returns."
    ]
  },
  {
    id: 6,
    title: "ARTIFYO",
    slug: "artifyo",
    client: "Artifyo Creative Studio",
    description: "The website of Artifyo Creative Studio, built with Next.js and TypeScript: a grid of the studio's work, a service catalog with pricing, and inquiries straight to WhatsApp.",
    year: "2025",
    type: "WEBSITE",
    category: "FREELANCE",
    featured: true,
    link: "/case-studies/artifyo",
    liveLink: "https://artifyo.id/",
    image: "/image/projects/artifyo.webp",
    color: "from-green-600 to-emerald-900",
    tech: ["Nextjs", "TypeScript", "Tailwind CSS"],
    nature: "freelance",
    achievements: [
      "Used fixed aspect-ratio containers and lazy-loaded images, so the high-resolution work loads with minimal layout shift.",
      "Built the service catalog with pricing for branding, video animation and design packages.",
      "Added a direct WhatsApp link so visitors can start a consultation in one tap.",
      "Built the layout mobile-first; it loads in under a second on 3G and 4G."
    ]
  },
  {
    id: 7,
    title: "Aliman Bulus",
    slug: "aliman-bulus",
    client: "Aliman Bulus Boarding School",
    description: "A finance system for Aliman Bulus Boarding School: tuition and fee tracking on a double-entry ledger, monthly ledger audits and reports for each admin level. I wrote the UI specs and built the Next.js frontend and the PostgreSQL backend.",
    year: "2025",
    type: "WEB_APP",
    category: "FREELANCE",
    featured: true,
    link: "/case-studies/aliman-bulus",
    liveLink: "https://alimanbulus.net/",
    image: "/image/projects/aliman.webp",
    color: "from-green-600 to-emerald-900",
    tech: ["Nextjs", "Nodejs", "PostgreSQL", "Tailwind CSS"],
    nature: "freelance",
    achievements: [
      "Moved tuition records for 500+ students from paper books to one ledger.",
      "Designed a normalized PostgreSQL schema for multi-year financial history and invoice generation.",
      "Built role-based dashboards for school treasurers."
    ]
  },
];

/**
 * Screen recordings played in the project modal, keyed by slug. `project.image`
 * stays a still WebP (the poster), so hover previews and cards never fetch video.
 */
export const PROJECT_VIDEOS: Record<string, { webm: string; mp4: string }> = {
  'recyclops': {
    webm: '/image/projects/recyclops.webm',
    mp4: '/image/projects/recyclops.mp4'
  }
};

/** Short pill per project. Every figure here must also appear in engagements.ts. */
export const CASE_STUDIES_META: Record<string, CaseStudyMeta> = {
  'platform': {
    metric: 'Payment integrations',
    color: {
      accent: 'emerald',
      glow: 'from-emerald-500/0 via-emerald-500/5 to-emerald-500/0',
      pillsBorder: 'border-emerald-500/15',
      pillsText: 'text-emerald-400',
      pillsBg: 'bg-emerald-500/5'
    }
  },
  'accounting-plus': {
    metric: '45% better payload delivery',
    color: {
      accent: 'blue',
      glow: 'from-blue-500/0 via-blue-500/5 to-blue-500/0',
      pillsBorder: 'border-blue-500/15',
      pillsText: 'text-blue-400',
      pillsBg: 'bg-blue-500/5'
    }
  },
  'ombudsman-item-management': {
    metric: 'Shipped in 3 months',
    color: {
      accent: 'emerald',
      glow: 'from-emerald-500/0 via-emerald-500/5 to-emerald-500/0',
      pillsBorder: 'border-emerald-500/15',
      pillsText: 'text-emerald-400',
      pillsBg: 'bg-emerald-500/5'
    }
  },
  'qqtech-website': {
    metric: 'Sub-second first load',
    color: {
      accent: 'blue',
      glow: 'from-blue-500/0 via-blue-500/5 to-blue-500/0',
      pillsBorder: 'border-blue-500/15',
      pillsText: 'text-blue-400',
      pillsBg: 'bg-blue-500/5'
    }
  },
  'recyclops': {
    metric: 'Works offline',
    color: {
      accent: 'emerald',
      glow: 'from-emerald-500/0 via-emerald-500/5 to-emerald-500/0',
      pillsBorder: 'border-emerald-500/15',
      pillsText: 'text-emerald-400',
      pillsBg: 'bg-emerald-500/5'
    }
  },
  'artifyo': {
    metric: '< 1s on 3G/4G',
    color: {
      accent: 'emerald',
      glow: 'from-emerald-500/0 via-emerald-500/5 to-emerald-500/0',
      pillsBorder: 'border-emerald-500/15',
      pillsText: 'text-emerald-400',
      pillsBg: 'bg-emerald-500/5'
    }
  },
  'aliman-bulus': {
    metric: '500+ students',
    color: {
      accent: 'emerald',
      glow: 'from-emerald-500/0 via-emerald-500/5 to-emerald-500/0',
      pillsBorder: 'border-emerald-500/15',
      pillsText: 'text-emerald-400',
      pillsBg: 'bg-emerald-500/5'
    }
  }
};
