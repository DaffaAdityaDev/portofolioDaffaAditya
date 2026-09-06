import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

interface SectionNode {
  id: string;
  number: string;
  label: string;
}

const SECTIONS: SectionNode[] = [
  { id: 'experience-section', number: '01', label: 'EXPERIENCE' },
  { id: 'works', number: '02', label: 'PROJECTS' },
  { id: 'tech-stack', number: '03', label: 'TECH STACK' },
  { id: 'contact', number: '04', label: 'CONTACT' },
];

// GPU-accelerated animation variants (Zero layout shift, pure transform & opacity interpolation)
const labelVariants: Variants = {
  collapsed: {
    opacity: 0,
    x: 14,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const ArchitecturalSpine: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('experience-section');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const spineRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lineCoords, setLineCoords] = useState<{ x: number; positions: number[] }>({
    x: 8.5,
    positions: [14, 78, 142, 206],
  });

  const updateNodePositions = () => {
    if (!spineRef.current) return;
    const spineRect = spineRef.current.getBoundingClientRect();
    const positions: number[] = [];
    let xCoord = 8.5;

    nodeRefs.current.forEach((node, idx) => {
      if (node) {
        const rect = node.getBoundingClientRect();
        const centerY = rect.top - spineRect.top + rect.height / 2;
        positions[idx] = centerY;
        if (idx === 0) {
          xCoord = rect.left - spineRect.left + rect.width / 2;
        }
      }
    });

    if (positions.length === SECTIONS.length) {
      setLineCoords({ x: xCoord, positions });
    }
  };

  useEffect(() => {
    updateNodePositions();
    const timer = setTimeout(updateNodePositions, 100);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroThreshold = 350;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const footerThreshold = documentHeight - windowHeight - 400;

      setIsVisible(scrollY > heroThreshold && scrollY < footerThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateNodePositions);
    handleScroll();

    // Active section tracking via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0.1,
      }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateNodePositions);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const yOffset = -40;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const activeIndex = Math.max(0, SECTIONS.findIndex((s) => s.id === activeSection));
  const startY = lineCoords.positions[0] ?? 14;
  const currentTargetY = lineCoords.positions[activeIndex] ?? startY;
  const targetHeight = Math.max(0, currentTargetY - startY);
  const totalRailHeight = (lineCoords.positions[3] ?? 206) - startY;

  return (
    <motion.nav
      aria-label="Section Navigation Spine"
      initial="collapsed"
      animate={isHovered ? 'expanded' : 'collapsed'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: `translateY(-50%) translateX(${isVisible ? '0px' : '24px'})`,
      }}
      className="fixed right-4 xl:right-8 top-1/2 z-40 hidden lg:flex flex-col items-end select-none py-4 pl-12 transition-all duration-300"
    >
      {/* Title: Index with System Red Pulse Dot */}
      <div className="flex items-center gap-2 mb-4 pr-1 text-right font-mono">
        <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">
          INDEX
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      </div>

      <div ref={spineRef} className="relative flex flex-col justify-between h-[220px] pr-1">
        {/* Background Rail Line - Precisely anchored from Circle 01 to Circle 04 */}
        <div
          className="absolute w-px bg-zinc-800 -translate-x-1/2 pointer-events-none z-0"
          style={{
            left: lineCoords.x,
            top: startY,
            height: totalRailHeight,
          }}
        />

        {/* System Accent Traveling Beam - Stops PRECISELY at the active circle */}
        <motion.div
          className="absolute w-[2px] bg-gradient-to-b from-red-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.85)] rounded-full -translate-x-1/2 pointer-events-none z-0"
          style={{
            left: lineCoords.x,
            top: startY,
          }}
          animate={{ height: targetHeight }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 26,
          }}
        />

        {/* Section Milestones */}
        {SECTIONS.map((section, idx) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group/item relative flex items-center gap-2 text-right focus:outline-none cursor-pointer py-1.5 justify-end"
              aria-label={`Scroll to ${section.label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {/* Sliding Text Label */}
              <motion.span
                variants={labelVariants}
                className={`text-[10px] font-mono tracking-wider whitespace-nowrap pr-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 group-hover/item:text-white'
                }`}
              >
                {section.label}
              </motion.span>

              {/* Number */}
              <span
                className={`text-xs font-mono transition-colors duration-200 pr-1 ${
                  isActive
                    ? 'text-red-500 font-bold'
                    : 'text-zinc-600 group-hover/item:text-zinc-300'
                }`}
              >
                {section.number}
              </span>

              {/* Milestone Indicator Node (z-10 ensures clean circular cap over the beam) */}
              <div
                ref={(el) => {
                  nodeRefs.current[idx] = el;
                }}
                className={`relative w-[9px] h-[9px] rounded-full border transition-all duration-300 flex items-center justify-center shrink-0 z-10 ${
                  isActive
                    ? 'bg-[#0a0a0a] border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] scale-125'
                    : 'bg-[#0a0a0a] border-zinc-700 group-hover/item:border-red-500/60'
                }`}
              >
                <div
                  className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                    isActive ? 'bg-red-500' : 'bg-zinc-600 group-hover/item:bg-red-500'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default ArchitecturalSpine;
