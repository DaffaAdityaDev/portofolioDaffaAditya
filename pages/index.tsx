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

      const getCoords = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return { x: 0, y: 0, top: 0, bottom: 0 };
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
          top: rect.top - containerRect.top,
          bottom: rect.bottom - containerRect.top
        };
      };

      const exp = getCoords('experience-timeline-start');
      const proj = getCoords('projects-timeline-start');
      const contact = getCoords('contact-timeline-start');
      const expSection = getCoords('experience-section');
      const worksSection = getCoords('works');
      const contactSection = getCoords('contact');
      const contactEnd = getCoords('contact-timeline-end');

      if (exp.x && proj.x && contact.x) {
        setPoints({
          expStart: { x: exp.x, y: exp.y },
          expEnd: { x: exp.x, y: expSection.bottom },
          projStart: { x: proj.x, y: worksSection.top },
          projEnd: { x: proj.x, y: worksSection.bottom },
          contactStart: { x: contact.x, y: contactSection.top },
          contactEnd: { x: contact.x, y: contactEnd.y }
        });
      }
    };

    // Delay slightly to allow components to render and mount
    const timer = setTimeout(updatePoints, 100);

    window.addEventListener('resize', updatePoints);
    
    // ResizeObserver for dynamic height updates
    const observer = new ResizeObserver(updatePoints);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePoints);
      observer.disconnect();
    };
  }, []);

  const pathD = points
    ? `M ${points.expStart.x} ${points.expStart.y} L ${points.expEnd.x} ${points.expEnd.y} H ${points.projStart.x} L ${points.projStart.x} ${points.projStart.y} L ${points.projEnd.x} ${points.projEnd.y} H ${points.contactStart.x} L ${points.contactStart.x} ${points.contactStart.y} L ${points.contactEnd.x} ${points.contactEnd.y}`
    : '';

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

