import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail, Clock } from 'lucide-react';
import { siteConfig } from '@/config/metadata.config';
import { formatJakartaTime } from '@/utils/date';

// three.js is ~136 KB gzip, so the shader is client-only and loaded only when the footer nears the viewport.
const FractalGlass = dynamic(() => import('@/components/ui/FractalGlass'), { ssr: false });

// Static stand-in for the shader (same palette): shown before it loads, under reduced motion and without WebGL.
const AMBIENT_GRADIENT: React.CSSProperties = {
  background: [
    'radial-gradient(55% 75% at 18% 30%, rgba(10, 64, 217, 0.45), transparent 70%)',
    'radial-gradient(50% 70% at 72% 35%, rgba(199, 20, 158, 0.38), transparent 70%)',
    'radial-gradient(50% 70% at 50% 95%, rgba(235, 38, 64, 0.32), transparent 70%)',
    'radial-gradient(40% 60% at 92% 85%, rgba(13, 224, 235, 0.22), transparent 70%)',
  ].join(', '),
};

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [jakartaTime, setJakartaTime] = useState<string>('');
  // `isNear`: footer is within about one viewport. `shaderRequested` latches so the shader is never torn down again.
  const [isNear, setIsNear] = useState(false);
  const [shaderRequested, setShaderRequested] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end end'],
  });

  // Sticky under-page reveal: fades from transparent to opaque with subtle parallax expansion
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.7, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNear(entry.isIntersecting);
        if (entry.isIntersecting) setShaderRequested(true);
      },
      { rootMargin: '100% 0px' }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Only tick the clock while the footer can actually be seen.
  useEffect(() => {
    if (!isNear) return;

    const updateTime = () => {
      setJakartaTime(formatJakartaTime());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isNear]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[680px] sm:h-[520px] md:h-[460px] w-full pointer-events-none"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      {/* Sticky Under-Page Surface */}
      <div className="fixed bottom-0 left-0 right-0 h-[680px] sm:h-[520px] md:h-[460px] w-full z-0 pointer-events-auto bg-[#060608] border-t border-white/20 overflow-hidden">
        {/* Ambient Fractal Glass Refraction Layer (Three.js WebGL over a static gradient) */}
        <m.div style={{ opacity, scale }} className="absolute inset-0 w-full h-full pointer-events-none">
          <div aria-hidden="true" className="absolute inset-0" style={AMBIENT_GRADIENT} />
          {shaderRequested && !prefersReducedMotion && (
            <FractalGlass intensity="vibrant" interactive={true} targetRef={containerRef} />
          )}
        </m.div>

        {/* Ambient Contrast Protection Mask for WCAG AAA Readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#060608]/80 via-[#060608]/50 to-[#060608]/90"
        />

        {/* Background Ambient Watermark - Centered on Full Viewport */}
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

        <m.footer
          style={{ opacity, y, scale }}
          className="h-full w-full max-w-7xl mx-auto px-6 lg:px-20 py-8 sm:py-10 flex flex-col justify-between relative overflow-hidden"
        >
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
                className="group flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-all cursor-pointer"
                aria-label="Scroll to top"
              >
                <span className="font-semibold tracking-wider">TOP</span>
                <div className="w-6 h-6 rounded-full bg-neutral-900/90 border border-white/20 group-hover:border-red-500/50 group-hover:bg-neutral-800 flex items-center justify-center transition-all shadow-sm">
                  <ArrowUp size={12} className="group-hover:-translate-y-0.5 transition-transform text-neutral-300 group-hover:text-red-400" />
                </div>
              </button>
            </div>
          </div>

          {/* Middle Navigation Grid - Vertically Centered via my-auto */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 my-auto py-6 items-start">
            {/* Col 1: Status & Scope */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-widest block font-bold">
                AVAILABILITY
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 font-bold">OPEN FOR ROLES</span>
              </div>
              <p className="text-xs text-neutral-200 font-sans leading-relaxed max-w-xs">
                Available for full-time software engineering roles and freelance projects.
              </p>
            </div>

            {/* Col 2: Navigation (Centered in Column) */}
            <div className="space-y-2 md:justify-self-center">
              <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-widest block font-bold">
                NAVIGATION
              </span>
              <ul className="space-y-2 text-xs font-mono">
                <li>
                  <Link
                    href="/"
                    className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white hover:translate-x-1.5 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-neutral-500 group-hover:text-red-500 transition-colors font-mono font-bold">/</span>
                    <span className="group-hover:text-white font-medium transition-colors">home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white hover:translate-x-1.5 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-neutral-500 group-hover:text-red-500 transition-colors font-mono font-bold">/</span>
                    <span className="group-hover:text-white font-medium transition-colors">blog</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resume"
                    className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white hover:translate-x-1.5 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-neutral-500 group-hover:text-red-500 transition-colors font-mono font-bold">/</span>
                    <span className="group-hover:text-white font-medium transition-colors">resume</span>
                  </Link>
                </li>
                {/* /freelance link hidden while the page is being tuned; restore to show it again.
                <li>
                  <Link
                    href="/freelance"
                    className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white hover:translate-x-1.5 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-neutral-500 group-hover:text-red-500 transition-colors font-mono font-bold">/</span>
                    <span className="group-hover:text-white font-medium transition-colors">freelance</span>
                  </Link>
                </li>
                */}
              </ul>
            </div>

            {/* Col 3: Direct Connect (Centered in Column) */}
            <div className="space-y-2 md:justify-self-center">
              <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-widest block font-bold">
                CONNECT
              </span>
              <ul className="space-y-2 text-xs font-mono">
                <li>
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-neutral-400 hover:text-white hover:translate-x-1.5 transition-all duration-200 cursor-pointer"
                  >
                    <Github size={13} className="text-neutral-500 group-hover:text-white transition-colors" />
                    <span className="font-medium">GitHub</span>
                    <ArrowUpRight size={11} className="text-neutral-600 group-hover:text-red-500 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </li>
                <li>
                  <a
                    href={siteConfig.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-neutral-400 hover:text-white hover:translate-x-1.5 transition-all duration-200 cursor-pointer"
                  >
                    <Linkedin size={13} className="text-neutral-500 group-hover:text-white transition-colors" />
                    <span className="font-medium">LinkedIn</span>
                    <ArrowUpRight size={11} className="text-neutral-600 group-hover:text-red-500 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.links.email}`}
                    className="group inline-flex items-center gap-2 text-neutral-400 hover:text-white hover:translate-x-1.5 transition-all duration-200 cursor-pointer"
                  >
                    <Mail size={13} className="text-neutral-500 group-hover:text-white transition-colors" />
                    <span className="font-medium">Email</span>
                    <ArrowUpRight size={11} className="text-neutral-600 group-hover:text-red-500 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Tech & Build Specs (Right-aligned in Column) */}
            <div className="space-y-2 md:justify-self-end w-full max-w-[260px]">
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
              <span>Software Engineer, based in Jakarta, Indonesia</span>
            </div>
          </div>
        </m.footer>
      </div>
    </div>
  );
};

export default Footer;
export { Footer as FooterComponent };
