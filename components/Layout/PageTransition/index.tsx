import React from 'react';
import { motion } from 'framer-motion';

const NUM_COLS = 10;
const NUM_ROWS = 7;

const COLS_ARRAY = Array.from({ length: NUM_COLS });
const ROWS_ARRAY = Array.from({ length: NUM_ROWS });

// Deterministic diagonal wave with digital scatter
const getPixelDelay = (col: number, row: number): number => {
  const diagonal = (col + row) * 0.024;
  const scatter = ((col * 3 + row * 7) % 5) * 0.012;
  return diagonal + scatter;
};

// High-Contrast Pixel Transition Variants (Scale + Opacity Bloom)
const pixelVariants = {
  initial: {
    scale: 1,
    opacity: 1,
  },
  enter: ({ col, row }: { col: number; row: number }) => ({
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.35,
      delay: getPixelDelay(col, row),
      ease: [0.76, 0, 0.24, 1] as const,
    },
  }),
  exit: ({ col, row }: { col: number; row: number }) => ({
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.35,
      delay: getPixelDelay(col, row),
      ease: [0.76, 0, 0.24, 1] as const,
    },
  }),
};

// Subtle content fade
const contentVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.15,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0.85,
    transition: {
      duration: 0.2,
    },
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children }, ref) => {
    return (
      <div ref={ref} className="relative w-full min-h-full">
        {/* High-Contrast Pixel Grid Page Transition Overlay */}
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[80] pointer-events-none flex w-screen h-screen overflow-hidden"
        >
          {COLS_ARRAY.map((_, col) => (
            <div key={col} className="flex-1 h-full flex flex-col">
              {ROWS_ARRAY.map((_, row) => (
                <motion.div
                  key={row}
                  custom={{ col, row }}
                  variants={pixelVariants}
                  initial="initial"
                  animate="enter"
                  exit="exit"
                  className="w-full flex-1 bg-[#18181c] border border-white/20 shadow-[inset_0_0_12px_rgba(255,255,255,0.03)] origin-center"
                />
              ))}
            </div>
          ))}
        </div>

        {/* Page Content */}
        <motion.div
          variants={contentVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </div>
    );
  }
);

PageTransition.displayName = 'PageTransition';

export default PageTransition;
