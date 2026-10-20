import type { NextPage } from 'next';
import { SAME_AS, siteConfig } from '@/config/metadata.config';
import dynamic from 'next/dynamic';
import Hero from '@/features/Hero';
import React, { useRef, useState } from 'react';
import { m, useScroll } from 'framer-motion';
import Seo from '@/components/Seo';
import { lazyOnView } from '@/components/LazyOnView';
import LayoutMotion from '@/components/LayoutMotion';
// lazyOnView too: the footer's sticky reveal comes from its own clip-path box, which the plain
// wrapper div leaves intact.
import Footer from '@/components/Layout/LazyFooter';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Above the fold components stay as static imports for LCP
import { MARQUEE_TEXT } from '@/constant/constant';

// Below the fold: the HTML is in the static page, the JS loads only when the block nears the viewport.
// (dynamic({ ssr: true }) split the chunks but still loaded and hydrated all of them up front.)
// Smaller margin than the 600px default: with it the sections sat inside the margin on load and
// fetched their chunk immediately. Now they load once the user scrolls toward them.
// The placeholder (client-side navigations only) is a rough floor for the four sections, so
// Contact, the marquee and the footer are not all inside the load margin on arrival.
const IndexedSections = lazyOnView(() => import('@/features/Home/IndexedSections'), {
  rootMargin: '0px 0px 200px 0px',
  placeholderClassName: 'empty:min-h-[3500px]',
});
const Contact = lazyOnView(() => import('@/features/Contact'));
const Marquee = lazyOnView(() => import('@/components/ui/Marquee'));
const ArchitecturalSpine = dynamic(() => import('@/components/ui/ArchitecturalSpine'), { ssr: false });


const HOME_STRUCTURED_DATA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: 'Software Engineer',
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.profileImage}`,
    email: `mailto:${siteConfig.links.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Jakarta', addressCountry: 'ID' },
    sameAs: SAME_AS,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: { '@type': 'Person', name: siteConfig.name, url: siteConfig.url },
  },
];

const Home: NextPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  // The spine finds its sections by id once, on mount. Remount it when the lazy sections replace the static ones.
  const [spineKey, setSpineKey] = useState(0);
  // React Compiler memoizes this, so IndexedSections' onMount effect still runs once.
  const remountSpine = () => setSpineKey((key) => key + 1);
  // The spine is only shown on lg+, so phones and tablets never fetch its chunk.
  const isLg = useMediaQuery('(min-width: 1024px)', false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  return (
    <>
      <Seo
        path="/"
        title={`${siteConfig.name} | Software Engineer`}
        fullTitle
        description={siteConfig.description}
        jsonLd={HOME_STRUCTURED_DATA}
      />

      <div className="min-h-screen bg-background text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative flex flex-col">
        {/* Minimalist Top Reading Progress Bar (System Red Accent) */}
        <m.div
          style={{ scaleX: scrollYProgress }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-accent-brand to-red-600 origin-left z-50 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.7)]"
        />

        {/* Architectural Navigation Spine - Right Margin Index */}
        {isLg && <ArchitecturalSpine key={spineKey} />}

        {/* Main Content Surface (Elevated above sticky under-page footer) */}
        <div className="relative z-10 bg-background shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
          <main className="flex-1 relative">
            <Hero />
            
            {/* Continuous Sections Container */}
            <div ref={containerRef} className="relative">
              <IndexedSections onMount={remountSpine} />
              {/* Its hover highlight slides between cards with a layoutId. */}
              <LayoutMotion>
                <Contact />
              </LayoutMotion>
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

