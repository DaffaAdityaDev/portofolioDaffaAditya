import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Outfit, Inter } from 'next/font/google';
import { AnimatePresence, LazyMotion } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import PageTransition from '@/components/Layout/PageTransition';
import { BARE_PAGE_ROUTES } from '@/constant/constant';

// Only the case-study pages use Outfit, so don't preload it on every route.
const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  preload: false,
});

// Motion features load in their own chunk; components use `m.*` so they stay small.
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

  // Key on the path without the hash so in-page section links don't remount the page.
  const transitionKey = router.asPath.split('#')[0];

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <div className={`${inter.variable} ${outfit.variable} font-sans`}>
        <Navbar />
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={transitionKey}>
            <Component {...pageProps} />
          </PageTransition>
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}

export default MyApp;
