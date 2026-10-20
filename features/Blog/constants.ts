import type { BlogCategory, PostData } from '@/types/blog';

/** Blog groups, in the order the filter shows them. */
export const BLOG_CATEGORIES: { id: BlogCategory; label: string }[] = [
  { id: 'system-design', label: 'System Design' },
  { id: 'tech', label: 'Tech' },
  { id: 'blog', label: 'Blog' },
];

export const BLOG_CATEGORY_LABELS = Object.fromEntries(
  BLOG_CATEGORIES.map(({ id, label }) => [id, label]),
) as Record<BlogCategory, string>;

/**
 * Every post, newest first. The single list of post metadata: the blog page, the sitemap and
 * the post route read it, and `PostId` makes the post route's content map list exactly these ids.
 * `id` is the public URL slug (kebab-case); renaming one needs a redirect in next.config.js.
 */
export const POSTS_DATA = [
  {
    id: 'nextjs-16-turbopack-server-actions-cache-components',
    category: 'tech',
    title: 'Next.js 16: Turbopack, Server Actions and Cache Components',
    seoTitle: 'Next.js 16: Turbopack, Actions, Cache Components',
    date: '2026-10-20',
    timeToRead: 9,
    description:
      'Learn how Next.js 16 builds with Turbopack, handles forms with Server Actions and useActionState, and mixes static and dynamic UI with Cache Components.',
    image: '/image/blogs/nextjs-16-turbopack-server-actions-cache-components/banner.webp',
    heroImage: '/image/blogs/nextjs-16-turbopack-server-actions-cache-components/hero.webp',
    ogImage: '/image/blogs/nextjs-16-turbopack-server-actions-cache-components/og.jpg',
    production: true,
  },
  {
    id: 'scaling-ai-agents-as-a-service',
    category: 'system-design',
    title: 'Scaling AI Agents as a Service',
    date: '2026-10-15',
    timeToRead: 18,
    description:
      'Design a multi-agent service that scales by adding boxes and stays fast: stateless workers, sub-agents with limits, prompt caching and guardrails.',
    image: '/image/blogs/scaling-ai-agents-as-a-service/banner.webp',
    heroImage: '/image/blogs/scaling-ai-agents-as-a-service/hero.webp',
    ogImage: '/image/blogs/scaling-ai-agents-as-a-service/og.jpg',
    production: true,
  },
  {
    id: 'how-i-learned-to-learn',
    category: 'blog',
    title: 'How I Learned to Learn',
    date: '2025-05-12',
    timeToRead: 7,
    description:
      'Learn the basics first, test yourself instead of re-reading, and space your reviews. Try a forgetting curve to see why spacing wins.',
    image: '/image/blogs/how-i-learned-to-learn/banner.webp',
    heroImage: '/image/blogs/how-i-learned-to-learn/hero.webp',
    ogImage: '/image/blogs/how-i-learned-to-learn/og.jpg',
    production: true,
  },
  {
    id: 'solid-5-principles-that-make-your-codebase-easier-to-change',
    category: 'tech',
    title: 'SOLID: 5 Principles That Make Your Codebase Easier to Change',
    seoTitle: 'SOLID Principles: Make Code Easier to Change',
    date: '2025-02-18',
    timeToRead: 12,
    description:
      'Refactor one React profile form once per SOLID principle, with before and after TypeScript code and a live editor to test each change.',
    image: '/image/blogs/solid-5-principles-that-make-your-codebase-easier-to-change/banner.webp',
    heroImage: '/image/blogs/solid-5-principles-that-make-your-codebase-easier-to-change/hero.webp',
    ogImage: '/image/blogs/solid-5-principles-that-make-your-codebase-easier-to-change/og.jpg',
    production: true,
  },
  {
    id: 'nextjs-14-first-look',
    category: 'tech',
    title: 'Next.js 14 First Look: Turbopack, Server Actions and Partial Prerendering',
    seoTitle: 'Next.js 14 First Look: Turbopack, Actions, PPR',
    date: '2024-02-28',
    timeToRead: 8,
    description:
      'What Turbopack, Server Actions and Partial Prerendering do in Next.js 14, why they exist, and what changed in Next.js 15 and 16.',
    image: '/image/blogs/nextjs-14-first-look/banner.webp',
    heroImage: '/image/blogs/nextjs-14-first-look/hero.webp',
    ogImage: '/image/blogs/nextjs-14-first-look/og.jpg',
    production: true,
  },
  {
    id: 'static-site-generation-in-nextjs',
    category: 'tech',
    title: 'Static Site Generation in Next.js: getStaticProps, getStaticPaths and ISR',
    seoTitle: 'Next.js Static Site Generation and ISR',
    date: '2024-02-28',
    timeToRead: 10,
    description:
      'Build pages once, not on every request: when to use getStaticProps and getStaticPaths, how ISR keeps them fresh, and when SSR fits better.',
    image: '/image/blogs/static-site-generation-in-nextjs/banner.webp',
    heroImage: '/image/blogs/static-site-generation-in-nextjs/hero.webp',
    ogImage: '/image/blogs/static-site-generation-in-nextjs/og.jpg',
    production: true,
  },
  {
    id: 'designing-a-distributed-video-streaming-system',
    category: 'system-design',
    title: 'Designing a Distributed Video Streaming System',
    seoTitle: 'Distributed Video Streaming System Design',
    date: '2024-02-26',
    timeToRead: 45,
    description:
      'Design a distributed video streaming system: estimate the scale, choose the architecture, then break it with a traffic spike you control.',
    image: '/image/blogs/designing-a-distributed-video-streaming-system/banner.webp',
    heroImage: '/image/blogs/designing-a-distributed-video-streaming-system/hero.webp',
    ogImage: '/image/blogs/designing-a-distributed-video-streaming-system/og.jpg',
    production: true,
  },
] as const satisfies readonly PostData[];

export type PostId = (typeof POSTS_DATA)[number]['id'];

// --- Table of contents ---
/** Headings that become entries. Anything inside [data-toc-ignore] is skipped. */
export const TOC_HEADING_SELECTOR = 'h2, h3';
/** Shorter posts read fine without one. */
export const TOC_MIN_ITEMS = 3;
/** Space kept above a heading after a jump, so the fixed navbar does not cover it. Matches `scroll-mt-28`. */
export const TOC_SCROLL_OFFSET_PX = 112;

// --- Lazy widgets ---
/** How far ahead of the viewport a widget starts loading its JS, so it is ready before it is seen. */
export const LAZY_WIDGET_ROOT_MARGIN = '600px 0px';

// --- CodeBlock ---
export const CODE_DEFAULT_LANGUAGE = 'plain';
export const CODE_COPY_FEEDBACK_MS = 2000;
/** Line numbers turn on automatically at this many lines unless overridden. */
export const CODE_LINE_NUMBER_MIN_LINES = 6;
/** Snippets longer than this collapse behind a "show more" bar. */
export const CODE_COLLAPSE_MIN_LINES = 24;
export const CODE_COLLAPSED_VISIBLE_LINES = 14;
/** Upper bound for `highlight`/`added`/`removed` ranges, guards against `1-999999`. */
export const CODE_LINE_RANGE_LIMIT = 2000;

export const CODE_LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  html: 'markup',
  xml: 'markup',
  svg: 'markup',
  yml: 'yaml',
  text: 'plain',
  txt: 'plain',
};

export const CODE_LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  json: 'JSON',
  bash: 'Bash',
  css: 'CSS',
  markup: 'HTML',
  yaml: 'YAML',
  diff: 'Diff',
  plain: 'Text',
};

/** Plain JavaScript that contains JSX is highlighted with the JSX grammar. */
export const CODE_JSX_PATTERN = /<\/?[A-Za-z][\w.]*(\s|\/?>)/;

// --- ReactPlayground ---
export const PLAYGROUND_DEFAULT_HEIGHT = 420;
export const PLAYGROUND_CONSOLE_HEIGHT = 160;
/** Start loading the editor chunk this far before the playground scrolls into view. */
export const PLAYGROUND_PRELOAD_MARGIN = '300px 0px';
export const PLAYGROUND_RECOMPILE_DELAY_MS = 500;
export const PLAYGROUND_ENTRY_FILES = {
  react: '/App.js',
  'react-ts': '/App.tsx',
} as const;
export const PLAYGROUND_INDENT = '  ';
/** Characters that open a block, and the closer that Enter moves to its own line. */
export const PLAYGROUND_BRACKET_PAIRS: Record<string, string> = { '{': '}', '(': ')', '[': ']' };
/** Grammar per file extension. JS files may contain JSX, as in the `react` template. */
export const PLAYGROUND_GRAMMARS: Record<string, string> = {
  js: 'jsx',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  css: 'css',
  json: 'json',
};
/**
 * The preview iframe. `allow-scripts` runs the code, `allow-forms` lets a form fire
 * its submit event. No `allow-same-origin`: the code gets an opaque origin, so it
 * cannot read this site's cookies, storage or DOM.
 */
export const PLAYGROUND_SANDBOX = 'allow-scripts allow-forms';
/** How often the post page pings the preview while it is visible. */
export const PLAYGROUND_PING_INTERVAL_MS = 1000;
/** Silence after which a loaded preview counts as stuck. */
export const PLAYGROUND_UNRESPONSIVE_MS = 4000;
/** The first load fetches the runtime page and its JS, so it gets longer. */
export const PLAYGROUND_LOAD_TIMEOUT_MS = 20000;
/**
 * Load timeout for a frame that replaces a stuck one. Chromium puts the new frame in
 * the same, still busy process, so it never loads. Only a page reload frees it.
 */
export const PLAYGROUND_STUCK_RELOAD_TIMEOUT_MS = 8000;
/** Oldest console entries are dropped past this many. */
export const PLAYGROUND_CONSOLE_MAX_ENTRIES = 200;

// --- Playground runtime (runs inside the preview iframe) ---
/** Prefix of the file names that show up in stack traces, e.g. `playground:///App.tsx`. */
export const PLAYGROUND_SOURCE_URL_PREFIX = 'playground://';
/** Extensions tried, in order, for an import like `./Button`. */
export const PLAYGROUND_RESOLVE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.json', '.css'];
/** Bare imports the preview can serve. Everything else is reported as unavailable. */
export const PLAYGROUND_EXTERNAL_MODULES = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
] as const;
/** A loop that keeps one task busy this long is stopped with an error. */
export const PLAYGROUND_LOOP_LIMIT_MS = 1000;
/** The loop guard only reads the clock every this many iterations. */
export const PLAYGROUND_LOOP_CHECK_EVERY = 1000;
export const PLAYGROUND_MAX_FILES = 50;
/** Total characters across all files in one run. */
export const PLAYGROUND_MAX_SOURCE_CHARS = 500_000;
/** Lines shown above and below the failing line in an error frame. */
export const PLAYGROUND_FRAME_CONTEXT_LINES = 2;
/** Console messages forwarded per second. The rest are counted and reported once. */
export const PLAYGROUND_CONSOLE_RATE_PER_SECOND = 100;
export const PLAYGROUND_INSPECT_MAX_DEPTH = 3;
export const PLAYGROUND_INSPECT_MAX_ITEMS = 50;
export const PLAYGROUND_INSPECT_MAX_STRING = 10_000;
