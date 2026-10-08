import type { NextPage } from 'next';
import { siteConfig } from '@/config/metadata.config';
import dynamic from 'next/dynamic';
import Hero from '@/features/Hero';
import React, { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { m, useScroll } from 'framer-motion';
import Seo from '@/components/Seo';
import { lazyOnView } from '@/components/LazyOnView';

// Above the fold components stay as static imports for LCP
import { MARQUEE_TEXT } from '@/constant/constant';

// Below the fold: the HTML is in the static page, the JS loads only when the block nears the viewport.
// (dynamic({ ssr: true }) split the chunks but still loaded and hydrated all of them up front.)
// Smaller margin than the 600px default: with it the sections sat inside the margin on load and
// fetched their chunk immediately. Now they load once the user scrolls toward them.
const IndexedSections = lazyOnView(() => import('@/features/Home/IndexedSections'), {
  rootMargin: '0px 0px 200px 0px',
});
const Contact = lazyOnView(() => import('@/features/Contact'));
const Marquee = lazyOnView(() => import('@/components/ui/Marquee'));
// The footer stays a normal SSR component: a lazyOnView wrapper div would break its sticky reveal.
const Footer = dynamic(() => import('@/components/Layout/Footer'), { ssr: true });
const ArchitecturalSpine = dynamic(() => import('@/components/ui/ArchitecturalSpine'), { ssr: false });

// The spine is only shown on lg+ (it was `hidden lg:flex`), so phones and tablets never fetch its chunk.
const LG_QUERY = '(min-width: 1024px)';
const subscribeLg = (onChange: () => void) => {
  const query = window.matchMedia(LG_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const getLgSnapshot = () => window.matchMedia(LG_QUERY).matches;
const getLgServerSnapshot = () => false;

const Home: NextPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // The spine finds its sections by id once, on mount. Remount it when the lazy sections replace the static ones.
  const [spineKey, setSpineKey] = useState(0);
  const remountSpine = useCallback(() => setSpineKey((key) => key + 1), []);
  const isLg = useSyncExternalStore(subscribeLg, getLgSnapshot, getLgServerSnapshot);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  return (
    <>
      <Seo
        path="/"
        title="Daffa Aditya | Software Engineer"
        description={siteConfig.description}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative flex flex-col">
        {/* Minimalist Top Reading Progress Bar (System Red Accent) */}
        <m.div
          style={{ scaleX: scrollYProgress }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-red-500 to-red-600 origin-left z-50 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.7)]"
        />

        {/* Architectural Navigation Spine - Right Margin Index */}
        {isLg && <ArchitecturalSpine key={spineKey} />}

        {/* Main Content Surface (Elevated above sticky under-page footer) */}
        <div className="relative z-10 bg-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
          <main className="flex-1 relative">
            <Hero />
            
            {/* Continuous Sections Container */}
            <div ref={containerRef} className="relative">
              <IndexedSections onMount={remountSpine} />
              <Contact />
            </div>
          </main>

          {/* Footer Marquee */}
          <Marquee text={MARQUEE_TEXT} border={true} type="light" />
        </div>

        {/* Sticky Under-Page Reveal Footer */}
        <Footer />
      </div>
    </>
  );
};

export default Home;

