import React from 'react';
import { Layers, Database, TabletSmartphone, Cpu, Palette, Sparkles } from 'lucide-react';

export interface TechProcess {
  name: string;
  roleLabel: string;
  role: string;
  patterns: string[];
}

export interface TechModule {
  id: string;
  name: string;
  headline: string;
  description: string;
  status: string;
  icon: React.ReactNode;
  pillars: { label: string; value: string }[];
  relatedCaseStudy: {
    title: string;
    slug: string;
    description: string;
  };
  processes: TechProcess[];
}

export const diagnosticStack: TechModule[] = [
  {
    id: "MOD_01",
    name: "FRONTEND",
    headline: "Frontend Architecture & Systems",
    description: "Production frontend architectures engineered for scale, high frame rates, strict type safety, and modular atomic design systems.",
    status: "PRODUCTION CORE",
    icon: <Layers size={18} />,
    pillars: [
      { label: "PARADIGM", value: "SSR, SSG & Micro-Frontends" },
      { label: "STANDARDS", value: "WCAG AAA & Pixel Precision" },
      { label: "TYPE SAFETY", value: "Strict TypeScript" },
    ],
    relatedCaseStudy: {
      title: "Enterprise Design System & Platform",
      slug: "platform",
      description: "Architected multi-package atomic design token systems and distributed micro-frontends with Turborepo.",
    },
    processes: [
      {
        name: "React",
        roleLabel: "UI Core",
        role: "Component architecture, hooks optimization, and declarative render lifecycle.",
        patterns: ["Custom Hooks", "Concurrent Features", "Memoization"],
      },
      {
        name: "Next.js",
        roleLabel: "Framework",
        role: "Hybrid SSG/SSR rendering, Turbopack bundling, API routes, and edge runtime optimization.",
        patterns: ["App Router", "Static Generation", "ISR Cache"],
      },
      {
        name: "TypeScript",
        roleLabel: "Language",
        role: "Strict type hierarchies, generic utility types, and runtime schema enforcement via Zod.",
        patterns: ["Strict Mode", "Generics", "Type Guards"],
      },
      {
        name: "Zustand",
        roleLabel: "State Mgmt",
        role: "Lightweight, un-opinionated store slices with zero unnecessary re-renders.",
        patterns: ["Slice Pattern", "Selective Selectors", "Persistent Storage"],
      },
      {
        name: "TailwindCSS",
        roleLabel: "Styling",
        role: "Utility-first design tokens, dynamic CSS variable theming, and zero-runtime overhead.",
        patterns: ["Design Tokens", "Arbitrary Variants", "JIT Engine"],
      },
      {
        name: "TanStack Query",
        roleLabel: "Server State",
        role: "Asynchronous data synchronization, cache invalidation, and optimistic UI updates.",
        patterns: ["Stale-While-Revalidate", "Optimistic Mutations", "Pagination"],
      },
      {
        name: "Vite & Rollup",
        roleLabel: "Build Tooling",
        role: "Instant ESM HMR development, optimized Rollup chunk-splitting, manual chunks, and tree-shakable package distribution.",
        patterns: ["Native ESM", "Rollup Chunking", "Tree Shaking", "Library Bundling"],
      },
      {
        name: "Radix UI / Headless",
        roleLabel: "Accessible UI",
        role: "WAI-ARIA compliant unstyled primitives, keyboard navigation flows, focus trapping, and accessible dialogs.",
        patterns: ["WAI-ARIA", "Focus Management", "Keyboard Navigation", "Unstyled Hooks"],
      },
      {
        name: "Zod & Contract Safety",
        roleLabel: "Runtime Safety",
        role: "End-to-end schema validation, inferring static types from runtime contracts, and resilient form validation.",
        patterns: ["Runtime Validation", "Inferred Types", "Safe Parsing", "Form Resolvers"],
      },
      {
        name: "Micro-Frontends",
        roleLabel: "Architecture",
        role: "Decoupled independent team deployment pipelines across enterprise web estates.",
        patterns: ["Module Federation", "Turborepo", "Isolated Scopes"],
      },
    ],
  },
  {
    id: "MOD_02",
    name: "BACKEND",
    headline: "Backend & Distributed Services",
    description: "Scalable server architectures, high-throughput microservices, robust relational modeling, and asynchronous event streams.",
    status: "PRODUCTION CORE",
    icon: <Database size={18} />,
    pillars: [
      { label: "PARADIGM", value: "Event-Driven & Microservices" },
      { label: "DATA LAYER", value: "ACID Relational & In-Memory" },
      { label: "THROUGHPUT", value: "High Concurrency & Low Latency" },
    ],
    relatedCaseStudy: {
      title: "Accounting Plus Multi-Tenant Platform",
      slug: "accounting-plus",
      description: "Engineered scalable REST APIs, strict ledger transactions, and automated reporting services.",
    },
    processes: [
      {
        name: "Express.js",
        roleLabel: "REST API",
        role: "Modular API routing, custom middleware authentication pipelines, and error boundaries.",
        patterns: ["Layered Architecture", "JWT Auth", "Request Validation"],
      },
      {
        name: "Golang",
        roleLabel: "Microservices",
        role: "High-performance concurrent microservices, goroutines, and low-latency network I/O.",
        patterns: ["Goroutines & Channels", "Standard Library", "Clean Architecture"],
      },
      {
        name: "Kafka",
        roleLabel: "Event Broker",
        role: "Distributed event streaming, decoupled message pub/sub, and async worker queues.",
        patterns: ["Event-Driven", "Message Partitions", "Consumer Groups"],
      },
      {
        name: "PostgreSQL",
        roleLabel: "Relational DB",
        role: "Relational schema design, complex JOIN optimization, indexing, and strict ACID transactions.",
        patterns: ["ACID Compliance", "B-Tree Indexing", "Connection Pooling"],
      },
      {
        name: "MongoDB",
        roleLabel: "Document DB",
        role: "High-volume unstructured document storage and dynamic schema aggregation pipelines.",
        patterns: ["Aggregation Pipelines", "Flexible Schemas", "Replica Sets"],
      },
      {
        name: "Redis",
        roleLabel: "Cache Layer",
        role: "Sub-millisecond in-memory caching, distributed session tokens, and rate-limiting.",
        patterns: ["Key-Value Cache", "Pub/Sub Messaging", "TTL Expiry"],
      },
      {
        name: "Drizzle ORM",
        roleLabel: "Type-Safe ORM",
        role: "Compile-time SQL query safety, relational schema migrations, zero-overhead execution, and connection pooling.",
        patterns: ["Schema Migrations", "Prepared Statements", "Zero-Overhead SQL"],
      },
      {
        name: "BullMQ & Async Workers",
        roleLabel: "Job Queues",
        role: "Distributed Redis-backed background queues, exponential retry backoffs, worker concurrency, and job deduplication.",
        patterns: ["Distributed Queues", "Exponential Backoff", "Worker Concurrency", "Job Deduplication"],
      },
    ],
  },
  {
    id: "MOD_03",
    name: "MOBILE & CROSS-PLATFORM",
    headline: "Mobile & Cross-Platform Engineering",
    description: "Universal mobile and desktop applications engineered with React Native, Expo, Electron, and Tauri for native performance and cross-OS deployment.",
    status: "OPERATIONAL",
    icon: <TabletSmartphone size={18} />,
    pillars: [
      { label: "MOBILE", value: "iOS & Android (Universal)" },
      { label: "DESKTOP", value: "Electron & Tauri (Rust)" },
      { label: "PERFORMANCE", value: "Native Bridges & 60/120 FPS" },
    ],
    relatedCaseStudy: {
      title: "Recyclops Mobile Environmental Platform",
      slug: "recyclops",
      description: "Cross-platform mobile application for geolocation reporting, camera barcode scanning, and community feeds.",
    },
    processes: [
      {
        name: "React Native",
        roleLabel: "Mobile Core",
        role: "Cross-platform mobile apps with native UI components, Hermes runtime, and shared business logic.",
        patterns: ["Fabric Engine", "Hermes VM", "Reanimated 3"],
      },
      {
        name: "Expo",
        roleLabel: "Ecosystem",
        role: "EAS build pipelines, OTA updates, and native camera/geolocation device modules.",
        patterns: ["EAS Cloud Builds", "Native Modules", "Dev Client"],
      },
      {
        name: "Electron",
        roleLabel: "Desktop Engine",
        role: "Desktop application architecture, multi-process Chromium IPC, and native operating system integration.",
        patterns: ["IPC Channels", "Native File System", "Auto-Updater"],
      },
      {
        name: "Tauri",
        roleLabel: "Rust Desktop",
        role: "Ultra-lightweight desktop apps pairing web frontends with high-speed, secure Rust backend logic.",
        patterns: ["Rust Backend", "Small Binary Size", "Low Memory Footprint"],
      },
      {
        name: "Android Studio",
        roleLabel: "Native Tooling",
        role: "Native Android profiling, Gradle compilation, emulator testing, and release signing.",
        patterns: ["APK/AAB Signing", "Logcat Profiling", "Manifest Config"],
      },
    ],
  },
  {
    id: "MOD_04",
    name: "DEVOPS & SYSTEMS",
    headline: "Deployment & System Resilience",
    description: "Zero-downtime deployment pipelines, self-healing container architectures, crash sustainability, and automated error handling across cloud and bare-metal environments.",
    status: "OPERATIONAL",
    icon: <Cpu size={18} />,
    pillars: [
      { label: "DEPLOYMENT", value: "Zero-Downtime & Auto-Rollback" },
      { label: "RESILIENCE", value: "Self-Healing & Crash Recovery" },
      { label: "OBSERVABILITY", value: "Error Tracking & Health Alerts" },
    ],
    relatedCaseStudy: {
      title: "Ombudsman Item Management Infrastructure",
      slug: "ombudsman-item-management",
      description: "Enterprise government asset tracking infrastructure with containerized Docker services, automated deployments, and crash recovery.",
    },
    processes: [
      {
        name: "Zero-Downtime Deployment",
        roleLabel: "CI/CD & Release",
        role: "Automated test suites, self-hosted runners, blue-green deployment pipelines, and automated rollback upon failed health checks.",
        patterns: ["Zero-Downtime Deploy", "Automated Rollback", "Self-Hosted Runners", "Health Verification"],
      },
      {
        name: "Crash Recovery & Self-Healing",
        roleLabel: "Fault Tolerance",
        role: "Engineering resilient process lifecycles with Docker healthcheck restarts, systemd process supervision, and graceful shutdown handling.",
        patterns: ["Container Auto-Restart", "Process Supervision", "Graceful Shutdown", "Crash Loop Isolation"],
      },
      {
        name: "Error Tracking & Telemetry",
        roleLabel: "Incident Alerting",
        role: "Centralized real-time exception tracking, stack trace debugging, host metric thresholds, and automated alerting before users are impacted.",
        patterns: ["Real-Time APM", "Stack Trace Tracing", "Threshold Alerts", "Incident Logging"],
      },
      {
        name: "Bare-Metal & Self-Hosting",
        roleLabel: "Hardware & On-Prem",
        role: "Physical server provisioning, automated database backup snapshots, disaster recovery protocols, and Linux server hardening.",
        patterns: ["Disaster Recovery", "Automated Backups", "Hardware Stability", "Linux Hardening"],
      },
      {
        name: "Cloud (AWS, GCP, Cloudflare)",
        roleLabel: "Cloud Resilience",
        role: "Multi-zone compute redundancy, S3 storage backup retention, edge caching, and automated cloud failover.",
        patterns: ["High Availability", "Compute Failover", "Storage Redundancy", "Edge Shielding"],
      },
      {
        name: "Docker & Container Isolation",
        roleLabel: "OOM Protection",
        role: "Resource limit constraints (CPU/RAM throttling to prevent OOM kills), multi-stage builds, and immutable runtime environments.",
        patterns: ["Memory Limits", "OOM Protection", "Multi-Stage Builds", "Immutable Envs"],
      },
    ],
  },
  {
    id: "MOD_05",
    name: "UI/UX & TOOLS",
    headline: "Design Systems & Visual Engineering",
    description: "Comprehensive design tokens, atomic component libraries, typography scale hierarchies, and interactive micro-animations.",
    status: "PRODUCTION CORE",
    icon: <Palette size={18} />,
    pillars: [
      { label: "METHODOLOGY", value: "Atomic Design & Tokens" },
      { label: "ACCESSIBILITY", value: "WCAG 2.1 AAA Compliant" },
      { label: "PROTOTYPING", value: "Figma to Code Pipeline" },
    ],
    relatedCaseStudy: {
      title: "Platform Design System & Token Library",
      slug: "platform",
      description: "Engineered scalable design system consumed by multiple frontend products, bridging design tokens with React code.",
    },
    processes: [
      {
        name: "Figma",
        roleLabel: "Interface Design",
        role: "Interactive component design, auto-layout architecture, design tokens, and developer handoff specs.",
        patterns: ["Design Tokens", "Auto-Layout", "Component Variants"],
      },
      {
        name: "Design Systems",
        roleLabel: "Architecture",
        role: "Translating brand design tokens into standardized CSS variables and reusable React primitives.",
        patterns: ["Atomic Hierarchy", "Color Semantics", "Spacing Rhythm"],
      },
      {
        name: "Framer Motion",
        roleLabel: "Animation",
        role: "Hardware-accelerated fluid UI transitions, layout FLIP morphing, and gesture interactions.",
        patterns: ["Layout Animations", "Spring Physics", "Keyframe Sequences"],
      },
      {
        name: "Adobe Creative Suite",
        roleLabel: "Asset Creation",
        role: "High-resolution vector assets, SVG export optimization, and brand identity visuals.",
        patterns: ["Vector Graphics", "Asset Optimization", "Visual Identity"],
      },
      {
        name: "Storybook",
        roleLabel: "Component Sandbox",
        role: "Isolated component development, visual regression testing, documentation, and automated accessibility checks.",
        patterns: ["Component Isolation", "Visual Testing", "Design System Docs", "A11y Testing"],
      },
      {
        name: "Micro-Interactions",
        roleLabel: "Interactive UX",
        role: "Tactile gesture feedback, physics-driven spring micro-animations, hover spatial depth, and state transitions.",
        patterns: ["Spring Physics", "Tactile Feedback", "Hover Dynamics", "Spatial Polish"],
      },
    ],
  },
  {
    id: "MOD_06",
    name: "AI & OTHERS",
    headline: "AI Integration & Agentic Harness Systems",
    description: "Integrating state-of-the-art Large Language Models, agent execution harnesses, automated evaluation benchmark systems, and resilient pipelines.",
    status: "ACTIVE EXPERTISE",
    icon: <Sparkles size={18} />,
    pillars: [
      { label: "ORCHESTRATION", value: "Agentic Tool-Calling & MCP" },
      { label: "RETRIEVAL", value: "pgvector & Hybrid RAG" },
      { label: "EVALS & HARNESS", value: "Runtime & Benchmarking" },
    ],
    relatedCaseStudy: {
      title: "Artifyo Creative Platform",
      slug: "artifyo",
      description: "Integrated AI processing tools and generative workflows directly into creator dashboards.",
    },
    processes: [
      {
        name: "LangChain & LangGraph",
        roleLabel: "Agent Framework",
        role: "Multi-agent workflows, stateful conversational graphs, and automated tool-use pipelines.",
        patterns: ["Tool Calling", "Memory Chains", "State Graphs"],
      },
      {
        name: "Agent Harness Systems",
        roleLabel: "Harness & Evals",
        role: "Engineering deterministic execution harnesses, sandbox runtimes, and automated evaluation benchmark suites to validate agent trajectories, enforce guardrails, and self-correct.",
        patterns: ["Execution Harness", "Eval Benchmarks", "Trajectory Scoring", "Guardrails"],
      },
      {
        name: "pgvector & Hybrid RAG",
        roleLabel: "Semantic Search",
        role: "High-dimensional vector embeddings, hybrid search (dense semantic + sparse keyword), semantic document chunking, and contextual retrieval pipelines.",
        patterns: ["Vector Embeddings", "Hybrid Search", "Semantic Chunking", "RAG Pipelines"],
      },
      {
        name: "Model Context Protocol (MCP)",
        roleLabel: "Tool Protocol",
        role: "Building standardized MCP servers exposing enterprise databases, filesystems, and custom API tools to agentic systems.",
        patterns: ["MCP Servers", "Tool Discovery", "Context Protocols", "Secure Sandboxing"],
      },
      {
        name: "Local LLMs & Ollama",
        roleLabel: "Private Inference",
        role: "Self-hosting quantized open-source models (DeepSeek, Llama 3) for zero-latency, private on-prem inference without third-party API costs.",
        patterns: ["Ollama", "On-Prem Hosting", "Zero Data Leak", "Quantized Models"],
      },
      {
        name: "n8n Automation",
        roleLabel: "Pipelines",
        role: "Low-code webhook automation connecting third-party APIs, database updates, and alerting.",
        patterns: ["Webhook Triggers", "Data Transformation", "API Integrations"],
      },
    ],
  },
];

export type Module = TechModule;

