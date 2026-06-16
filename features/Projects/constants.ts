export const projectsData = [
  {
    id: 1,
    title: "PLATFORM",
    slug: "platform",
    client: "Run System",
    description: "Maintain and develop an enterprise low-code platform using Next.js and Zustand, optimizing application performance by decoupling core UI logic into a proprietary npm library for cross-project reusability; manage end-to-end feature releases and secure 3rd-party integrations to ensure stable, high-scale production performance.",
    year: "2024",
    type: "WEB_APP",
    category: "WEB_APP",
    featured: true,
    link: "/case-studies/platform",
    liveLink: "https://runsystem.io/",
    image: "/image/projects/platform.webp",
    color: "from-blue-600 to-indigo-900",
    tech: ["Nextjs", "TypeScript", "Component Library"],
    nature: "work"
  },
  {
    id: 2,
    title: "ACCOUNTING+",
    slug: "accounting-plus",
    client: "Run System",
    description: "Architected and maintained a multi-service SaaS ecosystem, implemented secure third-party integrations, and delivered performance optimizations to ensure a fast, scalable experience across distributed frontend architectures.",
    year: "2024",
    type: "WEB_APP",
    category: "WEB_APP",
    featured: true,
    link: "/case-studies/accounting-plus",
    liveLink: "https://accountingplus.id/",
    image: "/image/projects/accplus.webp",
    color: "from-blue-600 to-indigo-900",
    tech: ["Nextjs", "TypeScript", "TanStack Query"],
    nature: "work"
  },
  {
    id: 3,
    title: "OMBUDSMAN_ITEM_MANAGEMENT",
    slug: "ombudsman-item-management",
    client: "Ombudsman RI",
    description: "Developed a high-performance inventory management system for the Ombudsman, featuring tracking system, role-based access control, and secure data handling to support government operations.",
    year: "2024",
    type: "WEB_APP",
    category: "WEB_APP",
    featured: true,
    link: "/case-studies/ombudsman-item-management",
    liveLink: "https://ombudsman.go.id/",
    image: "/image/projects/ombudsman.webp",
    color: "from-blue-600 to-indigo-900",
    tech: ["React", "TypeScript", "TanStack Query"],
    nature: "work"
  },
  {
    id: 4,
    title: "QQTECH_WEBSITE",
    slug: "qqtech-website",
    client: "QQTech",
    description: "Developed a corporate website, blog system and backend hr system for QQTech, featuring a modern design and smooth animations to showcase the company's products and services.",
    year: "2023",
    type: "WEBSITE",
    category: "WEBSITE",
    featured: true,
    link: "/case-studies/qqtech-website",
    liveLink: "https://qqltech.com/",
    image: "/image/projects/qltech.webp",
    color: "from-purple-600 to-fuchsia-900",
    tech: ["Laravel", "Vuejs", "PostgreSQL"],
    nature: "work"
  },
  {
    id: 5,
    title: "Recyclops",
    slug: "recyclops",
    client: "Side Project",
    description: "Gamified mobile-first web app to encourage recycling habits in local communities.",
    year: "2022",
    type: "MOBILE",
    category: "MOBILE",
    featured: true,
    link: "/case-studies/recyclops",
    liveLink: "https://github.com/DaffaAdityaDev/recyclops",
    image: "/image/projects/recyclops-min.gif",
    color: "from-green-600 to-emerald-900",
    tech: ["Android Native", "Firebase"],
    nature: "side"
  },
  {
    id: 6,
    title: "ARTIFYO",
    slug: "artifyo",
    client: "Artifyo Creative Studio",
    description: "Portofolio website for Artifyo design",
    year: "2025",
    type: "WEBSITE",
    category: "FREELANCE",
    featured: true,
    link: "/case-studies/artifyo",
    liveLink: "https://artifyo.id/",
    image: "/image/projects/artifyo.webp",
    color: "from-green-600 to-emerald-900",
    tech: ["Nextjs", "TypeScript", "Tailwind CSS"],
    nature: "freelance"
  },
  {
    id: 7,
    title: "Aliman Bulus",
    slug: "aliman-bulus",
    client: "Aliman Bulus Boarding School",
    description: "Aliman application help to manage the accounting of santri student.",
    year: "2025",
    type: "WEBSITE",
    category: "WEBSITE",
    featured: true,
    link: "/case-studies/aliman-bulus",
    liveLink: "https://alimanbulus.net/",
    image: "/image/projects/aliman.webp",
    color: "from-green-600 to-emerald-900",
    tech: ["Nextjs", "Nodejs", "PostgreSQL", "Tailwind CSS"],
    nature: "freelance"
  },
];

export type Project = typeof projectsData[0];

export interface ColorSpec {
  accent: 'red' | 'blue' | 'emerald' | 'orange' | 'purple' | 'cyan';
  glow: string;
  pillsBorder: string;
  pillsText: string;
  pillsBg: string;
}

export interface CaseStudyMeta {
  metric: string;
  color: ColorSpec;
}

export const DEFAULT_META: CaseStudyMeta = {
  metric: 'Audited Metric',
  color: {
    accent: 'red',
    glow: 'from-red-500/0 via-red-500/5 to-red-500/0',
    pillsBorder: 'border-red-500/15',
    pillsText: 'text-red-400',
    pillsBg: 'bg-red-500/5'
  }
};

export const CASE_STUDIES_META: Record<string, CaseStudyMeta> = {
  'platform': {
    metric: '99.98% Core Uptime',
    color: {
      accent: 'red',
      glow: 'from-red-500/0 via-red-500/5 to-red-500/0',
      pillsBorder: 'border-red-500/15',
      pillsText: 'text-red-400',
      pillsBg: 'bg-red-500/5'
    }
  },
  'accounting-plus': {
    metric: '180ms Payload Fetch',
    color: {
      accent: 'blue',
      glow: 'from-blue-500/0 via-blue-500/5 to-blue-500/0',
      pillsBorder: 'border-blue-500/15',
      pillsText: 'text-blue-400',
      pillsBg: 'bg-blue-500/5'
    }
  },
  'ombudsman-item-management': {
    metric: 'Role-Based Access Lock',
    color: {
      accent: 'emerald',
      glow: 'from-emerald-500/0 via-emerald-500/5 to-emerald-500/0',
      pillsBorder: 'border-emerald-500/15',
      pillsText: 'text-emerald-400',
      pillsBg: 'bg-emerald-500/5'
    }
  },
  'qqtech-website': {
    metric: '60 FPS Transitions',
    color: {
      accent: 'blue',
      glow: 'from-blue-500/0 via-blue-500/5 to-blue-500/0',
      pillsBorder: 'border-blue-500/15',
      pillsText: 'text-blue-400',
      pillsBg: 'bg-blue-500/5'
    }
  },
  'recyclops': {
    metric: '92% CPU Efficiency',
    color: {
      accent: 'emerald',
      glow: 'from-emerald-500/0 via-emerald-500/5 to-emerald-500/0',
      pillsBorder: 'border-emerald-500/15',
      pillsText: 'text-emerald-400',
      pillsBg: 'bg-emerald-500/5'
    }
  },
  'artifyo': {
    metric: '0.4s CLS Score',
    color: {
      accent: 'red',
      glow: 'from-red-500/0 via-red-500/5 to-red-500/0',
      pillsBorder: 'border-red-500/15',
      pillsText: 'text-red-400',
      pillsBg: 'bg-red-500/5'
    }
  },
  'aliman-bulus': {
    metric: '9ms SQL Latency',
    color: {
      accent: 'red',
      glow: 'from-red-500/0 via-red-500/5 to-red-500/0',
      pillsBorder: 'border-red-500/15',
      pillsText: 'text-red-400',
      pillsBg: 'bg-red-500/5'
    }
  },
  'rivian-mobile-companion': {
    metric: '99.94% BLE Success',
    color: {
      accent: 'orange',
      glow: 'from-orange-500/0 via-orange-500/5 to-orange-500/0',
      pillsBorder: 'border-orange-500/15',
      pillsText: 'text-orange-400',
      pillsBg: 'bg-orange-500/5'
    }
  },
  'help-scout-beacon': {
    metric: '120KB Core Weight',
    color: {
      accent: 'purple',
      glow: 'from-purple-500/0 via-purple-500/5 to-purple-500/0',
      pillsBorder: 'border-purple-500/15',
      pillsText: 'text-purple-400',
      pillsBg: 'bg-purple-500/5'
    }
  },
  'prevue-vector-sharing': {
    metric: '15ms Vector Sync',
    color: {
      accent: 'cyan',
      glow: 'from-cyan-500/0 via-cyan-500/5 to-cyan-500/0',
      pillsBorder: 'border-cyan-500/15',
      pillsText: 'text-cyan-400',
      pillsBg: 'bg-cyan-500/5'
    }
  }
};

export const ACCENT_SPOTLIGHT_COLORS = {
  red: 'rgba(239, 68, 68, 0.04)',
  blue: 'rgba(59, 130, 246, 0.04)',
  emerald: 'rgba(16, 185, 129, 0.04)',
  orange: 'rgba(249, 115, 22, 0.04)',
  purple: 'rgba(168, 85, 247, 0.04)',
  cyan: 'rgba(6, 182, 212, 0.04)'
} as const;
