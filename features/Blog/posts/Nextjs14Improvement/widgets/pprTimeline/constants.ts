import type { RenderMode, RenderModeInfo } from './types';

export const RENDER_MODES: Record<RenderMode, RenderModeInfo> = {
  ssr: {
    id: 'ssr',
    label: 'SSR',
    summary:
      'Rendered on every request, with no Suspense (like getServerSideProps in the Pages Router). Nothing is sent until the slowest data is back, then the whole page arrives at once.',
  },
  stream: {
    id: 'stream',
    label: 'SSR + Suspense',
    summary:
      'Rendered on every request, and streamed. The server renders the shell first and sends it, then each hole fills in when its data is ready. The shell is still rendered again for every user.',
  },
  ssg: {
    id: 'ssg',
    label: 'SSG',
    summary: 'Built once at deploy time and served from the cache. Instant, but the cart is the same for everyone, so it cannot show yours.',
  },
  ppr: {
    id: 'ppr',
    label: 'PPR',
    summary:
      'Like SSR + Suspense, but the static shell is built ahead of time and served from the cache at once. Each hole fills in when its own data is ready, in the same HTTP response.',
  },
};

export const RENDER_MODE_ORDER: RenderMode[] = ['ssr', 'stream', 'ssg', 'ppr'];

export const LATENCY_RANGE = { min: 50, max: 2000, step: 50 } as const;

export const DEFAULT_LATENCY = { cart: 400, products: 1200 } as const;

/** Time the server spends rendering the shell on each request when it is not cached. An assumed value for the model. */
export const SHELL_RENDER_MS = 150;

/** Right edge of the timeline, and how long one replay runs. A little past the slider maximum. */
export const TIMELINE_MAX_MS = 2200;

/** Ticks drawn under the timeline. */
export const TIMELINE_TICKS = [0, 500, 1000, 1500, 2000];
