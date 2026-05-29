import React from 'react';
import { Layers, Database, TabletSmartphone } from 'lucide-react';

export const diagnosticStack = [
  {
    id: "MOD_01",
    name: "FRONTEND",
    description: "Core frontend frameworks and state management.",
    status: "OPERATIONAL",
    uptime: "99.9%",
    icon: <Layers size={18} />,
    processes: [
      { name: "React", version: "v19.0", status: "Running" },
      { name: "Next.js", version: "v14.1", status: "Running" },
      { name: "TypeScript", version: "v5.4", status: "Compiled" },
      { name: "Zustand", version: "v4.1", status: "Active" },
      { name: "TailwindCSS", version: "v4.1", status: "Active" },
      { name: "TanStack Query", version: "v5.0", status: "Active" },
      { name: "Micro-Frontends", version: "Architecture", status: "Active" },
      { name: "NPM Packages", version: "Library", status: "Active" },
    ]
  },
  {
    id: "MOD_02",
    name: "BACKEND",
    description: "Server-side logic and database management.",
    status: "OPERATIONAL",
    uptime: "99.9%",
    icon: <Database size={18} />,
    processes: [
      { name: "Express_JS", version: "v5.1", status: "Running" },
      { name: "Golang", version: "v5.4", status: "Compiled" },
      { name: "Kafka", version: "v5.4", status: "Compiled" },
      { name: "PostgreSQL", version: "v5.4", status: "Compiled" },
      { name: "MongoDB", version: "v5.4", status: "Compiled" },
      { name: "Redis", version: "v5.4", status: "Compiled" },
    ]
  },
   {
    id: "MOD_03",
    name: "MOBILE",
    description: "Mobile application development.",
    status: "OPERATIONAL",
    icon: <TabletSmartphone size={18} />,
    processes: [
      { name: "React Native", version: "v5.1", status: "Running" },
      { name: "Expo", version: "v5.4", status: "Compiled" },
      { name: "Android Studio", version: "v5.4", status: "Compiled" },
    ]
  },
  {
    id: "MOD_03",
    name: "DEVOPS",
    description: "Devops and automation.",
    status: "OPERATIONAL",
    uptime: "99.9%",
    icon: <Database size={18} />,
    processes: [
      { name: "Docker", version: "16.1", status: "Connected" },
      { name: "Git", version: "Auth/DB", status: "Synced" },
      { name: "Microservices", version: "Cache", status: "Hit" },
      { name: "Grafana", version: "Monitoring", status: "Active"},
      { name: "ElasticSearch", version: "Monitoring", status: "Active"},
      { name: "AWS", version: "v5.4", status: "Compiled" },
      { name: "GCP", version: "v5.4", status: "Compiled" },
    ]
  },
  {
    id: "MOD_04",
    name: "UI/UX & TOOLS",
    description: "UI/UX and tools.",
    status: "OPERATIONAL",
    uptime: "99.9%",
    icon: <Database size={18} />,
    processes: [
      { name: "Figma", version: "16.1", status: "Connected" },
      { name: "Adobe XD", version: "Auth/DB", status: "Synced" },
      { name: "Framer", version: "Monitoring", status: "Active"},
      { name: "Adobe Photoshop", version: "v5.4", status: "Compiled" },
    ]
  },
  {
    id: "MOD_06",
    name: "AI & OTHERS",
    description: "AI and other tools.",
    status: "OPERATIONAL",
    uptime: "99.9%",
    icon: <Database size={18} />,
    processes: [
      { name: "8N8 automation", version: "16.1", status: "Connected" },
      { name: "LangChain", version: "Auth/DB", status: "Synced" },
      { name: "LangGraph", version: "Cache", status: "Hit" },
      { name: "Agentic AI", version: "Cache", status: "Hit" },
    ]
  },
];
export type Module = typeof diagnosticStack[0];
