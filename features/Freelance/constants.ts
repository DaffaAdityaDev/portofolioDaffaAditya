import type { TimelineNode, FaqItem, PackageType, CalculatorInputs, FreelanceFormData } from '@/types/timeline';

export type { TimelineNode, FaqItem, PackageType, CalculatorInputs, FreelanceFormData };

/**
 * Freelance work only. Employment work (Run System, Ombudsman RI, QQTech) lives on /case-studies.
 * Every fact and metric here must match features/Projects/engagements.ts.
 */
export const TIMELINE_NODES: TimelineNode[] = [
  {
    id: "FREELANCE_01",
    category: "Artifyo Creative Studio · 2025",
    title: "Artifyo Studio Website",
    description: "I built and deployed the studio's website with Next.js, TypeScript and Tailwind CSS: a grid of the studio's work, a service catalog with pricing, and a direct WhatsApp link so visitors can start a consultation in one tap.",
    points: [
      "Portfolio grid for the studio's work",
      "Service catalog with package pricing",
      "WhatsApp inquiry link",
      "High-resolution images with minimal layout shift"
    ],
    techs: ["Next.js", "TypeScript", "Tailwind CSS"],
    metric: "< 1s load on 3G and 4G",
    image: "/image/projects/artifyo.webp"
  },
  {
    id: "FREELANCE_02",
    category: "Aliman Bulus Boarding School · 2025",
    title: "School Tuition Ledger",
    description: "The school tracked tuition and fees in paper books. I wrote the UI specs, built the Next.js frontend and a Node.js backend on PostgreSQL with double-entry ledger records, so payments, monthly ledger checks and admin reports live in one place.",
    points: [
      "Double-entry ledger records",
      "Multi-year financial history",
      "Role-based dashboards for treasurers",
      "Prisma ORM & PostgreSQL schema"
    ],
    techs: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Docker"],
    metric: "500+ students on one ledger",
    image: "/image/projects/aliman.webp"
  }
];

/** Case study page for each freelance project, keyed by TimelineNode.id. */
export const CASE_STUDY_LINKS: Record<string, string> = {
  FREELANCE_01: "/case-studies/artifyo",
  FREELANCE_02: "/case-studies/aliman-bulus",
};

export const FAQS: FaqItem[] = [
  {
    q: 'How will we stay in touch during the project?',
    a: 'I share progress in a weekly update and on a shared Git repository, so you can see the actual commits. We agree on milestones at the start, and I show you a working build at each one.'
  },
  {
    q: 'What happens if the requirements change mid-project?',
    a: 'I work in milestones. If something changes, I tell you how it affects the timeline and the cost before I write the code, and we adjust the next milestone together.'
  },
  {
    q: 'Will I be tied to you after the project ends?',
    a: 'No. You get the full source code, a README with setup and deployment steps, and the environment config, so another developer or your own team can take over.'
  }
];
