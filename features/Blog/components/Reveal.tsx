import React from 'react';
import { cn } from '@/utils/cn';
import type { RevealProps } from '@/types/blog';

/**
 * Fades a block in as it scrolls into view. CSS only (`.reveal` in globals.css): the static
 * HTML is fully visible, and the scroll-driven fade applies only in browsers that support
 * `animation-timeline: view()` and for readers who have not asked for reduced motion.
 */
const Reveal: React.FC<RevealProps> = ({ children, className }) => (
  <div className={cn('reveal', className)}>{children}</div>
);

export default Reveal;
