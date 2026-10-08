import React, { useEffect, useState } from 'react';
import { usePresence, useReducedMotion } from 'framer-motion';
import styles from './PageTransition.module.css';

const NUM_COLS = 10;
const NUM_ROWS = 7;

// Speed chosen by the owner: about 300 ms per phase (cover, then uncover), ~600 ms per navigation.
// Raise WAVE_STEP_MS and CELL_MS together to slow it down; PHASE_MS follows.
const CELL_MS = 160;
const WAVE_STEP_MS = 8;

// Deterministic diagonal wave with digital scatter, in ms
const getPixelDelay = (col: number, row: number): number => {
  const diagonal = (col + row) * WAVE_STEP_MS;
  const scatter = ((col * 3 + row * 7) % 5) * (WAVE_STEP_MS / 2);
  return diagonal + scatter;
};

// A phase ends when the last cell finishes: its delay plus one cell animation.
const PHASE_MS = CELL_MS + getPixelDelay(NUM_COLS - 1, NUM_ROWS - 1) + 4 * (WAVE_STEP_MS / 2);

const CELL_DELAYS = Array.from({ length: NUM_ROWS * NUM_COLS }, (_, index) =>
  getPixelDelay(index % NUM_COLS, Math.floor(index / NUM_COLS))
);

const GRID_STYLE = {
  '--cols': NUM_COLS,
  '--rows': NUM_ROWS,
  '--cell-ms': `${CELL_MS}ms`,
} as React.CSSProperties;

// Set when a page finishes covering the screen, so the next page knows to uncover it.
// Stays false on the first load, which therefore never plays the overlay.
let uncoverPending = false;

const PixelOverlay = ({ phase }: { phase: 'cover' | 'uncover' }) => (
  <div aria-hidden="true" className={`${styles.overlay} ${styles[phase]}`} style={GRID_STYLE}>
    {CELL_DELAYS.map((delay, index) => (
      <div key={index} className={styles.cell} style={{ '--i': delay } as React.CSSProperties} />
    ))}
  </div>
);

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Route transition for AnimatePresence (mode="wait"). The pixel grid is only in the DOM
 * while it plays: the leaving page covers the screen, then the entering page uncovers it.
 * Reduced motion skips both phases and swaps pages instantly.
 */
const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children }, ref) => {
    const [isPresent, safeToRemove] = usePresence();
    const prefersReducedMotion = useReducedMotion();
    const [isUncovering, setIsUncovering] = useState(() => uncoverPending);

    // Leaving: cover the old page, then let AnimatePresence mount the next one.
    useEffect(() => {
      if (isPresent) return;
      if (prefersReducedMotion) {
        safeToRemove();
        return;
      }
      const timeout = setTimeout(() => {
        uncoverPending = true;
        safeToRemove();
      }, PHASE_MS);
      return () => clearTimeout(timeout);
    }, [isPresent, safeToRemove, prefersReducedMotion]);

    // Entering: uncover, then drop the overlay from the DOM.
    useEffect(() => {
      uncoverPending = false;
      if (!isUncovering) return;
      const timeout = setTimeout(() => setIsUncovering(false), PHASE_MS);
      return () => clearTimeout(timeout);
    }, [isUncovering]);

    const phase = !isPresent ? 'cover' : isUncovering ? 'uncover' : null;

    return (
      <div ref={ref} className="relative w-full min-h-full">
        {phase && !prefersReducedMotion && <PixelOverlay phase={phase} />}
        {children}
      </div>
    );
  }
);

PageTransition.displayName = 'PageTransition';

export default PageTransition;
