# porto

Personal portfolio, blog and freelance site of Daffa Aditya, software engineer (GitHub: [DaffaAdityaDev](https://github.com/DaffaAdityaDev)), based in Jakarta, Indonesia.

Live site: https://daffaaditya.id

## What is inside

| Route | What it is |
| --- | --- |
| `/` | One-page portfolio: Hero, About, Experience, Projects, Tech Stack, Contact, Footer. |
| `/blog` | Post list (SSG). |
| `/blog/post/[id]` | Blog posts (SSG). Long-form TSX posts with interactive simulators and diagrams. |
| `/case-studies` | Case studies index, one per company or client. |
| `/case-studies/[slug]` | One case study (SSG), rendered by `features/Projects/components/Engagement/EngagementLayout.tsx` from `features/Projects/engagements.ts`. |
| `/freelance` | Freelance services: timeline, skills, FAQ and a scope/price calculator. The calculator opens a `mailto:` link. There is no backend. |
| `/resume` | Resume page with an embedded Google Drive preview and a download link. |
| `/404` | Custom 404 page. |
| `/api/sitemap.xml` | Sitemap built at request time. `robots.txt` points here. |

Every page shares a global Navbar and a pixel-grid page transition.

## Tech stack

- **Next.js 16 (Pages Router)** with React 19 and the React Compiler turned on.
- **TypeScript 5.1** in strict mode. The `@/*` alias maps to the repo root.
- **Tailwind CSS v4** through `@tailwindcss/postcss`.
- **framer-motion**: page transitions, reveal animations, morph modals, scroll progress bar.
- **zustand 5**: global stores and per-widget blog stores.
- **WebGL**: raw WebGL2 shader background in `components/ui/FractalGlass.tsx` (no three.js).
- **prismjs**: syntax highlighting in blog code blocks and the live editor.
- **sucrase**: compiles TSX in the browser for the blog's self-hosted React playground.
- **lucide-react**: icons.
- **clsx + tailwind-merge**: the `cn()` helper.
- **plop**: blog post scaffolding.

## Getting started

Uses [bun](https://bun.sh). Node and bun versions are not pinned in the repo.

```bash
bun install
bun run dev        # next dev --turbopack
bun run build      # production build
bun run start      # serve the build
```

Checks:

```bash
bun run typecheck  # tsc --noEmit -p . (same as ./node_modules/.bin/tsc --noEmit -p .)
bun run lint       # ESLint 9 flat config (eslint.config.mjs, eslint-config-next)
bun run format:check
```

Do not use `npx tsc`. It resolves to a dummy package and checks nothing.

Environment: copy `.env.example` to `.env` (not committed).

## Project structure

```
components/   Layout (Navbar, Footer, PageTransition) and ui/ (ArchitecturalSpine, DotMatrixArt, FractalGlass, Marquee, Portal, ...), LazyOnView, Seo
config/       siteConfig: name, title, description, url, ogImage, social links
constant/     Shared framer-motion variants (animations.ts) and UI constants (constant.ts)
features/     One folder per page section or page: AboutMe, Blog, Contact, Custom404, Experience, Freelance, Hero, Projects, Resume, TechStack
hooks/        useCopyToClipboard, useModalDismiss, usePrefersReducedMotion
lib/          posts.ts (blog data access), gtag.ts (GA4), prism.ts (Prism setup + tokenizeCode)
pages/        Routes, _app, _document and API routes
public/       Static assets, images and robots.txt
store/        Global zustand stores (useFreelanceStore), re-exported from index.ts
styles/       globals.css (Tailwind v4 setup and global styles)
templates/    Plop template for new blog posts
types/        Shared types: blog, gtag, navigation, project, timeline
utils/        cn.ts, date.ts, math.ts
```

Convention: anything below the first screen is lazy-loaded with `next/dynamic`. Above-the-fold content stays a static import. `components/LazyOnView.tsx` (`lazyOnView`) keeps a block's static HTML but loads its JS only when it scrolls near the viewport.

## Contact

daffaaditya.me@gmail.com · https://daffaaditya.id
