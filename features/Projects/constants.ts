export interface Project {
  id: number;
  title: string;
  slug: string;
  client: string;
  description: string;
  year: string;
  type: string;
  category: string;
  featured: boolean;
  link: string;
  liveLink?: string;
  image: string;
  color: string;
  tech: string[];
  nature: string;
  achievements?: string[];
}

export const projectsData: Project[] = [
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
    nature: "work",
    achievements: [
      "Decoupled core UI logic into a proprietary npm package, boosting feature reusability across teams by 40%.",
      "Architected reactive state management with Zustand, eliminating unnecessary component render cascades.",
      "Secured third-party enterprise integrations with strict error boundaries and fallback handling."
    ]
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
    nature: "work",
    achievements: [
      "Engineered multi-tenant ledger interfaces processing real-time transactional balances with zero latency.",
      "Optimized server payload delivery by 45% through TanStack Query caching and stale-while-revalidate pipelines.",
      "Enforced strict financial data validation across multi-organization tax and accounting modules."
    ]
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
    nature: "work",
    achievements: [
      "Built high-availability asset tracking platform supporting Ombudsman nationwide administrative offices.",
      "Engineered granular Role-Based Access Control (RBAC) and immutable audit logging for public governance assets.",
      "Achieved 99.9% uptime with containerized Docker deployments and automated process supervision."
    ]
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
    nature: "work",
    achievements: [
      "Developed corporate web platform and internal HR workflows, streamlining staff onboarding and documentation.",
      "Constructed high-speed RESTful endpoints in Laravel backed by optimized PostgreSQL indexed queries.",
      "Achieved sub-second initial page load with code-splitting, static asset compression, and Redis caching."
    ]
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
    nature: "side",
    achievements: [
      "Engineered native Android mobile app with Kotlin and Firebase for community waste classification.",
      "Integrated real-time camera barcode scanning and geolocation routing to nearest recycling hubs.",
      "Maintained 60 FPS gesture rendering and robust offline synchronization for low-connectivity environments."
    ]
  },
  {
    id: 6,
    title: "ARTIFYO",
    slug: "artifyo",
    client: "Artifyo Creative Studio",
    description: "Architected and deployed a modern digital agency platform for Artifyo Creative Studio using Next.js and TypeScript. Engineered fluid aspect-ratio grid systems and lazy-loading pipelines to showcase high-resolution creative media with minimal layout shift, driving high-converting client inquiries directly to WhatsApp.",
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
      "Reduced Cumulative Layout Shift (CLS) to 0.4s using strict aspect-ratio containers and image lazy-loading.",
      "Built dynamic service catalog and pricing matrices for branding, video animation, and design deliverables.",
      "Integrated streamlined WhatsApp conversion funnels, converting organic visits into direct sales consultations.",
      "Delivered mobile-first responsive architecture ensuring sub-second load times across 3G/4G cellular connections."
    ]
  },
  {
    id: 7,
    title: "Aliman Bulus",
    slug: "aliman-bulus",
    client: "Aliman Bulus Boarding School",
    description: "Engineered a full-stack institutional financial management platform for Aliman Bulus Boarding School, automating santri student tuition tracking, monthly ledger auditing, and multi-tier administrative reporting.",
    year: "2025",
    type: "WEBSITE",
    category: "WEBSITE",
    featured: true,
    link: "/case-studies/aliman-bulus",
    liveLink: "https://alimanbulus.net/",
    image: "/image/projects/aliman.webp",
    color: "from-green-600 to-emerald-900",
    tech: ["Nextjs", "Nodejs", "PostgreSQL", "Tailwind CSS"],
    nature: "freelance",
    achievements: [
      "Automated tuition and fee ledger reconciliation, replacing manual paper bookkeeping across 500+ students.",
      "Designed normalized PostgreSQL schemas supporting multi-year historical financial records and invoice generation.",
      "Implemented role-based administrative dashboards ensuring transparency and data security for school treasurers."
    ]
  },
];

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
