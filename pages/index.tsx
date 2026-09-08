import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Hero from '@/features/Hero';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

// Above the fold components stay as static imports for LCP
import { MARQUEE_TEXT } from '@/constant/constant';

// Below the fold components are lazy-loaded
const Marquee = dynamic(() => import('@/components/ui/Marquee'), { ssr: true });
const AboutMe = dynamic(() => import('@/features/AboutMe'), { ssr: true });
const Experience = dynamic(() => import('@/features/Experience'), { ssr: true });
const Projects = dynamic(() => import('@/features/Projects'), { ssr: true });
const TechStack = dynamic(() => import('@/features/TechStack'), { ssr: true });
const Contact = dynamic(() => import('@/features/Contact'), { ssr: true });
const Footer = dynamic(() => import('@/components/Layout/Footer'), { ssr: true });
const ArchitecturalSpine = dynamic(() => import('@/components/ui/ArchitecturalSpine'), { ssr: false });

const Home: NextPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  return (
    <>
      <Head>
        <title>Daffa Aditya Rahman | Software Engineer</title>
        <meta name="description" content="Portfolio of Daffa Aditya Rahman, a Software Engineer specialized in industrial-grade systems and high-performance web architectures." />
        <meta property="og:title" content="Daffa Aditya Rahman" />
        <meta
          property="og:description"
          content="Software Engineer Portfolio - Crafting functional and user-centric web solutions."
        />
        <meta property="og:image" content="/image/Profile.jpg" />
        <meta property="og:url" content="https://daffaaditya.netlify.app" />
        <link rel="icon" href="/svg/selflogo.svg" />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative flex flex-col">
        {/* Minimalist Top Reading Progress Bar (System Red Accent) */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-red-500 to-red-600 origin-left z-50 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.7)]"
        />

        {/* Architectural Navigation Spine - Right Margin Index */}
        <ArchitecturalSpine />

        {/* Main Content Surface (Elevated above sticky under-page footer) */}
        <div className="relative z-10 bg-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.9)]">
          <main className="flex-1 relative">
            <Hero />
            
            {/* Continuous Sections Container */}
            <div ref={containerRef} className="relative">
              <AboutMe />
              <Experience />
              <Projects />
              <TechStack />
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

