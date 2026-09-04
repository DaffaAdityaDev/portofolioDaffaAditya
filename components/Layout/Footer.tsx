import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Mail, Clock, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config/metadata.config';

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
      <div className="fixed bottom-0 left-0 right-0 h-[680px] sm:h-[520px] md:h-[460px] w-full -z-10 bg-[#060608] border-t border-neutral-800/80">
        <motion.footer
          style={{ opacity, y, scale }}
          className="h-full w-full max-w-7xl mx-auto px-6 lg:px-20 py-8 sm:py-10 flex flex-col justify-between relative overflow-hidden"
        >
          {/* Background Ambient Watermark */}
          <div
            aria-hidden="true"
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[14vw] sm:text-[13vw] font-black text-white/[0.08] uppercase tracking-tighter whitespace-nowrap pointer-events-none select-none z-0"
          >
            Daffa Aditya
          </div>

          {/* Top Bar: Brand, Live Clock, Back to Top */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80">
            <div className="flex flex-col">
              <span className="font-bold text-base text-white tracking-tight uppercase block">
                Daffa Aditya
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Software Engineer
              </span>
            </div>

            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
              {/* Live Jakarta Clock */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/60 border border-neutral-800 text-xs font-mono text-neutral-400">
                <Clock size={12} className="text-neutral-500" />
                <span className="text-[10px] text-neutral-500">JAKARTA</span>
                <span className="text-white font-bold">{jakartaTime || '15:20:00'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                data-cursor="merge"
                className="group flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Scroll to top"
              >
                <span>TOP</span>
                <div className="w-6 h-6 rounded-full bg-neutral-900 border border-neutral-800 group-hover:border-neutral-600 flex items-center justify-center transition-colors">
                  <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            </div>
          </div>

          {/* Middle Navigation Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
            {/* Col 1: Status & Scope */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                AVAILABILITY
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 font-bold">OPEN FOR ROLES</span>
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                Available for full-time frontend engineering & high-impact contracts.
              </p>
            </div>

            {/* Col 2: Navigation */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                NAVIGATION
              </span>
              <ul className="space-y-1.5 text-xs font-mono">
                <li>
                  <Link href="/" className="text-neutral-300 hover:text-white transition-colors">
                    /home
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-neutral-300 hover:text-white transition-colors">
                    /blog
                  </Link>
                </li>
                <li>
                  <Link href="/resume" className="text-neutral-300 hover:text-white transition-colors">
                    /resume
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Direct Connect */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block font-bold">
                CONNECT
              </span>
              <ul className="space-y-1.5 text-xs font-mono">
                <li>
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
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
                    className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Linkedin size={12} />
                    <span>LinkedIn</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.links.email}`}
                    className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Mail size={12} />
                    <span>Email</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Tech & Build Specs */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-bold">
                SYSTEM SPEC
              </span>
              <div className="space-y-1 text-xs font-mono text-neutral-400">
                <div className="flex justify-between border-b border-neutral-900 pb-1">
                  <span className="text-neutral-500">FRAMEWORK</span>
                  <span className="text-white">Next.js 16</span>
                </div>
                <div className="flex justify-between border-b border-neutral-900 pb-1">
                  <span className="text-neutral-500">BUNDLER</span>
                  <span className="text-white">Turbopack</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">ANIMATIONS</span>
                  <span className="text-white">Motion for React</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Polish */}
          <div className="relative z-10 pt-4 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-neutral-500">
            <div>© {new Date().getFullYear()} DAFFA ADITYA. ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-1 text-neutral-400">
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
