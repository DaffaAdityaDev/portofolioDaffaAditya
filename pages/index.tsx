import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Hero from '@/features/Hero';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

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

const Home: NextPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<{
    expStart: { x: number; y: number };
    expEnd: { x: number; y: number };
    projStart: { x: number; y: number };
    projEnd: { x: number; y: number };
    contactStart: { x: number; y: number };
    contactEnd: { x: number; y: number };
  } | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"]
  });

  useEffect(() => {
    const updatePoints = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      const getX = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.left - containerRect.left + rect.width / 2;
      };

      const getSectionY = (id: string, edge: 'top' | 'bottom') => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return edge === 'top' 
          ? rect.top - containerRect.top 
          : rect.bottom - containerRect.top;
      };

      const expX = getX('experience-timeline-start');
      const projX = getX('projects-timeline-start');
      const contactX = getX('contact-timeline-start');

      const expStartEl = document.getElementById('experience-timeline-start');
      const expStartYVal = expStartEl ? expStartEl.getBoundingClientRect().top - containerRect.top + expStartEl.getBoundingClientRect().height / 2 : 0;

      const expEndY = getSectionY('experience-section', 'bottom');
      const projStartY = getSectionY('works', 'top');
      const projEndY = getSectionY('works', 'bottom');
      const contactStartY = getSectionY('contact', 'top');
      
      const contactEndEl = document.getElementById('contact-timeline-end');
      const contactEndYVal = contactEndEl ? contactEndEl.getBoundingClientRect().top - containerRect.top + contactEndEl.getBoundingClientRect().height / 2 : 0;

      if (expX && projX && contactX) {
        setPoints({
          expStart: { x: expX, y: expStartYVal },
          expEnd: { x: expX, y: expEndY },
          projStart: { x: projX, y: projStartY },
          projEnd: { x: projX, y: projEndY },
          contactStart: { x: contactX, y: contactStartY },
          contactEnd: { x: contactX, y: contactEndYVal }
        });
      }
    };

    // Delay slightly to allow components to render and mount
    const timer = setTimeout(updatePoints, 100);

    window.addEventListener('resize', updatePoints);
    
    // ResizeObserver for dynamic height updates
    const observer = new ResizeObserver(() => {
      updatePoints();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePoints);
      observer.disconnect();
    };
  }, []);

  let pathD = "";
  if (points) {
    const { expStart, expEnd, projStart, projEnd, contactStart, contactEnd } = points;

    pathD = `
      M ${expStart.x} ${expStart.y}
      L ${expEnd.x} ${expEnd.y}
      H ${projStart.x}
      L ${projStart.x} ${projStart.y}
      L ${projEnd.x} ${projEnd.y}
      H ${contactStart.x}
      L ${contactStart.x} ${contactStart.y}
      L ${contactEnd.x} ${contactEnd.y}
    `.replace(/\s+/g, ' ').trim();
  }

  return (
    <>
      <Head>
        <title>Daffa Aditya Rahman | Software Engineer</title>
        <meta name="description" content="Portfolio of Daffa Aditya Rahman, a Software Engineer specialized in high-performance web solutions and industrial-grade UI/UX." />
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
        
        <main className="flex-1 relative">
          <Hero />
          <AboutMe />
          
          {/* Continuous Timeline container */}
          <div ref={containerRef} className="relative">
            {pathD && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {/* Background path */}
                <path
                  d={pathD}
                  stroke="#27272a"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Glow Progress path */}
                <motion.path
                  d={pathD}
                  stroke="#ef4444"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  style={{ pathLength: scrollYProgress }}
                  className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                />
              </svg>
            )}
            
            <Experience />
            <Projects />
            <TechStack />
            <Contact />
          </div>
        </main>

        {/* Footer Marquee */}
        <Marquee text={MARQUEE_TEXT} border={true} type="light" />

        <Footer />
      </div>
    </>
  );
};

export default Home;
