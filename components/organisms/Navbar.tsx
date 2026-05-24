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
    // { label: 'FREELANCE', path: '/freelance' },
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

  const transitionClass = shouldReduceMotion
    ? ''
    : 'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]';

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      {/* Zero height wrapper forces center expansion */}
      <div className="fixed top-8 left-0 w-full hidden md:flex justify-center items-center z-[100] pointer-events-none h-0">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setHoveredIndex(null); }}
          className={`pointer-events-auto relative flex items-center justify-center overflow-hidden rounded-full group ${transitionClass} ${isExpanded ? 'h-14 px-6 gap-6' : 'h-11 px-4 gap-3'
            }`}
          style={{
            borderRadius: 9999,
          }}
        >
          {/* Background Layer with heavy filters */}
          <div className="absolute inset-0 bg-[#0a0a0c]/85 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.08)] group-hover:shadow-[0_24px_50px_rgba(0,0,0,0.9),_0_0_20px_rgba(255,255,255,0.02),_inset_0_1px_1px_rgba(255,255,255,0.12)] rounded-full -z-10 pointer-events-none transition-shadow duration-300" />

          <div
            className={`flex items-center justify-center whitespace-nowrap pointer-events-auto ${transitionClass} ${isExpanded ? 'gap-6' : 'gap-3'
              }`}
          >
            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => {
                if (!isExpanded) {
                  e.preventDefault();
                  setIsHovered(true);
                } else if (router.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  router.push('/', undefined, { scroll: false });
                }
              }}
              className="group/logo font-sans font-black text-xs tracking-[0.2em] text-white transition-colors duration-200 uppercase focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none rounded px-1.5 py-0.5 flex items-center gap-1.5"
            >
              <span className="relative flex items-center h-5">
                <span>D</span>
                <span
                  className={`${transitionClass} overflow-hidden flex items-center whitespace-nowrap ${isExpanded ? 'max-w-[200px] opacity-100 ml-0.5' : 'max-w-0 opacity-0 ml-0'
                    }`}
                >
                  AFFA ADITYA
                </span>
                <span
                  className={`${transitionClass} overflow-hidden flex items-center whitespace-nowrap ${!isExpanded ? 'max-w-[20px] opacity-100 ml-0.5' : 'max-w-0 opacity-0 ml-0'
                    }`}
                >
                  A
                </span>
                <span
                  className={`text-[8px] font-mono font-medium text-neutral-500 tracking-[0.1em] transition-colors duration-200 group-hover/logo:text-neutral-400 whitespace-nowrap overflow-hidden ${transitionClass} ${isExpanded ? 'max-w-[120px] opacity-100 ml-1.5' : 'max-w-0 opacity-0 ml-0'
                    }`}
                >
                  // PORTFOLIO
                </span>
              </span>
            </Link>

            {/* Divider 1 */}
            <span
              className={`h-4 bg-white/[0.08] shrink-0 ${transitionClass} ${isExpanded ? 'w-px opacity-100' : 'w-0 opacity-0 pointer-events-none'
                }`}
              aria-hidden="true"
            />

            {/* Middle Section (Nav Menu) */}
            <nav
              className={`flex items-center gap-1.5 relative px-1 py-0.5 overflow-hidden whitespace-nowrap ${transitionClass} ${isExpanded ? 'max-w-[400px] opacity-100 pointer-events-auto' : 'max-w-0 opacity-0 pointer-events-none'
                }`}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label="Desktop navigation"
            >
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
                    {hoveredIndex === index && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 bg-white/[0.05] border border-white/[0.08] rounded-full -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
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

            {/* Status Pill */}
            <div
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/20 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)] overflow-hidden whitespace-nowrap shrink-0 ${transitionClass} ${!isExpanded ? 'max-w-[150px] opacity-100 pointer-events-auto' : 'max-w-0 opacity-0 pointer-events-none'
                }`}
            >
              <div className="relative flex items-center justify-center w-2 h-2 shrink-0">
                <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-500/30 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[8px] font-bold font-mono text-emerald-400 tracking-[0.25em] uppercase">
                AVAILABLE
              </span>
            </div>

            {/* Right Section (Resume Button) */}
            <div
              className={`flex items-center overflow-hidden whitespace-nowrap ${transitionClass} ${isExpanded ? 'max-w-[150px] opacity-100 pointer-events-auto gap-6' : 'max-w-0 opacity-0 pointer-events-none gap-0'
                }`}
            >
              <span className="h-4 w-px bg-white/[0.08] shrink-0" aria-hidden="true" />
              <Link
                href="/resume"
                className="relative px-5 py-2 overflow-hidden bg-white text-black font-extrabold font-mono text-[9px] rounded-full uppercase tracking-[0.2em] shadow-[0_8px_16px_-4px_rgba(255,255,255,0.25)] hover:bg-neutral-100 hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none transition-[transform,background-color,box-shadow] duration-200 whitespace-nowrap shrink-0"
              >
                Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE NAVBAR ================= */}
      <div className="fixed top-6 left-0 w-full md:hidden flex justify-center items-start z-[100] pointer-events-none h-0 px-4">
        <div
          className={`pointer-events-auto overflow-hidden relative flex flex-col justify-start items-center group ${transitionClass} ${isMobileMenuOpen
              ? 'w-[calc(100vw-2rem)] max-w-[384px] h-[310px] rounded-3xl'
              : 'w-[240px] h-[44px] rounded-full'
            }`}
        >
          {/* Background Layer with heavy filters */}
          <div className="absolute inset-0 bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.8)] -z-10 rounded-[inherit] pointer-events-none" />

          <AnimatePresence initial={false}>
            {isMobileMenuOpen ? (
              <motion.div
                key="mobile-expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col w-full h-full pt-4 px-4 pb-6 pointer-events-auto absolute inset-0 justify-between"
              >
                <div className="flex items-center justify-between w-full pb-3 border-b border-white/[0.08] shrink-0">
                  <span className="font-sans font-black text-xs tracking-[0.2em] text-white uppercase">DAFFA ADITYA</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-neutral-400 hover:text-white rounded p-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none transition-colors duration-200"
                    aria-label="Close navigation menu"
                  >
                    <X size={16} />
                  </button>
                </div>
                <nav className="flex flex-col gap-1 py-2 grow justify-center" aria-label="Mobile navigation">
                  {navItems.filter(item => item.label !== 'SOCIALS').map((item) => (
                    <Link
                      key={item.label}
                      href={item.path || `/#${item.id}`}
                      onClick={(e) => { setIsMobileMenuOpen(false); handleNavigation(e, item); }}
                      className={`block py-2.5 px-4 text-xs font-bold font-mono tracking-widest uppercase rounded-xl transition-colors focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none ${checkActive(item) ? 'bg-white/[0.06] text-white font-black' : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                {/* Social Links */}
                <div className="flex items-center justify-center gap-6 py-2.5 border-t border-white/[0.08] shrink-0">
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

                <div className="pt-2.5 border-t border-white/[0.08] shrink-0">
                  <Link
                    href="/resume"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 bg-white text-black font-extrabold font-mono text-xs rounded-xl hover:bg-neutral-200 transition-colors duration-200 uppercase tracking-wider flex items-center justify-center focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                  >
                    Resume
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mobile-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between w-full h-full px-4 pointer-events-auto absolute inset-0"
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
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Navbar;

