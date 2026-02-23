import React from 'react';
import { motion } from 'framer-motion';

export const blurVariants = {
  initial: {
    opacity: 0,
    filter: "blur(12px) brightness(1.5)",
  },
  enter: {
    opacity: 1,
    filter: "blur(0px) brightness(1)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    }
  },
  exit: {
    opacity: 0,
    filter: "blur(12px) brightness(1.5)",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    }
  }
};

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition = React.forwardRef<HTMLDivElement, PageTransitionProps>(
  ({ children }, ref) => {
    const rows = 6;

    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={blurVariants}
        className="h-full will-change-[filter,opacity]"
      >
        {children}
      </motion.div>
    );
  }
);

PageTransition.displayName = 'PageTransition';

export default PageTransition;