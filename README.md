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
| `/freelance` | Freelance services: selected work, services, process, FAQ, a project brief form and a Cal.com booking embed. |
| `/resume` | Resume page with the self-hosted PDF (see [Resume PDF](#resume-pdf)) and a download link. |
| `/404` | Custom 404 page (noindex). |
| `/api/brief` | Receives the `/freelance` brief form. See [Freelance brief](#freelance-brief). |
| `/llms.txt`, `/llms-full.txt` | LLM-readable summaries. See [For crawlers and AI](#for-crawlers-and-ai). |
| `/sitemap.xml` | Sitemap built at request time by `/api/sitemap.xml` (rewrite in `next.config.js`). `robots.txt` points here. |
| `/playground-runtime` | Preview runtime for the blog's live React editor, loaded in a sandboxed iframe. Bare page (no site shell), noindex, not in the sitemap. |
| `/cv` | **Dev only.** Local Awesome-CV LaTeX editor. See [CV editor](#cv-editor-dev-only). |

Every page except the bare ones (`/playground-runtime`, `/cv`, listed in `BARE_PAGE_ROUTES` in `constant/constant.ts`) shares a global Navbar and a pixel-grid page transition.

### Freelance brief

The form on `/freelance` posts to `/api/brief`, which:

- emails the brief through [Resend](https://resend.com),
- appends it as a row to a Google Sheet through an Apps Script web app (`SHEETS_WEBHOOK_URL`),
- checks Cloudflare Turnstile when its keys are set.

Each channel is on when its env vars are set, and the brief counts as delivered when at least one succeeds. All of these run on free tiers, so the form falls back to a `mailto:` link when neither Resend nor Sheets is configured, or when delivery fails. There is no price calculator. The free call is booked through a Cal.com embed (`NEXT_PUBLIC_CAL_LINK`; empty hides it). See `.env.example` for every variable.

### Resume PDF

`/resume` serves a self-hosted PDF from `public/assets/resume/`, built from `cv-src/cv.tex` (Awesome-CV). `features/Resume/resumePdf.ts` holds its path and a content hash that busts the cache; it is generated, not edited by hand. Rebuild it with the `/cv` editor's Publish button or `bun run cv:build` (`scripts/cv-build.ts`, same code path), then commit the PDF and `resumePdf.ts`.

### For crawlers and AI

- `/llms.txt` and `/llms-full.txt`: [llmstxt.org](https://llmstxt.org) markdown summaries (short and expanded) for LLMs and agents, served by `/api/llms.txt` and `/api/llms-full.txt` through rewrites in `next.config.js`. `lib/llms.ts` builds both from the data modules (experience, engagements, resume, published posts, `siteConfig`), so they follow the site; never edit a copy by hand. `_document.tsx` links `/llms.txt` as `rel="alternate"`.
- `/sitemap.xml`: see the table above.
- JSON-LD: the home page has `Person` (role, employer, education, skills, profiles; built by `lib/profile.ts`) and `WebSite`.
- `public/robots.txt` allows all crawlers, AI crawlers by name, and blocks only `/api/`.

### CV editor (dev only)

`pages/cv.dev.tsx` and `pages/api/cv/*.dev.ts` (files, file, compile, publish) are routes only under `next dev`: `next.config.js` adds `dev.tsx`/`dev.ts` to `pageExtensions` in development only. A production build still compiles them as `/cv.dev` and `/api/cv/*.dev`, so each refuses there itself (`getStaticProps` returns `notFound`; the API routes go through `features/CvEditor/server/api.ts`).

The editor edits the `.tex` files in `cv-src/` and compiles them with a local [Tectonic](https://tectonic-typesetting.github.io) install. Optional env: `CV_SRC_DIR` (default `cv-src`) and `TECTONIC_BIN` (default `tectonic` on `PATH`).

## Tech stack

- **Next.js 16 (Pages Router)** with React 19 and the React Compiler turned on.
- **TypeScript 5.1** in strict mode. The `@/*` alias maps to the repo root.
- **Tailwind CSS v4** through `@tailwindcss/postcss`.
- **framer-motion**: page transitions, reveal animations, morph modals, scroll progress bar (features loaded lazily through `LazyMotion`).
- **zustand 5**: per-feature and per-widget stores.
- **WebGL**: raw WebGL2 shader background in `components/ui/FractalGlass.tsx` (no three.js), loaded client-only when the footer nears the viewport.
- **prismjs**: syntax highlighting in blog code blocks and the live editor.
- **sucrase**: compiles TSX in the browser for the blog's self-hosted React playground.
- **CodeMirror 6** (dev dependency): the `/cv` LaTeX editor.
- **lucide-react**: icons.
- **clsx + tailwind-merge**: the `cn()` helper.
- **plop**: blog post scaffolding.

## Getting started

Uses [bun](https://bun.sh); the version is pinned in `package.json` (`packageManager`). `bun.lock` is the only lockfile.

```bash
bun install
bun run dev        # next dev --turbopack
bun run build      # production build
bun run start      # serve the build
```

All scripts:

| Script | Command |
| --- | --- |
| `dev` | `next dev --turbopack` |
| `dev:turbo` | `next dev --turbopack` (alias of `dev`) |
| `build` | `next build` |
| `build:prod` | `next build` (alias of `build`) |
| `start` | `next start` |
| `lint` | `eslint .` (ESLint 9 flat config, `eslint.config.mjs`, `eslint-config-next`) |
| `typecheck` | `tsc --noEmit -p .` |
| `format:check` | `prettier --check . --ignore-path .prettierignore` |
| `format:fix` | `prettier --write . --ignore-path .prettierignore` |
| `new-post` | `plop blog-post`: scaffold a blog post from `templates/` |
| `cv:build` | `tsx scripts/cv-build.ts [main=cv.tex]`: compile a CV with Tectonic and publish it as the resume PDF |

Do not use `npx tsc`. It resolves to a dummy package and checks nothing. `bun run typecheck` or `./node_modules/.bin/tsc --noEmit -p .` run the real compiler.

Environment: copy `.env.example` to `.env` (not committed). Every variable is optional; features without their keys turn themselves off.

## Project structure

```
components/   Layout (Navbar, Footer, PageTransition) and ui/ (ArchitecturalSpine, DotMatrixArt, FractalGlass, Marquee, Portal, ...), LazyOnView, Seo
config/       siteConfig: name, title, description, url, OG image, social links
constant/     Shared framer-motion variants (animations.ts) and UI constants (constant.ts)
cv-src/       Awesome-CV LaTeX sources (cv.tex, resume.tex, coverletter.tex, sections, fonts) for the resume PDF
features/     One folder per page section or page:
                AboutMe, Blog, Contact, Custom404, Experience, Hero, Projects, Resume, TechStack
                CvEditor  dev-only /cv editor: components, hooks, server/ (paths, tectonic, publish, api guard)
                Freelance /freelance sections, brief form, Turnstile and Cal.com, its zustand store
                Home      IndexedSections: the home page's below-the-fold sections
hooks/        useCopyToClipboard, useModalDismiss, usePrefersReducedMotion
lib/          posts.ts (blog data access), gtag.ts (GA4), prism.ts (Prism setup + tokenizeCode), motionFeatures.ts (LazyMotion features)
pages/        Routes, _app, _document and API routes (brief, sitemap.xml, dev-only cv/*)
public/       Static assets, images, the resume PDF and robots.txt
scripts/      cv-build.ts (the cv:build script)
styles/       globals.css (Tailwind v4 setup and global styles)
templates/    Plop template for new blog posts
types/        Shared types: blog, freelance, gtag, navigation, project, sucrase-parser, turnstile
utils/        cn.ts, date.ts, math.ts
```

Convention: anything below the first screen is lazy-loaded with `next/dynamic`. Above-the-fold content stays a static import. `components/LazyOnView.tsx` (`lazyOnView`) keeps a block's static HTML but loads its JS only when it scrolls near the viewport.

## Contact

daffaaditya.me@gmail.com · https://daffaaditya.id
