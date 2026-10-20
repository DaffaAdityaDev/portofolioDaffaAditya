import { lazyOnView } from '@/components/LazyOnView';

/**
 * The site footer for page bottoms: its HTML is in the static page (for SEO and the sticky reveal),
 * its JS (scroll-linked motion, clock, shader loader) loads only when the page nears the bottom.
 *
 * The wrapper div is a plain block, so the footer's own clip-path box still drives the reveal.
 * The placeholder reserves the footer's height after a client-side navigation.
 */
const LazyFooter = lazyOnView(() => import('./Footer'), {
  placeholderClassName: 'empty:h-[680px] sm:empty:h-[520px] md:empty:h-[460px]',
});

export default LazyFooter;
