import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Outfit, Inter } from 'next/font/google';
import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import PageTransition from '@/components/Layout/PageTransition';
import { BARE_PAGE_ROUTES } from '@/constant/constant';

// Only the case-study pages use Outfit, so don't preload it on every route.
// adjustFontFallback stays on (the default): the metric-matched fallback keeps the swap from reflowing the h1.
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: false,
});

// Motion features load in their own chunk; components use `m.*` so they stay small.
// Subtrees with layout animations add domMax through components/LayoutMotion.
const loadMotionFeatures = () => import('@/lib/motionFeatures').then((mod) => mod.default);

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

function MyApp({ Component, pageProps, router }: AppProps) {
  // No navbar, providers or transitions, e.g. for the playground preview iframe.
  if (BARE_PAGE_ROUTES.includes(router.pathname)) {
    return <Component {...pageProps} />;
  }

  // Key on the path without query params or hash so shallow URL updates
  // (e.g. ?category=tech) and in-page anchor links don't remount or trigger page transitions.
  const transitionKey = router.asPath.split('?')[0].split('#')[0];

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      {/* Readers who ask for reduced motion get opacity-only animations: transforms and layout morphs are skipped. */}
      <MotionConfig reducedMotion="user">
        <div className={`${inter.variable} ${outfit.variable} font-sans`}>
          <Navbar />
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={transitionKey}>
              <Component {...pageProps} />
            </PageTransition>
          </AnimatePresence>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}

export default MyApp;
