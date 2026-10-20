import type {
  PartState,
  PartTiming,
  PprResponse,
  RenderMode,
} from '../types';
import { SHELL_RENDER_MS } from '../constants';

/**
 * A simple model, not a benchmark: times are counted from the moment the request
 * reaches the server, the network is ignored, and cached HTML costs 0 ms.
 */
export function modelResponse(mode: RenderMode, cartMs: number, productsMs: number): PprResponse {
  if (mode === 'ssr') {
    // The server holds the whole response until every fetch is done and the page
    // is rendered. It renders the shell on each request too, so it pays SHELL_RENDER_MS like 'stream'.
    const all = Math.max(cartMs, productsMs, SHELL_RENDER_MS);
    return {
      shell: { at: all, isPersonal: false },
      cart: { at: all, isPersonal: true },
      products: { at: all, isPersonal: true },
      firstContentMs: all,
      personalCartMs: all,
    };
  }

  if (mode === 'ssg') {
    return {
      shell: { at: 0, isPersonal: false },
      cart: { at: 0, isPersonal: false },
      products: { at: 0, isPersonal: false },
      firstContentMs: 0,
      personalCartMs: null,
    };
  }

  // Streaming renders the shell per request; PPR serves it from the cache.
  // A hole cannot show before the shell that holds it.
  const shellAt = mode === 'stream' ? SHELL_RENDER_MS : 0;
  const cartAt = Math.max(cartMs, shellAt);
  return {
    shell: { at: shellAt, isPersonal: false },
    cart: { at: cartAt, isPersonal: true },
    products: { at: Math.max(productsMs, shellAt), isPersonal: true },
    firstContentMs: shellAt,
    personalCartMs: cartAt,
  };
}

/** The look of one part at `clockMs`. A null clock means the replay is over: show the end state. */
export function partState(part: PartTiming, shell: PartTiming, clockMs: number | null): PartState {
  const now = clockMs ?? Number.POSITIVE_INFINITY;
  if (now < shell.at) return 'blank';
  if (now < part.at) return 'skeleton';
  return part.isPersonal ? 'ready' : 'generic';
}
