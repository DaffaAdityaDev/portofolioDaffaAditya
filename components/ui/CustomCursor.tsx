import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isAbsorbed, setIsAbsorbed] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const prevAbsorbedRef = useRef(false);

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics: responsive tracking with elastic detachment
  const springConfig = { stiffness: 480, damping: 26, mass: 0.35 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      const target = e.target as HTMLElement | null;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mouseX.set(clientX);
        mouseY.set(clientY);
        if (!hasMoved) setHasMoved(true);
        if (!isVisible) setIsVisible(true);

        if (!target) {
          setIsAbsorbed(false);
          return;
        }

        // Universal Absorption Target Detection across all pages and components
        const interactiveElement = target.closest<HTMLElement>(
          'button, [role="button"], a, input, textarea, select, [data-cursor], .cursor-pointer, [tabindex="0"], summary'
        );

        const shouldAbsorb = Boolean(interactiveElement);
        if (shouldAbsorb !== prevAbsorbedRef.current) {
          prevAbsorbedRef.current = shouldAbsorb;
          setIsAbsorbed(shouldAbsorb);
        }
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsAbsorbed(false);
      prevAbsorbedRef.current = false;
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, hasMoved]);

  if (!hasMoved) return null;

  return (
    <>
      {/* Substantial Outer Ring (Bold 2px border, clean contrast) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none select-none z-[99999] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          x: smoothX,
          y: smoothY,
        }}
        animate={{
          width: 32,
          height: 32,
          scale: !isVisible ? 0 : isAbsorbed ? 0 : isClicking ? 0.7 : 1,
          opacity: !isVisible ? 0 : isAbsorbed ? 0 : isClicking ? 1 : 0.85,
          backgroundColor: isClicking ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.9)',
          borderWidth: '2px',
          boxShadow: isClicking
            ? '0 0 16px rgba(255, 255, 255, 0.45)'
            : '0 0 10px rgba(255, 255, 255, 0.2), inset 0 0 6px rgba(255, 255, 255, 0.1)',
        }}
        transition={{
          type: 'spring',
          stiffness: isAbsorbed ? 550 : 380, // Snappy entry absorption
          damping: isAbsorbed ? 30 : 20,      // Elastic overshoot bounce on exit ("when leave it leave")
          mass: 0.35,
        }}
      />

      {/* Solid Center Focal Dot (Crisp 5px core) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none select-none z-[100000] rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          x: mouseX,
          y: mouseY,
        }}
        animate={{
          width: 5,
          height: 5,
          scale: !isVisible ? 0 : isClicking ? 1.4 : 1,
          opacity: !isVisible ? 0 : 1,
          backgroundColor: '#ffffff',
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
        }}
        transition={{
          type: 'spring',
          stiffness: 600,
          damping: 30,
        }}
      />
    </>
  );
};

export default CustomCursor;
