import React, { useEffect, useRef } from 'react';

/**
 * CustomCursor - High-performance custom cursor with zero React state re-rendering.
 * Direct DOM updates via hardware-accelerated transform: translate3d eliminate
 * input lag and micro-stuttering on high-refresh-rate (60Hz–240Hz+) monitors.
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const ringVisualRef = useRef<HTMLDivElement | null>(null);
  const dotVisualRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only mount on desktop / fine pointer devices (mouse / trackpad)
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    let rafId: number | null = null;
    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isAbsorbed = false;
    let isClicking = false;

    // Direct DOM styling helper — 0 React re-renders during mouse interaction
    const updateVisualStates = () => {
      if (!ringVisualRef.current || !dotVisualRef.current) return;

      if (!isVisible) {
        ringVisualRef.current.style.opacity = '0';
        dotVisualRef.current.style.opacity = '0';
        return;
      }

      // Dot styles (5px crisp center core, inverts via mix-blend-difference)
      dotVisualRef.current.style.opacity = '1';
      dotVisualRef.current.style.transform = isClicking
        ? 'translate(-50%, -50%) scale(1.4)'
        : 'translate(-50%, -50%) scale(1)';

      // Outer Ring styles
      if (isAbsorbed) {
        // Snappy absorption into interactive elements
        ringVisualRef.current.style.opacity = '0';
        ringVisualRef.current.style.transform = 'translate(-50%, -50%) scale(0)';
      } else if (isClicking) {
        // Tactile compression feedback on click
        ringVisualRef.current.style.opacity = '1';
        ringVisualRef.current.style.transform = 'translate(-50%, -50%) scale(0.7)';
        ringVisualRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
        ringVisualRef.current.style.borderColor = '#ffffff';
      } else {
        // Default floating halo
        ringVisualRef.current.style.opacity = '1';
        ringVisualRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        ringVisualRef.current.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        ringVisualRef.current.style.borderColor = '#ffffff';
      }
    };

    // Smooth RAF physics interpolation for trailing ring
    const renderLoop = () => {
      // Lerp speed factor: 0.20 provides high tracking speed with smooth fluid detachment
      ringX += (targetX - ringX) * 0.2;
      ringY += (targetY - ringY) * 0.2;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = targetX;
        ringY = targetY;
        updateVisualStates();
      }

      // Hardware 1:1 instantaneous tracking for focal dot (0ms latency)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }

      // Universal Absorption Target Detection across all pages and components
      const target = e.target as HTMLElement | null;
      const interactive = target
        ? Boolean(
            target.closest(
              'button, [role="button"], a, input, textarea, select, [data-cursor], .cursor-pointer, [tabindex="0"], summary'
            )
          )
        : false;

      if (interactive !== isAbsorbed) {
        isAbsorbed = interactive;
        updateVisualStates();
      }
    };

    const handleMouseDown = () => {
      isClicking = true;
      updateVisualStates();
    };

    const handleMouseUp = () => {
      isClicking = false;
      updateVisualStates();
    };

    const handleMouseLeave = () => {
      isVisible = false;
      isAbsorbed = false;
      updateVisualStates();
    };

    const handleMouseEnter = () => {
      isVisible = true;
      updateVisualStates();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div className="pointer-events-none select-none">
      {/* Substantial Outer Ring (Smooth trailing physics, background-aware inversion) */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none select-none z-[99999] will-change-transform mix-blend-difference"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          ref={ringVisualRef}
          className="w-8 h-8 rounded-full border-2 border-white bg-white/5"
          style={{
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0,
            transition:
              'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
          }}
        />
      </div>

      {/* Solid Center Focal Dot (Instant 0ms hardware position, background-aware inversion) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none select-none z-[100000] will-change-transform mix-blend-difference"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          ref={dotVisualRef}
          className="w-[5px] h-[5px] rounded-full bg-white"
          style={{
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0,
            transition: 'transform 0.15s ease-out, opacity 0.15s ease',
          }}
        />
      </div>
    </div>
  );
};

export default CustomCursor;

