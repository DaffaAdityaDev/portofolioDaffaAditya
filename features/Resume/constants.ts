import { RESUME_PDF } from './resumePdf';

// Self-hosted PDF; the hash query busts caches whenever /cv republishes it.
export const DOWNLOAD_URL = `${RESUME_PDF.path}?v=${RESUME_PDF.hash}`;
export const RESUME_URL = `${DOWNLOAD_URL}#view=FitH`;
/** Saved file name for downloads; the URL's ?v= query must not end up in it. */
export const RESUME_FILE_NAME = RESUME_PDF.path.split('/').pop() ?? 'Daffa_Aditya_Rahman_CV.pdf';

export const IDENTIFICATION = {
  name: 'Daffa Aditya',
  role: 'Software Engineer',
  location: 'Jakarta, Indonesia',
  email: 'daffaaditya.me@gmail.com',
};

export const SUMMARY =
  'I am a Frontend Engineer in Jakarta, placed by Lawencon at PNM, in the Innovation division, where I modernize internal systems with React and Next.js and work on the shared component library, CI and Playwright tests. Before that, at Run System, I worked on Accounting+ and an enterprise low-code platform, delivered integrations for BUMN and government-program clients, and mentored interns through code review.';

export const CORE_COMPETENCIES = [
  'Full-stack web development',
  'System design',
  'Third-party integrations',
  'Performance optimization',
  'UI implementation',
  'Code review & mentoring',
];

/** Same categories, skills and order as cv-src/cv/skills.tex, so the page matches the PDF it embeds. */
export const SKILL_GROUPS = [
  {
    category: 'Frontend',
    skills: ['Next.js', 'React', 'TypeScript', 'Vue.js', 'Tailwind CSS', 'TanStack Query', 'Zustand', 'Vite', 'Radix UI', 'Zod'],
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express.js', 'Go', 'Fiber', 'Laravel', 'CodeIgniter', 'Python', 'GraphQL', 'Redis', 'Kafka', 'ElasticSearch'],
  },
  {
    category: 'Database',
    skills: ['PostgreSQL', 'MySQL', 'SQL Server', 'SQLite', 'MongoDB', 'Prisma', 'Drizzle ORM', 'pgvector'],
  },
  {
    category: 'Mobile & Desktop',
    skills: ['Kotlin (Android)', 'Jetpack Compose', 'React Native', 'Expo', 'Firebase', 'Electron', 'Tauri'],
  },
  {
    category: 'Cloud & DevOps',
    skills: ['Docker', 'AWS', 'Google Cloud', 'Cloudflare', 'Vercel', 'Linux', 'Grafana', 'Microservices', 'Git/GitHub'],
  },
  {
    category: 'Testing & CI',
    skills: ['Playwright', 'GitLab CI', 'Jenkins', 'CI/CD'],
  },
  {
    category: 'AI & Automation',
    skills: ['LangChain', 'LangGraph', 'MCP', 'RAG', 'Ollama', 'n8n'],
  },
  {
    category: 'Design',
    skills: ['Figma', 'Storybook', 'Framer Motion', 'Photoshop', 'Adobe XD'],
  },
  {
    category: 'Soft Skills',
    skills: ['Problem Solving', 'Communication', 'Teamwork', 'Agile', 'Multi-Agent AI Orchestration'],
  },
];
