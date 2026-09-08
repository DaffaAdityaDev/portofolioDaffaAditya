import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import GridLine from '@/components/ui/GridLine';
import BentoGrid from './components/BentoGrid';
import { FADE_IN_SCALE } from '@/constant/animations';
import SpotlightButton from '@/components/ui/SpotlightButton';
import type { CyberPalette } from '@/components/ui/CyberMatrixShader';

const CyberMatrixShader = dynamic(() => import('@/components/ui/CyberMatrixShader'), { ssr: false });

const Hero = () => {
  const router = useRouter();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leftSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const [cyberPalette, setCyberPalette] = useState<CyberPalette>('red');
  const [delta, setDelta] = useState<{ x: number; y: number } | null>(null);
  const [isIntro, setIsIntro] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.scrollY <= 20;
    }
    return true;
  });

  useEffect(() => {
    // Scroll-Aware Bypass: If user refreshed while scrolled down, bypass intro completely
    if (window.scrollY > 20) {
      setIsIntro(false);
      return;
    }

    if (!headlineRef.current) return;
    const rect = headlineRef.current.getBoundingClientRect();
    const targetCenterX = window.innerWidth / 2;
    const targetCenterY = window.innerHeight / 2;
    const currentCenterX = rect.left + rect.width / 2;
    const currentCenterY = rect.top + rect.height / 2;

    setDelta({
      x: targetCenterX - currentCenterX,
      y: targetCenterY - currentCenterY,
    });

    // Hydration Stream Trigger
    const rafId = requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        setIsIntro(false);
      }, 40);
      return () => clearTimeout(timer);
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/* Fullscreen Backdrop behind the centered headline during intro (only when at top of page) */}
      {isIntro && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: isIntro ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-[#0a0a0a] z-30 pointer-events-none"
        />
      )}

      {/* Intro system indicator */}
      {isIntro && (
        <motion.div
          animate={{ opacity: isIntro ? 0.6 : 0, y: isIntro ? 0 : 12 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-12 inset-x-0 z-40 flex items-center justify-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest pointer-events-none select-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>INITIALIZING SYSTEM</span>
        </motion.div>
      )}

      <section
        ref={heroSectionRef}
        id="hero"
        className="relative pt-20 flex flex-col lg:flex-row min-h-[100dvh] overflow-hidden"
      >
        {/* Full-Hero Unified Cyber Matrix & Radar Scanner: Passes continuously between Left and Right */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <CyberMatrixShader
            palette={cyberPalette}
            onPaletteChange={setCyberPalette}
            targetRef={heroSectionRef}
            spotlightRadius={340}
          />
          {/* Subtle perimeter vignettes ensuring crisp headline readability and smooth border blending */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0a0a0a]/55 via-transparent to-[#0a0a0a]/35" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,#0a0a0a_96%)]" />
        </div>

        {/* Left Section: Content */}
        <div
          ref={leftSectionRef}
          className="w-full lg:w-1/2 p-6 md:p-12 lg:p-16 relative flex items-center overflow-hidden z-10"
        >

          <GridLine className="top-12 opacity-30 pointer-events-none z-10" />
          <GridLine className="bottom-12 opacity-30 pointer-events-none z-10" />
          <GridLine vertical className="left-6 md:left-12 opacity-30 pointer-events-none z-10" />

          <div className="flex flex-col justify-between h-full py-8 lg:py-0 w-full relative z-20">
            <div className="space-y-6">
              {/* Header Badges: Software Engineer */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Software Engineer Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: isIntro ? 0 : 1,
                    y: isIntro ? 15 : 0,
                  }}
                  transition={{ duration: 0.6, delay: isIntro ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 border border-red-500/20 bg-red-500/10 px-3 py-1 rounded-full"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-semibold font-mono tracking-widest uppercase">Software Engineer</span>
                </motion.div>
              </div>

              {/* Single Continuous Headline: Physically glides from screen center to hero layout */}
              <motion.h1
                ref={headlineRef}
                initial={false}
                animate={{
                  x: isIntro && delta ? delta.x : 0,
                  y: isIntro && delta ? delta.y : 0,
                  scale: isIntro && delta ? 1.18 : 1,
                  opacity: (!isIntro || delta) ? 1 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 85,
                  damping: 19,
                  mass: 0.95,
                }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter uppercase relative z-40 origin-center"
              >
                Daffa <br />
                Aditya <br />
              </motion.h1>

              {/* Subtitle Bio Paragraph */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: isIntro ? 0 : 1,
                  y: isIntro ? 20 : 0,
                }}
                transition={{ duration: 0.6, delay: isIntro ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl text-neutral-300 text-base md:text-lg leading-relaxed font-sans"
              >
                Engineering industrial-grade systems and high-performance web architectures built for speed, resilience, and scale.
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isIntro ? 0 : 1,
                y: isIntro ? 20 : 0,
              }}
              transition={{ duration: 0.6, delay: isIntro ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-4 mt-10 lg:mt-12"
            >
              <SpotlightButton
                variant="primary"
                onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                VIEW PROJECTS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </SpotlightButton>
              <SpotlightButton
                variant="secondary"
                onClick={() => router.push('/resume')}
              >
                RESUME
              </SpotlightButton>
            </motion.div>
          </div>
        </div>

        {/* Right Section: Bento Grid */}
        <motion.div
          variants={FADE_IN_SCALE}
          initial="hidden"
          animate={isIntro ? "hidden" : "visible"}
          className="w-full lg:w-1/2 p-6 lg:p-12 xl:p-16 relative flex items-center justify-center z-10"
        >
          <div className="w-full max-w-lg z-10">
            <BentoGrid />
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
export { Hero as HeroComponent };
