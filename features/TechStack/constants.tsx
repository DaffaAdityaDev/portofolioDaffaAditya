import React from 'react';
import { Layers, Database, TabletSmartphone, Cpu, Palette, Sparkles } from 'lucide-react';

/** 'project': used in a project on this site (named in `role`). 'familiar': worked with outside those projects. */
export type TechUsage = 'project' | 'familiar';

export interface TechProcess {
  name: string;
  roleLabel: string;
  role: string;
  usage: TechUsage;
  patterns: string[];
}

export interface TechModule {
  /** Stable key for React and the shared layout animation. Not shown. */
  id: string;
  name: string;
  headline: string;
  description: string;
  status: string;
  icon: React.ReactNode;
  pillars: { label: string; value: string }[];
  processes: TechProcess[];
}

export const TECH_USAGE_LABELS: Record<TechUsage, string> = {
  project: 'Used in my projects',
  familiar: 'Also worked with',
};

export const diagnosticStack: TechModule[] = [
  {
    id: 'frontend',
    name: 'FRONTEND',
    headline: 'Frontend',
    description:
      'My main area. I build and maintain the frontend of Accounting+ and the Run System low-code platform, and I built the frontends of my freelance projects.',
    status: 'USED AT WORK',
    icon: <Layers size={18} />,
    pillars: [
      { label: 'MAIN STACK', value: 'Next.js, React, TypeScript' },
      { label: 'DATA', value: 'TanStack Query, Zustand' },
      { label: 'WHERE', value: 'PNM, Run System, Ombudsman RI, freelance' },
    ],
    processes: [
      {
        name: 'React',
        roleLabel: 'UI',
        role: 'Used at PNM, at Run System and on the Ombudsman RI office and inventory system.',
        usage: 'project',
        patterns: ['Custom Hooks', 'Memoization', 'Component Composition'],
      },
      {
        name: 'Next.js',
        roleLabel: 'Framework',
        role: 'Accounting+, the Run System low-code platform, Artifyo and Aliman Bulus.',
        usage: 'project',
        patterns: ['SSR', 'Static Generation', 'Image Optimization'],
      },
      {
        name: 'TypeScript',
        roleLabel: 'Language',
        role: 'The default language for my frontend work at Run System and on freelance projects.',
        usage: 'project',
        patterns: ['Strict Mode', 'Generics', 'Type Guards'],
      },
      {
        name: 'TanStack Query',
        roleLabel: 'Server State',
        role: 'Caching with stale-while-revalidate on Accounting+, which made server payload delivery about 45% better. Also used at Ombudsman RI.',
        usage: 'project',
        patterns: ['Stale-While-Revalidate', 'Cache Invalidation', 'Pagination'],
      },
      {
        name: 'Zustand',
        roleLabel: 'State',
        role: 'Client state on the Run System low-code platform.',
        usage: 'project',
        patterns: ['Store Slices', 'Selectors'],
      },
      {
        name: 'Tailwind CSS',
        roleLabel: 'Styling',
        role: 'Styling for Ombudsman RI, Artifyo, Aliman Bulus and this site.',
        usage: 'project',
        patterns: ['Utility Classes', 'Responsive Layout', 'Theming'],
      },
      {
        name: 'Vue.js',
        roleLabel: 'UI',
        role: 'Frontends of the QQTech website, blog and HR portal.',
        usage: 'project',
        patterns: ['Components', 'API Integration'],
      },
      {
        name: 'Vite',
        roleLabel: 'Build Tool',
        role: 'Dev server and bundling for React projects outside Next.js.',
        usage: 'familiar',
        patterns: ['ESM', 'Code Splitting'],
      },
      {
        name: 'Radix UI',
        roleLabel: 'Accessible UI',
        role: 'Unstyled, accessible primitives for dialogs, menus and focus handling.',
        usage: 'familiar',
        patterns: ['WAI-ARIA', 'Focus Management', 'Keyboard Navigation'],
      },
      {
        name: 'Zod',
        roleLabel: 'Validation',
        role: 'Schema validation for forms and API responses, with types inferred from the schema.',
        usage: 'familiar',
        patterns: ['Runtime Validation', 'Inferred Types'],
      },
    ],
  },
  {
    id: 'backend',
    name: 'BACKEND',
    headline: 'Backend and Data',
    description:
      'Laravel and PostgreSQL at QQTech, a Node.js and PostgreSQL ledger for Aliman Bulus, and Laravel at Ombudsman RI. Outside those projects I have also worked with Go, Kafka, ElasticSearch and GraphQL.',
    status: 'USED IN PROJECTS',
    icon: <Database size={18} />,
    pillars: [
      { label: 'MAIN STACK', value: 'Laravel, Node.js, PostgreSQL' },
      { label: 'DATA', value: 'Relational schemas, transactions' },
      { label: 'WHERE', value: 'PNM, QQTech, Ombudsman RI, Aliman Bulus' },
    ],
    processes: [
      {
        name: 'PostgreSQL',
        roleLabel: 'Database',
        role: 'Schema design for the QQTech HR system and the Aliman Bulus double-entry ledger, with transactions and row locks for concurrent payments.',
        usage: 'project',
        patterns: ['Schema Design', 'Indexing', 'Transactions'],
      },
      {
        name: 'Laravel',
        roleLabel: 'Backend',
        role: 'REST endpoints for the QQTech HR system and the backend of the Ombudsman RI inventory system.',
        usage: 'project',
        patterns: ['REST API', 'Modular Controllers', 'RBAC'],
      },
      {
        name: 'Node.js',
        roleLabel: 'Backend',
        role: 'The backend of the Aliman Bulus finance system.',
        usage: 'project',
        patterns: ['REST API', 'Role-Based Access'],
      },
      {
        name: 'Prisma',
        roleLabel: 'ORM',
        role: 'Schema and queries for the Aliman Bulus ledger.',
        usage: 'project',
        patterns: ['Schema Migrations', 'Transactions'],
      },
      {
        name: 'Redis',
        roleLabel: 'Cache',
        role: 'Caching frequently read data on the QQTech website.',
        usage: 'project',
        patterns: ['Key-Value Cache', 'TTL Expiry'],
      },
      {
        name: 'Go',
        roleLabel: 'Services',
        role: 'Backend services with goroutines and channels.',
        usage: 'familiar',
        patterns: ['Goroutines & Channels', 'Standard Library'],
      },
      {
        name: 'Fiber',
        roleLabel: 'Go Web',
        role: 'Fast REST APIs in Go with Express-style routing and middleware.',
        usage: 'familiar',
        patterns: ['REST API', 'Middleware'],
      },
      {
        name: 'Kafka',
        roleLabel: 'Messaging',
        role: 'Event streaming between services with topics and consumer groups.',
        usage: 'familiar',
        patterns: ['Pub/Sub', 'Consumer Groups'],
      },
      {
        name: 'ElasticSearch',
        roleLabel: 'Search',
        role: 'Full-text search and indexing.',
        usage: 'familiar',
        patterns: ['Full-Text Search', 'Indexing'],
      },
      {
        name: 'GraphQL',
        roleLabel: 'API',
        role: 'Schema-first APIs and typed queries from the client.',
        usage: 'familiar',
        patterns: ['Schemas', 'Resolvers'],
      },
      {
        name: 'Express.js',
        roleLabel: 'REST API',
        role: 'REST APIs with middleware for auth and request validation.',
        usage: 'familiar',
        patterns: ['Middleware', 'JWT Auth', 'Request Validation'],
      },
      {
        name: 'MongoDB',
        roleLabel: 'Document DB',
        role: 'Document storage and aggregation pipelines.',
        usage: 'familiar',
        patterns: ['Aggregation Pipelines', 'Flexible Schemas'],
      },
      {
        name: 'Drizzle ORM',
        roleLabel: 'ORM',
        role: 'Type-safe SQL queries and schema migrations.',
        usage: 'familiar',
        patterns: ['Schema Migrations', 'Typed Queries'],
      },
      {
        name: 'CodeIgniter',
        roleLabel: 'Backend',
        role: 'The services behind the PNM internal systems I modernize with React and Next.js.',
        usage: 'project',
        patterns: ['MVC', 'REST API'],
      },
      {
        name: 'SQL Server',
        roleLabel: 'Database',
        role: 'The database behind the PNM internal systems.',
        usage: 'project',
        patterns: ['Relational Schemas', 'T-SQL'],
      },
      {
        name: 'MySQL',
        roleLabel: 'Database',
        role: 'The database of the Ombudsman RI office and inventory system.',
        usage: 'project',
        patterns: ['Relational Schemas', 'SQL Queries'],
      },
      {
        name: 'SQLite',
        roleLabel: 'Embedded DB',
        role: 'File-based database for local apps, prototypes and tests.',
        usage: 'familiar',
        patterns: ['Embedded Storage', 'Zero Config'],
      },
      {
        name: 'Python',
        roleLabel: 'Scripting',
        role: 'Scripts and small services for automation and data tasks.',
        usage: 'familiar',
        patterns: ['Scripting', 'Automation'],
      },
    ],
  },
  {
    id: 'mobile',
    name: 'MOBILE & DESKTOP',
    headline: 'Mobile and Desktop',
    description:
      'I built Recyclops, my Bangkit Academy team capstone, as a native Android app in Kotlin with Firebase, ML waste classification and offline sync. I have also worked with React Native, Expo, Electron and Tauri.',
    status: 'USED IN PROJECTS',
    icon: <TabletSmartphone size={18} />,
    pillars: [
      { label: 'NATIVE', value: 'Android (Kotlin)' },
      { label: 'BACKEND', value: 'Firebase' },
      { label: 'WHERE', value: 'Recyclops' },
    ],
    processes: [
      {
        name: 'Kotlin (Android)',
        roleLabel: 'Native App',
        role: 'Recyclops: waste classification, camera barcode scanning and offline use.',
        usage: 'project',
        patterns: ['Native Android', 'Camera', 'Offline First'],
      },
      {
        name: 'Firebase',
        roleLabel: 'Backend',
        role: 'The Recyclops backend. Actions saved on the device sync to it when the connection returns.',
        usage: 'project',
        patterns: ['Offline Sync', 'Auth', 'Realtime Data'],
      },
      {
        name: 'Google Maps API',
        roleLabel: 'Location',
        role: 'Routing Recyclops users to the nearest recycling point.',
        usage: 'project',
        patterns: ['Geolocation', 'Routing'],
      },
      {
        name: 'React Native',
        roleLabel: 'Mobile',
        role: 'Cross-platform mobile apps with shared business logic.',
        usage: 'familiar',
        patterns: ['Native Components', 'Shared Logic'],
      },
      {
        name: 'Expo',
        roleLabel: 'Mobile Tooling',
        role: 'Builds and device modules such as camera and location.',
        usage: 'familiar',
        patterns: ['EAS Builds', 'Native Modules'],
      },
      {
        name: 'Electron',
        roleLabel: 'Desktop',
        role: 'Desktop apps with a web frontend and IPC to the main process.',
        usage: 'familiar',
        patterns: ['IPC', 'File System'],
      },
      {
        name: 'Tauri',
        roleLabel: 'Desktop',
        role: 'Small desktop apps with a web frontend and a Rust backend.',
        usage: 'familiar',
        patterns: ['Rust Backend', 'Small Binaries'],
      },
      {
        name: 'Jetpack Compose',
        roleLabel: 'Android UI',
        role: 'Declarative Android screens built from composables.',
        usage: 'familiar',
        patterns: ['Composables', 'State Hoisting'],
      },
    ],
  },
  {
    id: 'devops',
    name: 'DEVOPS & CLOUD',
    headline: 'Deployment and Cloud',
    description:
      'I deployed the Ombudsman RI inventory system in Docker containers with automated process supervision, and used Docker for Aliman Bulus. I have also worked with AWS, GCP and Cloudflare.',
    status: 'USED IN PROJECTS',
    icon: <Cpu size={18} />,
    pillars: [
      { label: 'CONTAINERS', value: 'Docker' },
      { label: 'CLOUD', value: 'AWS, GCP, Cloudflare' },
      { label: 'WHERE', value: 'PNM, Ombudsman RI, Aliman Bulus' },
    ],
    processes: [
      {
        name: 'Docker',
        roleLabel: 'Containers',
        role: 'Containerized deployment with automated process supervision for Ombudsman RI. Also used for Aliman Bulus.',
        usage: 'project',
        patterns: ['Containers', 'Process Supervision', 'Multi-Stage Builds'],
      },
      {
        name: 'AWS & GCP',
        roleLabel: 'Cloud',
        role: 'Compute, storage and managed services.',
        usage: 'familiar',
        patterns: ['Compute', 'Object Storage'],
      },
      {
        name: 'Cloudflare',
        roleLabel: 'Edge',
        role: 'DNS, edge caching and hosting.',
        usage: 'familiar',
        patterns: ['DNS', 'Edge Caching'],
      },
      {
        name: 'CI/CD',
        roleLabel: 'Release',
        role: 'Pipelines that run checks and deploy on merge.',
        usage: 'familiar',
        patterns: ['Automated Checks', 'Deploy on Merge'],
      },
      {
        name: 'Linux Servers',
        roleLabel: 'Self-Hosting',
        role: 'Setting up and maintaining self-hosted servers, with backups.',
        usage: 'familiar',
        patterns: ['Server Setup', 'Backups'],
      },
      {
        name: 'Error Tracking',
        roleLabel: 'Monitoring',
        role: 'Exception tracking and alerts in production apps.',
        usage: 'familiar',
        patterns: ['Stack Traces', 'Alerts'],
      },
      {
        name: 'Playwright',
        roleLabel: 'E2E Tests',
        role: 'End-to-end tests at PNM that run on every merge request.',
        usage: 'project',
        patterns: ['E2E Tests', 'Merge Request Checks'],
      },
      {
        name: 'GitLab CI & Jenkins',
        roleLabel: 'Pipelines',
        role: 'The PNM CI pipelines that run the Playwright suite before release.',
        usage: 'project',
        patterns: ['Pipelines', 'Regression Gates'],
      },
      {
        name: 'Git & GitHub',
        roleLabel: 'Version Control',
        role: 'Branching, pull requests and code review on every project.',
        usage: 'familiar',
        patterns: ['Branching', 'Pull Requests'],
      },
      {
        name: 'Vercel',
        roleLabel: 'Hosting',
        role: 'Hosting and preview deploys for Next.js apps.',
        usage: 'familiar',
        patterns: ['Preview Deploys', 'Edge Network'],
      },
      {
        name: 'Grafana',
        roleLabel: 'Dashboards',
        role: 'Dashboards and alerts for service metrics.',
        usage: 'familiar',
        patterns: ['Dashboards', 'Alerts'],
      },
      {
        name: 'Microservices',
        roleLabel: 'Architecture',
        role: 'Splitting a system into services that talk over APIs and queues.',
        usage: 'familiar',
        patterns: ['Service Boundaries', 'Async Messaging'],
      },
    ],
  },
  {
    id: 'design',
    name: 'UI/UX & TOOLS',
    headline: 'Design and UI',
    description:
      'At QQTech I turned Figma prototypes from the UI/UX designers into working interfaces. At Run System I helped set the component standards used across teams.',
    status: 'USED AT WORK',
    icon: <Palette size={18} />,
    pillars: [
      { label: 'DESIGN', value: 'Figma to code' },
      { label: 'COMPONENTS', value: 'Shared component standards' },
      { label: 'WHERE', value: 'QQTech, Run System' },
    ],
    processes: [
      {
        name: 'Figma',
        roleLabel: 'Design Handoff',
        role: 'Building the QQTech website and HR portal from the designers\' Figma prototypes.',
        usage: 'project',
        patterns: ['Prototypes', 'Auto-Layout', 'Handoff'],
      },
      {
        name: 'Component Standards',
        roleLabel: 'Design System',
        role: 'Helped set the component standards and review practices used across teams at Run System.',
        usage: 'project',
        patterns: ['Reusable Components', 'Code Review'],
      },
      {
        name: 'Framer Motion',
        roleLabel: 'Animation',
        role: 'Layout and page transitions on this site.',
        usage: 'project',
        patterns: ['Layout Animations', 'Spring Physics'],
      },
      {
        name: 'Storybook',
        roleLabel: 'Components',
        role: 'Building and documenting components in isolation.',
        usage: 'familiar',
        patterns: ['Component Isolation', 'Docs'],
      },
      {
        name: 'Photoshop & Adobe XD',
        roleLabel: 'Assets',
        role: 'Image editing, vector assets, SVG exports and quick UI mockups.',
        usage: 'familiar',
        patterns: ['Vector Graphics', 'SVG Export', 'Mockups'],
      },
    ],
  },
  {
    id: 'ai',
    name: 'AI & AUTOMATION',
    headline: 'AI and Automation',
    description:
      'LLM tooling I have worked with: agent workflows, retrieval and automation. None of the projects on this site use it.',
    status: 'ALSO WORKED WITH',
    icon: <Sparkles size={18} />,
    pillars: [
      { label: 'AGENTS', value: 'LangChain, LangGraph, MCP' },
      { label: 'RETRIEVAL', value: 'pgvector, RAG' },
      { label: 'AUTOMATION', value: 'n8n' },
    ],
    processes: [
      {
        name: 'LangChain & LangGraph',
        roleLabel: 'Agents',
        role: 'Agent workflows with tool calling and stateful graphs.',
        usage: 'familiar',
        patterns: ['Tool Calling', 'State Graphs'],
      },
      {
        name: 'pgvector & RAG',
        roleLabel: 'Retrieval',
        role: 'Embeddings in PostgreSQL and retrieval for LLM answers.',
        usage: 'familiar',
        patterns: ['Embeddings', 'Hybrid Search', 'Chunking'],
      },
      {
        name: 'Model Context Protocol (MCP)',
        roleLabel: 'Tools',
        role: 'MCP servers that give agents access to tools and data.',
        usage: 'familiar',
        patterns: ['MCP Servers', 'Tool Calling'],
      },
      {
        name: 'Ollama',
        roleLabel: 'Local LLMs',
        role: 'Running open-source models locally.',
        usage: 'familiar',
        patterns: ['Local Inference', 'Quantized Models'],
      },
      {
        name: 'n8n',
        roleLabel: 'Automation',
        role: 'Webhook automations that connect third-party APIs.',
        usage: 'familiar',
        patterns: ['Webhooks', 'API Integrations'],
      },
    ],
  },
];

export type Module = TechModule;
