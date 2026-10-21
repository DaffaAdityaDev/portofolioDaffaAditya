import React, { useState, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { m, AnimatePresence } from 'framer-motion';
import { Menu, Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/config/metadata.config';
import { EASE_OUT_EXPO } from '@/constant/animations';
import { buttonClasses } from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import type { NavItem, SocialLink } from '@/types/navigation';
import { replaceUrl } from '@/utils/url';

// The open mobile sheet only loads when needed; the trigger warms it on pointerdown/focus.
const loadMobileMenu = () => import('./MobileMenu');
const MobileMenu = dynamic(loadMobileMenu, { ssr: false });

const navItems: NavItem[] = [
  { label: 'HOME', id: 'hero' },
  { label: 'CASE STUDIES', path: '/case-studies' },
  { label: 'FREELANCE', path: '/freelance' },
  { label: 'BLOG', path: '/blog' },
  { label: 'SOCIALS' }
];

const socialLinks: SocialLink[] = [
  { label: 'GITHUB', href: siteConfig.links.github, Icon: Github, external: true, aria: 'GitHub Profile' },
  { label: 'LINKEDIN', href: siteConfig.links.linkedin, Icon: Linkedin, external: true, aria: 'LinkedIn Profile' },
  { label: 'EMAIL', href: `mailto:${siteConfig.links.email}`, Icon: Mail, aria: 'Send Email' }
];

const mobileNavItems = navItems.filter((item) => item.label !== 'SOCIALS');

const SCROLLED_THRESHOLD = 50;
const MOBILE_MENU_ID = 'mobile-nav-menu';
const SOCIAL_MENU_ID = 'desktop-socials-menu';

// Read through useSyncExternalStore: React re-renders only when the boolean flips, and the
// server snapshot (not scrolled) keeps the first client render identical to the SSR HTML.
const subscribeScroll = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
};
const getScrolledSnapshot = () => window.scrollY > SCROLLED_THRESHOLD;
const getScrolledServerSnapshot = () => false;

/** Box of a desktop nav item, relative to the <nav>. */
interface ItemRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const PILL_CLASSES = 'bg-white/[0.08] border border-white/[0.12] rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_2px_8px_rgba(0,0,0,0.3)]';
const DOT_CLASSES = 'w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]';
const DOT_SIZE = 4;
// Gap between the dot and the item's bottom edge (bottom-0.5).
const DOT_INSET = 2;
// Expand/collapse and pill-slide timings; reduced motion drops the transition (static classes, so SSR-safe).
const EXPAND_TRANSITION = 'motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out-expo';
const SLIDE_TIMING = 'motion-safe:duration-300 motion-safe:ease-out-expo';

// Read at click time, so no render ever branches on it.
const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

const sameRects = (a: ItemRect[] | null, b: ItemRect[]) =>
  !!a && a.length === b.length && a.every((r, i) =>
    r.left === b[i].left && r.top === b[i].top && r.width === b[i].width && r.height === b[i].height);

const Navbar = () => {
  const router = useRouter();
  const isScrolled = useSyncExternalStore(subscribeScroll, getScrolledSnapshot, getScrolledServerSnapshot);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  // Hash set by in-page navigation, which bypasses the router (so asPath goes stale).
  const [inPageHash, setInPageHash] = useState<string | null>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const socialButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  // Null until measured on the client; until then the pill and dot render statically inside their item.
  const [itemRects, setItemRects] = useState<ItemRect[] | null>(null);

  /**
   * The hover pill and active dot are single elements slid with a CSS transform to the measured item,
   * not framer `layoutId`s: layout animations need domMax, and the navbar is on every route.
   * Items are re-measured when one or the nav resizes (font swap, the nav becoming visible at md, items shifting);
   * the observer's initial callback does the first measure.
   */
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => {
      const navBox = nav.getBoundingClientRect();
      const next = itemRefs.current.map((el) => {
        const box = el?.getBoundingClientRect();
        return box
          ? { left: box.left - navBox.left, top: box.top - navBox.top, width: box.width, height: box.height }
          : { left: 0, top: 0, width: 0, height: 0 };
      });
      setItemRects((prev) => (sameRects(prev, next) ? prev : next));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // While the socials menu is open: a click outside or Escape closes it (Escape returns focus to its button).
  useEffect(() => {
    if (!isSocialOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!socialRef.current?.contains(e.target as Node)) setIsSocialOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsSocialOpen(false);
      socialButtonRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isSocialOpen]);

  useEffect(() => {
    const resetHash = () => setInPageHash(null);
    router.events.on('routeChangeComplete', resetHash);
    router.events.on('hashChangeComplete', resetHash);
    return () => {
      router.events.off('routeChangeComplete', resetHash);
      router.events.off('hashChangeComplete', resetHash);
    };
  }, [router.events]);

  const currentPath = inPageHash !== null && router.pathname === '/' ? `/${inPageHash}` : router.asPath;

  const checkActive = (item: NavItem): boolean => {
    return (item.id === 'hero' && router.pathname === '/' && !currentPath.includes('#')) ||
      (!!item.id && currentPath.includes(`#${item.id}`)) ||
      (!!item.path && router.pathname.startsWith(item.path));
  };

  /**
   * Same-page jumps only scroll and rewrite the URL. Going through router.push would
   * change asPath and remount the whole home page behind the page transition.
   * Next's history state is kept so back/forward still work.
   */
  const replaceInPageUrl = (hash: string) => {
    const url = `/${hash}`;
    replaceUrl(url);
    setInPageHash(hash);
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (item.id && router.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(item.id);
      if (element) element.scrollIntoView({ behavior: scrollBehavior() });
      replaceInPageUrl(`#${item.id}`);
    }
  };

  const isExpanded = !isScrolled || isHovered;

  const activeIndex = navItems.findIndex(checkActive);
  const currentPillIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const pillRect = itemRects && currentPillIndex >= 0 ? itemRects[currentPillIndex] : null;
  const dotRect = itemRects && activeIndex >= 0 ? itemRects[activeIndex] : null;

  return (
    <>
      {/* ================= DESKTOP NAVBAR ================= */}
      <div className="fixed top-8 left-0 w-full hidden md:flex justify-center items-center z-[100] pointer-events-none h-0">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setHoveredIndex(null); }}
          className={`pointer-events-auto relative flex items-center justify-center rounded-full group ${EXPAND_TRANSITION} ${isExpanded ? 'h-[52px] px-6 gap-5' : 'h-11 px-4 gap-3'
            } ${isSocialOpen ? 'overflow-visible' : 'overflow-hidden'}`}
        >
          {/* Multi-layered Obsidian Glassmorphic Shell */}
          <div className="absolute inset-0 bg-surface-2/90 backdrop-blur-md border border-border shadow-[0_20px_45px_rgba(0,0,0,0.85),_inset_0_1px_0_rgba(255,255,255,0.15),_inset_0_-1px_0_rgba(0,0,0,0.5)] group-hover:shadow-[0_24px_55px_rgba(0,0,0,0.95),_0_0_20px_rgba(255,255,255,0.03),_inset_0_1px_0_rgba(255,255,255,0.22)] rounded-full -z-10 pointer-events-none transition-all duration-300" />

          <div
            className={`flex items-center justify-center whitespace-nowrap pointer-events-auto ${EXPAND_TRANSITION} ${isExpanded ? 'gap-5' : 'gap-3'
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
                  window.scrollTo({ top: 0, behavior: scrollBehavior() });
                  replaceInPageUrl('');
                }
              }}
              className="group/logo font-sans font-black text-xs tracking-[0.2em] text-white transition-colors duration-200 uppercase rounded-lg px-1.5 py-0.5 flex items-center gap-1.5"
            >
              <span className="relative flex items-center h-6">
                <span>D</span>
                <span
                  className={`${EXPAND_TRANSITION} overflow-hidden flex items-center whitespace-nowrap ${isExpanded ? 'max-w-[200px] opacity-100 ml-0' : 'max-w-0 opacity-0 ml-0'
                    }`}
                >
                  AFFA ADITYA
                </span>
                <span
                  className={`${EXPAND_TRANSITION} overflow-hidden flex items-center whitespace-nowrap ${!isExpanded ? 'max-w-[20px] opacity-100 ml-0.5' : 'max-w-0 opacity-0 ml-0'
                    }`}
                >
                  A
                </span>
                <span
                  className={`text-2xs font-mono font-medium text-muted-foreground tracking-[0.1em] transition-colors duration-200 group-hover/logo:text-neutral-300 whitespace-nowrap flex items-center h-6 ${EXPAND_TRANSITION} ${isExpanded ? 'max-w-[280px] opacity-100 ml-1.5 overflow-visible' : 'max-w-0 opacity-0 ml-0 overflow-hidden'
                    }`}
                >
                  <span>{'// PORTFOLIO'}</span>
                  <StatusBadge pulse label="Available" className="ml-2.5 font-bold" />
                </span>
              </span>
            </Link>

            {/* Divider 1 */}
            <span
              className={`h-4 bg-border shrink-0 ${EXPAND_TRANSITION} ${isExpanded ? 'w-px opacity-100' : 'w-0 opacity-0 pointer-events-none overflow-hidden'
                }`}
              aria-hidden="true"
            />

            {/* Middle Section (Nav Menu with Unified Sliding Glass Pill) - Hidden on scroll */}
            <nav
              ref={navRef}
              className={`flex items-center gap-1 relative px-1 py-0.5 whitespace-nowrap ${EXPAND_TRANSITION} ${isExpanded
                  ? 'max-w-[600px] opacity-100 pointer-events-auto'
                  : 'max-w-0 opacity-0 pointer-events-none overflow-hidden'
                } ${isSocialOpen ? 'overflow-visible' : 'overflow-hidden'}`}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label="Desktop navigation"
            >
              {pillRect && (
                <span
                  aria-hidden="true"
                  className={`absolute top-0 left-0 pointer-events-none motion-safe:transition-[transform,width,height] ${SLIDE_TIMING} ${PILL_CLASSES}`}
                  style={{
                    transform: `translate(${pillRect.left}px, ${pillRect.top}px)`,
                    width: pillRect.width,
                    height: pillRect.height,
                  }}
                />
              )}
              {dotRect && (
                <span
                  aria-hidden="true"
                  className={`absolute top-0 left-0 z-10 pointer-events-none motion-safe:transition-transform ${SLIDE_TIMING} ${DOT_CLASSES}`}
                  style={{
                    transform: `translate(${dotRect.left + (dotRect.width - DOT_SIZE) / 2}px, ${dotRect.top + dotRect.height - DOT_INSET - DOT_SIZE}px)`,
                  }}
                />
              )}
              {navItems.map((item, index) => {
                const isActive = checkActive(item);
                const isPillActive = currentPillIndex === index;

                if (item.label === 'SOCIALS') {
                  return (
                    <div
                      key={item.label}
                      ref={socialRef}
                      className="relative h-full flex items-center"
                      onMouseEnter={() => {
                        setHoveredIndex(index);
                        setIsSocialOpen(true);
                      }}
                      onMouseLeave={() => {
                        setIsSocialOpen(false);
                      }}
                      // Tabbing out of the button and its links closes the menu.
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsSocialOpen(false);
                      }}
                    >
                      <button
                        ref={(el) => {
                          socialButtonRef.current = el;
                          itemRefs.current[index] = el;
                        }}
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={isSocialOpen}
                        aria-controls={SOCIAL_MENU_ID}
                        onClick={() => setIsSocialOpen((open) => !open)}
                        className={`relative px-3.5 py-1.5 text-2xs font-bold font-mono tracking-[0.15em] transition-colors duration-200 focus-inset rounded-full ${isSocialOpen || isActive ? 'text-white' : 'text-muted-foreground hover:text-white'
                          } cursor-pointer`}
                      >
                        {!itemRects && isPillActive && (
                          <span aria-hidden="true" className={`absolute inset-0 -z-10 ${PILL_CLASSES}`} />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </button>
                      <AnimatePresence>
                        {isSocialOpen && (
                          <m.div
                            id={SOCIAL_MENU_ID}
                            role="menu"
                            aria-label="Social links"
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.16, ease: EASE_OUT_EXPO }}
                            className="absolute top-[40px] left-1/2 -translate-x-1/2 bg-surface-2/95 backdrop-blur-2xl border border-border rounded-lg shadow-[0_24px_48px_rgba(0,0,0,0.8),_inset_0_1px_0_rgba(255,255,255,0.15)] p-2.5 flex flex-col gap-1 min-w-[145px] z-50 pointer-events-auto before:content-[''] before:absolute before:-top-5 before:left-0 before:w-full before:h-5 before:bg-transparent"
                          >
                            {socialLinks.map(({ label, href, Icon, external }) => (
                              <a
                                key={label}
                                href={href}
                                role="menuitem"
                                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:text-white hover:bg-white/[0.08] transition-all duration-150 text-2xs font-mono font-bold tracking-wider"
                              >
                                {Icon && <Icon size={13} className="shrink-0 text-neutral-300" />}
                                <span>{label}</span>
                              </a>
                            ))}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.label}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    href={item.path || `/#${item.id}`}
                    onClick={(e) => handleNavigation(e, item)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    data-cursor="merge"
                    className={`relative px-3.5 py-1.5 text-2xs font-bold font-mono tracking-[0.15em] transition-colors duration-200 focus-inset rounded-full ${isActive ? 'text-white' : 'text-muted-foreground hover:text-white'
                      }`}
                  >
                    {!itemRects && isPillActive && (
                      <span aria-hidden="true" className={`absolute inset-0 -z-10 ${PILL_CLASSES}`} />
                    )}
                    {!itemRects && isActive && (
                      <span aria-hidden="true" className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 ${DOT_CLASSES}`} />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Status Pill (Visible ONLY when collapsed on scroll) */}
            <StatusBadge
              pulse
              boxed
              label="Available"
              className={`${EXPAND_TRANSITION} ${!isExpanded ? 'max-w-[160px] opacity-100 pointer-events-auto overflow-visible' : 'max-w-0 opacity-0 pointer-events-none overflow-hidden'
                }`}
            />

            {/* Right Section (Resume Button - Visible when expanded) */}
            <div
              className={`flex items-center overflow-hidden whitespace-nowrap ${EXPAND_TRANSITION} ${isExpanded ? 'max-w-[160px] opacity-100 pointer-events-auto gap-4' : 'max-w-0 opacity-0 pointer-events-none gap-0'
                }`}
            >
              <span className="h-4 w-px bg-border shrink-0" aria-hidden="true" />
              <Link
                href="/resume"
                data-cursor="merge"
                className={buttonClasses({
                  variant: 'primary',
                  size: 'sm',
                  className:
                    'group/resume relative h-8 overflow-hidden gap-1 shrink-0 shadow-[0_8px_20px_-4px_rgba(255,255,255,0.3)] focus-inset',
                })}
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
        {/* The size morph is a CSS transition, not a framer layout animation (that needs domMax). The closed radius
            is half the 44px height rather than rounded-full, so it interpolates smoothly to the open corners. */}
        <div
          className={`pointer-events-auto overflow-hidden relative flex flex-col justify-start items-center group motion-safe:transition-[max-width,height,border-radius] motion-safe:duration-500 motion-safe:ease-out-expo ${isMobileMenuOpen
            ? 'w-[calc(100vw-2rem)] max-w-[384px] h-[400px] rounded-lg'
            : 'w-[calc(100vw-2rem)] max-w-[320px] h-[44px] rounded-[22px]'
            }`}
        >
          {/* Background Layer with heavy filters */}
          <div className="absolute inset-0 bg-surface-2/90 backdrop-blur-md border border-border shadow-[0_24px_50px_rgba(0,0,0,0.8)] -z-10 rounded-[inherit] pointer-events-none" />

          <AnimatePresence initial={false}>
            {isMobileMenuOpen ? (
              <MobileMenu
                key="mobile-expanded"
                id={MOBILE_MENU_ID}
                navItems={mobileNavItems}
                socialLinks={socialLinks}
                isActive={checkActive}
                onNavigate={handleNavigation}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            ) : (
              <m.button
                key="mobile-collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                onPointerEnter={() => void loadMobileMenu()}
                onPointerDown={() => void loadMobileMenu()}
                onFocus={() => void loadMobileMenu()}
                aria-label="Open navigation menu"
                aria-expanded={false}
                aria-controls={MOBILE_MENU_ID}
                className="flex items-center justify-between w-full h-full px-3.5 pointer-events-auto absolute inset-0 cursor-pointer select-none active:scale-[0.98] transition-transform rounded-[inherit] text-left focus-inset"
              >
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="font-sans font-black text-xs tracking-[0.2em] text-white uppercase rounded-lg px-1 py-0.5">
                    DA
                  </span>
                  <span className="text-2xs font-mono text-muted-foreground font-medium tracking-wider">
                    {'// PORTFOLIO'}
                  </span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  <StatusBadge pulse boxed label="Available" />
                  <span className="text-muted-foreground group-hover:text-white rounded-lg p-0.5 transition-colors duration-200">
                    <Menu size={15} />
                  </span>
                </span>
              </m.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Navbar;
