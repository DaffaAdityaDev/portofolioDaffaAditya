import { RESUME_PDF } from './resumePdf';

// Self-hosted PDF; the hash query busts caches whenever /cv republishes it.
export const DOWNLOAD_URL = `${RESUME_PDF.path}?v=${RESUME_PDF.hash}`;
export const RESUME_URL = `${DOWNLOAD_URL}#view=FitH`;

export const IDENTIFICATION = {
  name: 'Daffa Aditya',
  role: 'Software Engineer',
  location: 'Jakarta, Indonesia',
  email: 'daffaaditya.me@gmail.com',
};

export const SUMMARY =
  'I am a Software Engineer at Run System in Jakarta. I work on Accounting+, a multi-service accounting SaaS, and on an enterprise low-code platform, where I maintain the core system and its third-party integrations, including payments. I deliver integrations for BUMN and government-program clients, work on performance and system design, and mentor interns through code review.';

export const CORE_COMPETENCIES = [
  'Full-stack web development',
  'System design',
  'Third-party integrations',
  'Performance optimization',
  'UI implementation',
  'Code review & mentoring',
];

export const TECHNICAL_SKILLS = [
  'Next.js',
  'TypeScript',
  'Golang',
  'Node.js',
  'GraphQL',
  'React Native',
  'PostgreSQL',
  'Docker',
  'AI Agent',
];

export const EXTENDED_STACK = [
  {
    category: 'AI & Automation',
    tech: 'LangChain, LangGraph, n8n',
  },
  {
    category: 'Cloud & Infrastructure',
    tech: 'AWS, GCP, Grafana, Kafka, ElasticSearch',
  },
  {
    category: 'Design Tools',
    tech: 'Figma, Framer, Photoshop, Adobe XD',
  },
];
