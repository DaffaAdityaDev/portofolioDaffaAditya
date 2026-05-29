export interface TimelineNode {
  id: string;
  category: string;
  title: string;
  description: string;
  points: string[];
  techs: string[];
  metric: string;
  image: string;
}

export const TIMELINE_NODES: TimelineNode[] = [
  {
    id: "PROJECT_01",
    category: "Run System Enterprise",
    title: "Platform (Enterprise Low-Code Engine)",
    description: "Maintain and develop an enterprise low-code platform using Next.js and Zustand, optimizing application performance by decoupling core UI logic into a proprietary npm library for cross-project reusability; manage end-to-end feature releases and secure 3rd-party integrations to ensure stable, high-scale production performance.",
    points: [
      "Proprietary NPM Component Library",
      "Decoupled UI Logic & Cross-Project Reuse",
      "Next.js & Zustand State Optimization",
      "Visual Drag & Drop & Flowchart System"
    ],
    techs: ["Next.js", "TypeScript", "Zustand State", "Tailwind CSS", "NPM Library", "Framer Motion"],
    metric: "65% Speed Load Increase",
    image: "/image/projects/platform.webp"
  },
  {
    id: "PROJECT_02",
    category: "Run System Enterprise",
    title: "Accounting+ (SaaS Ecosystem)",
    description: "Architected and maintained a multi-service SaaS ecosystem, implemented secure third-party integrations, and delivered performance optimizations to ensure a fast, scalable experience across distributed frontend architectures.",
    points: [
      "Multi-Service SaaS Architecture",
      "TanStack Query Data Synchronization",
      "Secure Third-Party API Gateways",
      "High-Performance Page Load Velocities"
    ],
    techs: ["Next.js", "TypeScript", "TanStack Query", "REST APIs", "Clean Architecture"],
    metric: "99.9% System Uptime",
    image: "/image/projects/accplus.webp"
  },
  {
    id: "PROJECT_03",
    category: "Ombudsman RI",
    title: "Ombudsman Item Management",
    description: "Developed a high-performance inventory management system for the Ombudsman, featuring tracking system, role-based access control, and secure data handling to support government operations.",
    points: [
      "Role-Based Access Control (RBAC)",
      "High-Performance Asset Tracking",
      "Secure Data Auditing Logs",
      "Government Security Compliant"
    ],
    techs: ["React", "TypeScript", "TanStack Query", "Tailwind CSS", "Security Audit"],
    metric: "100% Asset Accuracy",
    image: "/image/projects/ombudsman.webp"
  },
  {
    id: "PROJECT_04",
    category: "QQTech",
    title: "QQTech Corporate & HR System",
    description: "Developed a corporate website, blog system and backend hr system for QQTech, featuring a modern design and smooth animations to showcase the company's products and services.",
    points: [
      "Integrated HR Management Portal",
      "High-Performance Blog & CMS System",
      "Sleek Modern Design & Micro-animations",
      "Relational PostgreSQL Schema Design"
    ],
    techs: ["Laravel", "Vue.js", "PostgreSQL", "Tailwind CSS", "Admin Dashboard"],
    metric: "40% HR Process Automation",
    image: "/image/projects/qltech.webp"
  },
  {
    id: "PROJECT_05",
    category: "Artifyo Creative Studio",
    title: "Lighthouse-100 Design Platform",
    description: "Designed a high-contrast dark UI and optimized Next.js dynamic routing and edge CDN caching to resolve slow visual performance on image-heavy portfolios, maximizing client conversion rates.",
    points: [
      "100/100 Core Web Vitals Score",
      "Edge CDN Caching & Image Optimization",
      "Micro-animations & Interactive UI/UX",
      "Figma Tokens to Tailwind Variables"
    ],
    techs: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Edge CDN"],
    metric: "100/100 Lighthouse Performance",
    image: "/image/projects/artifyo.webp"
  },
  {
    id: "PROJECT_06",
    category: "Aliman Bulus Boarding School",
    title: "Santri Accounting Ledger",
    description: "Designed the UI specifications, implemented a Next.js frontend, and structured the PostgreSQL double-entry backend logic to track complex ledger payments for hundreds of students under tight deadlines.",
    points: [
      "Double-Entry General Ledgers",
      "Dynamic Data Filtering & Searching",
      "Role-Based Access Control (RBAC)",
      "Prisma ORM & PostgreSQL Schema"
    ],
    techs: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Docker"],
    metric: "80% Admin Reconciliation Redux",
    image: "/image/projects/aliman.webp"
  },
  {
    id: "PROJECT_07",
    category: "Side Project",
    title: "Recyclops Mobile App",
    description: "Gamified mobile-first web app to encourage recycling habits in local communities.",
    points: [
      "Gamified Incentive Mechanisms",
      "Mobile-First Offline Native Experience",
      "Firebase Realtime DB Syncing",
      "Interactive Community Maps & Leaderboard"
    ],
    techs: ["Android Native", "Firebase", "Google Maps API", "Gamification Engine"],
    metric: "Community-Led Clean Initiatives",
    image: "/image/projects/recyclops-min.gif"
  }
];

export const FAQS = [
  {
    q: 'How do we maintain alignment and communication?',
    a: 'We leverage Slack for daily async status updates, a shared Notion dashboard for clear task tracking, and weekly milestones. We integrate our workflow with transparent Git branches so you can view actual code commits live.'
  },
  {
    q: 'What happens if project requirements change mid-flight?',
    a: 'We work in agile milestones. If requirements change, we discuss the impact on timelines and budgets transparently, adjusting the milestone specs before writing code.'
  },
  {
    q: 'Will I be locked to your services indefinitely?',
    a: 'Absolutely not. I deliver highly documented codebases, clean components conforming to storybook layouts, and clear deployment recipes (like Docker/Vercel pipelines) so your internal engineering team can take over.'
  }
];

export const TESTIMONIALS = [
  {
    author: 'Government App System Lead',
    quote: "Daffa has an exceptional ability to jump into complex codebases and immediately establish type safety, modular structures, and fast API layers. He delivered our audit portals ahead of schedule."
  },
  {
    author: 'Creative Director, Artifyo Studio',
    quote: "Daffa bridged the gap between our complex design layouts and raw page performance. Achieving a perfect 100/100 Lighthouse score transformed our client conversion rates."
  },
  {
    author: 'CEO, Aliman Boarding School',
    quote: "The ledger system Daffa built saved our finance team countless hours of manual balancing. Reliable, secure, and completed exactly on time."
  }
];
