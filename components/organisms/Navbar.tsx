import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { siteConfig } from '../../config/metadata.config';

interface NavItem {
  label: string;
  id?: string;
  path?: string;
}

const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    { label: 'HOME', id: 'hero' },
    { label: 'BLOG', path: '/blog' },
    { label: 'CONTACT', id: 'contact' },
    { label: 'SOCIALS' }
  ];

  const checkActive = (item: NavItem) => {
    return (item.id === 'hero' && router.pathname === '/' && !router.asPath.includes('#')) ||
           (item.id && router.asPath.includes(`#${item.id}`)) ||
           (item.path && router.pathname.startsWith(item.path));
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.id) {
      if (router.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById(item.id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
        router.push(`/#${item.id}`, undefined, { scroll: false });
      }
    }
  };

  const isExpanded = !isScrolled || isHovered;

  // Critically damped spring (smooth, no bounce)
  const layoutSpring = shouldReduceMotion 
    ? { duration: 0 } 
    : { type: 'spring' as const, bounce: 0, duration: 0.4 };

  // Strict staggered timing to prevent ghosting
  const getFadeTransition = (isActive: boolean) => ({
    duration: isActive ? 0.25 : 0.08,
    delay: isActive ? 0.12 : 0, 
    ease: "easeInOut" as const
  });

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      {/* Zero height wrapper forces center expansion */}
      <div className="fixed top-8 left-0 w-full hidden md:flex justify-center items-center z-[100] pointer-events-none h-0">
        <motion.div
          layout
          transition={layoutSpring}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setHoveredIndex(null); }}
          className="pointer-events-auto bg-[#0a0a0c]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.08)] relative flex items-center justify-center transition-shadow duration-300 hover:shadow-[0_24px_50px_rgba(0,0,0,0.9),_0_0_20px_rgba(255,255,255,0.02),_inset_0_1px_1px_rgba(255,255,255,0.12)]"
          style={{ borderRadius: 9999 }}
        >
          {/* 1. INVISIBLE SIZER: Dictates the container's width/height instantly */}
          <div className="invisible pointer-events-none select-none flex items-center justify-center" aria-hidden="true">
            {isExpanded ? (
              <div className="flex items-center gap-6 whitespace-nowrap px-6 h-[56px] w-max">
                <div className="font-sans font-black text-xs tracking-[0.2em] uppercase px-1.5 py-0.5 flex items-center gap-1.5">
                  <span>DAFFA ADITYA</span>
                  <span className="text-[8px] font-mono font-medium text-neutral-500 tracking-[0.1em]">// PORTFOLIO</span>
                </div>
                <span className="h-4 w-px" />
                <nav className="flex items-center gap-1.5 px-1 py-0.5">
                  {navItems.map((item) => (
                    <div key={item.label} className={`px-4 py-1.5 text-[10px] font-bold font-mono tracking-[0.15em] ${checkActive(item) ? 'text-white' : 'text-neutral-400'}`}>
                      {item.label}
                    </div>
                  ))}
                </nav>
                <span className="h-4 w-px" />
                <div className="px-5 py-2 font-extrabold font-mono text-[9px] uppercase tracking-[0.2em]">Resume</div>
              </div>
            ) : (
              <div className="flex items-center gap-3 whitespace-nowrap px-4 h-[44px] w-max">
                <div className="font-sans font-black text-xs tracking-[0.2em] uppercase px-1.5 py-0.5">DA</div>
                <span className="h-4 w-px" />
                <div className="flex items-center gap-2 px-2.5 py-1">
                  <span className="w-1.5 h-1.5" />
                  <span className="text-[8px] font-bold font-mono tracking-[0.25em] uppercase">AVAILABLE</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. VISIBLE EXPANDED: Absolute inset-0 layout matching parent dimensions */}
          <motion.div
            className={`absolute inset-0 flex items-center justify-between whitespace-nowrap px-6 h-[56px] ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}`}
            initial={false}
            animate={{ 
              opacity: isExpanded ? 1 : 0, 
              filter: isExpanded ? "blur(0px)" : "blur(4px)",
              pointerEvents: isExpanded ? 'auto' : 'none'
            }}
            transition={getFadeTransition(isExpanded)}
          >
            <Link
              href="/"
              onClick={(e) => {
                if (router.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  router.push('/', undefined, { scroll: false });
                }
              }}
              className="group font-sans font-black text-xs tracking-[0.2em] text-white transition-colors duration-200 uppercase focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none rounded px-1.5 py-0.5 flex items-center gap-1.5"
            >
              <span>DAFFA ADITYA</span>
              <span className="text-[8px] font-mono font-medium text-neutral-500 tracking-[0.1em] transition-colors duration-200 group-hover:text-neutral-400">// PORTFOLIO</span>
            </Link>
            <span className="h-4 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" aria-hidden="true" />
            
            {/* Nav container controls the mouse leave for the entire links area */}
            <nav className="flex items-center gap-1.5 relative px-1 py-0.5" onMouseLeave={() => setHoveredIndex(null)} aria-label="Desktop navigation">
              {navItems.map((item, index) => {
                const isActive = checkActive(item);
                if (item.label === 'SOCIALS') {
                  return (
                    <div
                      key={item.label}
                      className="relative h-full flex items-center"
                      onMouseEnter={() => {
                        setHoveredIndex(index);
                        setIsSocialOpen(true);
                      }}
                      onMouseLeave={() => {
                        setIsSocialOpen(false);
                      }}
                    >
                      <button
                        className={`relative px-4 py-1.5 text-[10px] font-bold font-mono tracking-[0.15em] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none rounded-full ${isSocialOpen ? 'text-white' : 'text-neutral-400 hover:text-white'} cursor-pointer`}
                      >
                        {/* The sliding pill: layoutId to jump between elements */}
                        {hoveredIndex === index && (
                          <motion.span 
                            layoutId="nav-hover-pill" 
                            className="absolute inset-0 bg-white/[0.05] border border-white/[0.08] rounded-full -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" 
                            transition={{ type: "spring", stiffness: 450, damping: 32 }} 
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </button>
                      <AnimatePresence>
                        {isSocialOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute top-[38px] left-1/2 -translate-x-1/2 bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)] p-3 flex flex-col gap-1.5 min-w-[140px] z-50 pointer-events-auto"
                          >
                            <a 
                              href={siteConfig.links.github} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 text-[10px] font-mono font-bold tracking-wider"
                            >
                              <Github size={14} className="shrink-0" />
                              GITHUB
                            </a>
                            <a 
                              href={siteConfig.links.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 text-[10px] font-mono font-bold tracking-wider"
                            >
                              <Linkedin size={14} className="shrink-0" />
                              LINKEDIN
                            </a>
                            <a 
                              href={`mailto:${siteConfig.links.email}`} 
                              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 text-[10px] font-mono font-bold tracking-wider"
                            >
                              <Mail size={14} className="shrink-0" />
                              EMAIL
                            </a>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    href={item.path || `/#${item.id}`}
                    onClick={(e) => handleNavigation(e, item)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    className={`relative px-4 py-1.5 text-[10px] font-bold font-mono tracking-[0.15em] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none rounded-full ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {/* The sliding pill: layoutId to jump between elements */}
                    {hoveredIndex === index && (
                      <motion.span 
                        layoutId="nav-hover-pill" 
                        className="absolute inset-0 bg-white/[0.05] border border-white/[0.08] rounded-full -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" 
                        transition={{ type: "spring", stiffness: 450, damping: 32 }} 
                      />
                    )}
                    {/* Active illuminated indicator */}
                    {isActive && (
                      <motion.span 
                        layoutId="active-nav-dot"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <span className="h-4 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" aria-hidden="true" />
            <Link 
              href="/resume" 
              className="relative px-5 py-2 overflow-hidden bg-white text-black font-extrabold font-mono text-[9px] rounded-full uppercase tracking-[0.2em] shadow-[0_8px_16px_-4px_rgba(255,255,255,0.25)] hover:bg-neutral-100 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none transition-[transform,background-color,box-shadow] duration-200"
            >
              Resume
            </Link>
          </motion.div>

          {/* 3. VISIBLE COLLAPSED: Absolute inset-0 layout matching parent dimensions */}
          <motion.div
            className={`absolute inset-0 flex items-center justify-between whitespace-nowrap px-4 h-[44px] ${!isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}`}
            initial={false}
            animate={{ 
              opacity: !isExpanded ? 1 : 0, 
              filter: !isExpanded ? "blur(0px)" : "blur(4px)",
              pointerEvents: !isExpanded ? 'auto' : 'none'
            }}
            transition={getFadeTransition(!isExpanded)}
          >
            <button 
              onClick={() => setIsHovered(true)} 
              className="font-sans font-black text-xs tracking-[0.2em] text-white uppercase focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none rounded px-1.5 py-0.5 cursor-pointer hover:text-neutral-300 transition-colors"
              aria-label="Expand navigation menu"
            >
              DA
            </button>
            <span className="h-4 w-px bg-white/[0.08]" aria-hidden="true" />
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/20 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]">
              <div className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500/30 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[8px] font-bold font-mono text-emerald-400 tracking-[0.25em] uppercase">AVAILABLE</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ================= MOBILE NAVBAR ================= */}
      <div className="fixed top-6 left-0 w-full md:hidden flex justify-center items-start z-[100] pointer-events-none h-0 px-4">
        <motion.div
          layout
          transition={layoutSpring}
          className="pointer-events-auto bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col justify-start items-center"
          style={{ borderRadius: isMobileMenuOpen ? 24 : 9999 }}
        >
          {/* MOBILE INVISIBLE SIZER */}
          <div className="invisible pointer-events-none select-none flex justify-center" aria-hidden="true">
            {isMobileMenuOpen ? (
              <div className="flex flex-col w-[calc(100vw-2rem)] max-w-[384px] pt-4 px-4 pb-6">
                <div className="flex items-center justify-between w-full pb-3 border-b border-transparent">
                  <span className="font-sans font-black text-xs tracking-[0.2em] uppercase">DAFFA ADITYA</span>
                  <div className="p-1"><X size={16} /></div>
                </div>
                <div className="flex flex-col gap-1 py-4">
                  {navItems.filter(i => i.label !== 'SOCIALS').map(i => (
                    <div key={i.label} className="py-3 px-4 text-xs font-bold font-mono tracking-widest uppercase">
                      {i.label}
                    </div>
                  ))}
                </div>
                {/* Social links block spacing in sizer */}
                <div className="flex justify-center gap-6 py-3 border-t border-transparent mt-2">
                  <div className="p-1"><div className="w-4 h-4" /></div>
                  <div className="p-1"><div className="w-4 h-4" /></div>
                  <div className="p-1"><div className="w-4 h-4" /></div>
                </div>
                <div className="pt-2 border-t border-transparent">
                  <div className="w-full py-3 font-bold font-mono text-xs uppercase text-center">Resume</div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-[240px] px-4 h-[44px]">
                <div className="font-sans font-black text-xs tracking-[0.2em] uppercase px-1.5 py-0.5">DA</div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5" />
                  <div className="p-1"><Menu size={16} /></div>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE VISIBLE EXPANDED: Absolute inset-0 */}
          <motion.div
            className={`absolute inset-0 flex flex-col pt-4 px-4 pb-6 ${isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            initial={false}
            animate={{ 
              opacity: isMobileMenuOpen ? 1 : 0, 
              filter: isMobileMenuOpen ? "blur(0px)" : "blur(4px)",
              pointerEvents: isMobileMenuOpen ? 'auto' : 'none'
            }}
            transition={getFadeTransition(isMobileMenuOpen)}
          >
            <div className="flex items-center justify-between w-full pb-3 border-b border-white/[0.08]">
              <span className="font-sans font-black text-xs tracking-[0.2em] text-white uppercase">DAFFA ADITYA</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-neutral-400 hover:text-white rounded p-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none transition-colors duration-200"
                aria-label="Close navigation menu"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 py-4" aria-label="Mobile navigation">
              {navItems.filter(item => item.label !== 'SOCIALS').map((item) => (
                <Link
                  key={item.label}
                  href={item.path || `/#${item.id}`}
                  onClick={(e) => { setIsMobileMenuOpen(false); handleNavigation(e, item); }}
                  className={`block py-3 px-4 text-xs font-bold font-mono tracking-widest uppercase rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none ${checkActive(item) ? 'bg-white/[0.06] text-white font-black' : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Social Links */}
            <div className="flex items-center justify-center gap-6 py-3 border-t border-white/[0.08] mt-2">
              <a 
                href={siteConfig.links.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neutral-400 hover:text-white transition-colors duration-200 p-1 rounded focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                aria-label="GitHub Profile"
              >
                <Github size={16} />
              </a>
              <a 
                href={siteConfig.links.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neutral-400 hover:text-white transition-colors duration-200 p-1 rounded focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href={`mailto:${siteConfig.links.email}`} 
                className="text-neutral-400 hover:text-white transition-colors duration-200 p-1 rounded focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                aria-label="Send Email"
              >
                <Mail size={16} />
              </a>
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              <Link 
                href="/resume" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="w-full py-3 bg-white text-black font-extrabold font-mono text-xs rounded-xl hover:bg-neutral-200 transition-colors duration-200 uppercase tracking-wider flex items-center justify-center focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
              >
                Resume
              </Link>
            </div>
          </motion.div>

          {/* MOBILE VISIBLE COLLAPSED: Absolute inset-0 */}
          <motion.div
            className={`absolute inset-0 flex items-center justify-between px-4 h-[44px] ${!isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            initial={false}
            animate={{ 
              opacity: !isMobileMenuOpen ? 1 : 0, 
              filter: !isMobileMenuOpen ? "blur(0px)" : "blur(4px)",
              pointerEvents: !isMobileMenuOpen ? 'auto' : 'none'
            }}
            transition={getFadeTransition(!isMobileMenuOpen)}
          >
            <Link 
              href="/" 
              className="font-sans font-black text-xs tracking-[0.2em] text-white uppercase rounded px-1.5 py-0.5 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
            >
              DA
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-2 h-2">
                <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500/30 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(true)} 
                className="text-neutral-400 hover:text-white rounded p-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none transition-colors duration-200"
                aria-label="Open navigation menu"
              >
                <Menu size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
