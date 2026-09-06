import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/metadata.config';
import { SPRING_MOBILE_OS } from '@/constant/animations';

interface NavItem {
  label: string;
  id?: string;
  path?: string;
}

const navItems: NavItem[] = [
  { label: 'HOME', id: 'hero' },
  { label: 'BLOG', path: '/blog' },
  { label: 'SOCIALS' }
];

const socialLinks = [
  { label: 'GITHUB', href: siteConfig.links.github, Icon: Github, external: true, aria: 'GitHub Profile' },
  { label: 'LINKEDIN', href: siteConfig.links.linkedin, Icon: Linkedin, external: true, aria: 'LinkedIn Profile' },
  { label: 'EMAIL', href: `mailto:${siteConfig.links.email}`, Icon: Mail, aria: 'Send Email' }
];

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

  const checkActive = (item: NavItem) => {
    return (item.id === 'hero' && router.pathname === '/' && !router.asPath.includes('#')) ||
      (item.id && router.asPath.includes(`#${item.id}`)) ||
      (item.path && router.pathname.startsWith(item.path));
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.id && router.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(item.id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      router.push(`/#${item.id}`, undefined, { scroll: false });
    }
  };

  const isExpanded = !isScrolled || isHovered;

  const transitionClass = shouldReduceMotion
    ? ''
    : 'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]';

  const activeIndex = navItems.findIndex(checkActive);
  const currentPillIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      <div className="fixed top-8 left-0 w-full hidden md:flex justify-center items-center z-[100] pointer-events-none h-0">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setHoveredIndex(null); }}
          className={`pointer-events-auto relative flex items-center justify-center rounded-full group ${transitionClass} ${isExpanded ? 'h-[52px] px-6 gap-5' : 'h-11 px-4 gap-3'
            } ${isSocialOpen ? 'overflow-visible' : 'overflow-hidden'}`}
        >
          {/* Multi-layered Obsidian Glassmorphic Shell */}
          <div className="absolute inset-0 bg-[#08080a]/90 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_45px_rgba(0,0,0,0.85),_inset_0_1px_0_rgba(255,255,255,0.15),_inset_0_-1px_0_rgba(0,0,0,0.5)] group-hover:shadow-[0_24px_55px_rgba(0,0,0,0.95),_0_0_20px_rgba(255,255,255,0.03),_inset_0_1px_0_rgba(255,255,255,0.22)] rounded-full -z-10 pointer-events-none transition-all duration-300" />

          <div
            className={`flex items-center justify-center whitespace-nowrap pointer-events-auto ${transitionClass} ${isExpanded ? 'gap-5' : 'gap-3'
              }`}
          >
            {/* Logo & Brand Identity */}
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
              <span className="relative flex items-center h-6">
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
                  className={`text-[8.5px] font-mono font-medium text-neutral-400 tracking-[0.1em] transition-colors duration-200 group-hover/logo:text-neutral-300 whitespace-nowrap overflow-hidden flex items-center ${transitionClass} ${isExpanded ? 'max-w-[260px] opacity-100 ml-1.5' : 'max-w-0 opacity-0 ml-0'
                    }`}
                >
                  // PORTFOLIO
                  <span className="inline-flex items-center gap-1.5 pl-2 ml-1.5 border-l border-white/[0.1]">
                    <span className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400/50" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)]" />
                    </span>
                    <span className="text-[8px] font-mono text-emerald-400 font-bold tracking-wider">
                      AVAILABLE
                    </span>
                  </span>
                </span>
              </span>
            </Link>

            {/* Divider 1 */}
            <span
              className={`h-4 bg-white/[0.1] shrink-0 ${transitionClass} ${isExpanded ? 'w-px opacity-100' : 'w-0 opacity-0 pointer-events-none overflow-hidden'
                }`}
              aria-hidden="true"
            />

            {/* Middle Section (Nav Menu with Unified Sliding Glass Pill) - Hidden on scroll */}
            <nav
              className={`flex items-center gap-1 relative px-1 py-0.5 whitespace-nowrap ${transitionClass} ${isExpanded
                  ? 'max-w-[380px] opacity-100 pointer-events-auto'
                  : 'max-w-0 opacity-0 pointer-events-none overflow-hidden'
                } ${isSocialOpen ? 'overflow-visible' : 'overflow-hidden'}`}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label="Desktop navigation"
            >
              {navItems.map((item, index) => {
                const isActive = checkActive(item);
                const isPillActive = currentPillIndex === index;

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
                        className={`relative px-3.5 py-1.5 text-[10px] font-bold font-mono tracking-[0.15em] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none rounded-full ${isSocialOpen || isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                          } cursor-pointer`}
                      >
                        {isPillActive && (
                          <motion.span
                            layoutId="nav-glass-pill"
                            className="absolute inset-0 bg-white/[0.08] border border-white/[0.12] rounded-full -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.3)]"
                            transition={{ type: "spring", stiffness: 420, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </button>
                      <AnimatePresence>
                        {isSocialOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                            className="absolute top-[40px] left-1/2 -translate-x-1/2 bg-[#08080a]/95 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_24px_48px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.15)] p-2.5 flex flex-col gap-1 min-w-[145px] z-50 pointer-events-auto before:content-[''] before:absolute before:-top-5 before:left-0 before:w-full before:h-5 before:bg-transparent"
                          >
                            {socialLinks.map(({ label, href, Icon, external }) => (
                              <a
                                key={label}
                                href={href}
                                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-all duration-150 text-[10px] font-mono font-bold tracking-wider"
                              >
                                <Icon size={13} className="shrink-0 text-neutral-300" />
                                <span>{label}</span>
                              </a>
                            ))}
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
                    data-cursor="merge"
                    className={`relative px-3.5 py-1.5 text-[10px] font-bold font-mono tracking-[0.15em] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none rounded-full ${isActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                  >
                    {isPillActive && (
                      <motion.span
                        layoutId="nav-glass-pill"
                        className="absolute inset-0 bg-white/[0.08] border border-white/[0.12] rounded-full -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.3)]"
                        transition={{ type: "spring", stiffness: 420, damping: 30 }}
                      />
                    )}
                    {isActive && (
                      <motion.span
                        layoutId="active-dot-glow"
                        className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Status Pill (Visible ONLY when collapsed on scroll) */}
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.1)] overflow-hidden whitespace-nowrap shrink-0 ${transitionClass} ${!isExpanded ? 'max-w-[160px] opacity-100 pointer-events-auto' : 'max-w-0 opacity-0 pointer-events-none'
                }`}
            >
              <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                <span className="absolute w-2 h-2 rounded-full bg-emerald-500/40 animate-ping" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)]" />
              </div>
              <span className="text-[8px] font-bold font-mono text-emerald-400 tracking-[0.2em] uppercase">
                AVAILABLE
              </span>
            </div>

            {/* Right Section (Resume Button - Visible when expanded) */}
            <div
              className={`flex items-center overflow-hidden whitespace-nowrap ${transitionClass} ${isExpanded ? 'max-w-[160px] opacity-100 pointer-events-auto gap-4' : 'max-w-0 opacity-0 pointer-events-none gap-0'
                }`}
            >
              <span className="h-4 w-px bg-white/[0.1] shrink-0" aria-hidden="true" />
              <Link
                href="/resume"
                data-cursor="merge"
                className="group/resume relative px-4 py-1.5 overflow-hidden bg-white text-black font-extrabold font-mono text-[9px] rounded-full uppercase tracking-[0.18em] shadow-[0_8px_20px_-4px_rgba(255,255,255,0.3)] hover:shadow-[0_10px_25px_-2px_rgba(255,255,255,0.5)] hover:scale-[1.03] active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                {/* Micro Light Sweep Shimmer on Hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/resume:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                <span className="relative z-10">Resume</span>
                <ArrowUpRight size={11} className="relative z-10 transition-transform duration-200 group-hover/resume:translate-x-0.5 group-hover/resume:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE NAVBAR ================= */}
      <div className="fixed top-6 left-0 w-full md:hidden flex justify-center items-start z-[100] pointer-events-none h-0 px-4">
        <motion.div
          layout
          transition={shouldReduceMotion ? { duration: 0.2 } : SPRING_MOBILE_OS}
          className={`pointer-events-auto overflow-hidden relative flex flex-col justify-start items-center group ${isMobileMenuOpen
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
                  {socialLinks.map(({ label, href, Icon, external, aria }) => (
                    <a
                      key={label}
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-neutral-400 hover:text-white transition-colors duration-200 p-1 rounded focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none"
                      aria-label={aria}
                    >
                      <Icon size={16} />
                    </a>
                  ))}
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
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
export { Navbar as NavbarComponent };
