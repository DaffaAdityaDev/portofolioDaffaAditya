import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Mail, Clock } from 'lucide-react';
import { siteConfig } from '@/config/metadata.config';
import FractalGlass from '@/components/ui/FractalGlass';

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [jakartaTime, setJakartaTime] = useState<string>('');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Sticky under-page reveal: fades from transparent to opaque with subtle parallax expansion
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.7, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setJakartaTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[680px] sm:h-[520px] md:h-[460px] w-full"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      {/* Sticky Under-Page Surface */}
      <div className="fixed bottom-0 left-0 right-0 h-[680px] sm:h-[520px] md:h-[460px] w-full -z-10 bg-[#060608] border-t border-white/20 overflow-hidden">
        {/* Ambient Fractal Glass Refraction Layer (Three.js WebGL) */}
        <motion.div style={{ opacity, scale }} className="absolute inset-0 w-full h-full pointer-events-none">
          <FractalGlass intensity="vibrant" interactive={true} targetRef={containerRef} />
        </motion.div>

        {/* Ambient Contrast Protection Mask for WCAG AAA Readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#060608]/80 via-[#060608]/50 to-[#060608]/90"
        />

        <motion.footer
          style={{ opacity, y, scale }}
          className="h-full w-full max-w-7xl mx-auto px-6 lg:px-20 py-8 sm:py-10 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Background Ambient Watermark - Filled at 20% opacity */}
          <div
            aria-hidden="true"
            className="absolute -bottom-4 md:-bottom-8 left-1/2 -translate-x-1/2 text-[14vw] sm:text-[13vw] font-black uppercase tracking-tighter whitespace-nowrap pointer-events-none select-none z-0"
            style={{
              color: 'rgba(255, 255, 255, 0.05)',
              textShadow: '0 0 32px rgba(255, 255, 255, 0.02)',
            }}
          >
            Daffa Aditya
          </div>

          {/* Top Bar: Brand, Live Clock, Back to Top */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/20">
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-white tracking-tight uppercase block drop-shadow-[0_1px_8px_rgba(255,255,255,0.12)]">
                Daffa Aditya
              </span>
              <span className="text-xs font-mono text-neutral-300">
                Software Engineer
              </span>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              {/* Live Jakarta Clock */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-white/15 text-xs font-mono text-neutral-300">
                <Clock size={12} className="text-neutral-400" />
                <span className="text-[10px] text-neutral-400 font-semibold">JAKARTA</span>
                <span className="text-white font-bold">{jakartaTime || '15:20:00'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                data-cursor="merge"
                className="group flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Scroll to top"
              >
                <span>TOP</span>
                <div className="w-6 h-6 rounded-full bg-neutral-900/80 border border-white/20 group-hover:border-white/50 flex items-center justify-center transition-colors">
                  <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform text-white" />
                </div>
              </button>
            </div>
          </div>

          {/* Middle Navigation Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-4">
            {/* Col 1: Status & Scope */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-widest block font-bold">
                AVAILABILITY
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 font-bold">OPEN FOR ROLES</span>
              </div>
              <p className="text-xs text-neutral-200 font-sans leading-relaxed">
                Available for full-time frontend engineering & high-impact contracts.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-widest block font-bold">
                NAVIGATION
              </span>
              <ul className="space-y-1.5 text-xs font-mono">
                <li>
                  <Link href="/" className="text-neutral-200 hover:text-white transition-colors">
                    /home
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-neutral-200 hover:text-white transition-colors">
                    /blog
                  </Link>
                </li>
                <li>
                  <Link href="/resume" className="text-neutral-200 hover:text-white transition-colors">
                    /resume
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Direct Connect */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-widest block font-bold">
                CONNECT
              </span>
              <ul className="space-y-1.5 text-xs font-mono">
                <li>
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Github size={12} />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Linkedin size={12} />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.links.email}`}
                    className="text-neutral-200 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Mail size={12} />
                    <span>Email</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Tech & Build Specs */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-widest block font-bold">
                SYSTEM SPEC
              </span>
              <div className="space-y-1.5 text-xs font-mono text-neutral-300">
                <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-1">
                  <span className="text-neutral-400 font-medium text-[10px] sm:text-[11px]">FRAMEWORK</span>
                  <span className="text-white font-medium text-right text-[11px] sm:text-xs whitespace-nowrap">Next.js 16</span>
                </div>
                <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-1">
                  <span className="text-neutral-400 font-medium text-[10px] sm:text-[11px]">BUNDLER</span>
                  <span className="text-white font-medium text-right text-[11px] sm:text-xs whitespace-nowrap">Turbopack</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-neutral-400 font-medium text-[10px] sm:text-[11px]">ANIMATION</span>
                  <span className="text-white font-medium text-right text-[11px] sm:text-xs whitespace-nowrap">Framer Motion</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Polish */}
          <div className="relative z-10 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-neutral-400">
            <div>© {new Date().getFullYear()} DAFFA ADITYA. ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-1 text-neutral-300 font-medium">
              <span>Software Engineer Base on Jakarta</span>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Footer;
export { Footer as FooterComponent };
