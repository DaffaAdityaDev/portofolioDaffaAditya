import React from 'react';
import { ArrowRight } from 'lucide-react';

/** Corner brackets, like a viewfinder. Decorative. */
export const CornerBrackets: React.FC<{ className?: string }> = ({ className = 'border-white/30' }) => (
  <span aria-hidden="true" className="pointer-events-none absolute inset-3 z-10">
    <span className={`absolute left-0 top-0 h-2.5 w-2.5 border-l border-t ${className}`} />
    <span className={`absolute right-0 top-0 h-2.5 w-2.5 border-r border-t ${className}`} />
    <span className={`absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l ${className}`} />
    <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r ${className}`} />
  </span>
);

/** Square arrow button drawn inside a link. Decorative: the link carries the meaning. */
export const ArrowSquare: React.FC<{ size?: 'md' | 'lg' }> = ({ size = 'md' }) => (
  <span
    aria-hidden="true"
    className={`flex shrink-0 items-center justify-center rounded-lg border border-border-strong bg-surface-1/60 text-neutral-100 transition-[background-color,border-color,color,transform] duration-200 ease-out-expo group-hover:border-[var(--cs-accent)] group-hover:bg-[var(--cs-accent)] group-hover:text-background group-focus-within:border-[var(--cs-accent)] group-focus-within:bg-[var(--cs-accent)] group-focus-within:text-background motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-within:translate-x-0.5 ${
      size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'
    }`}
  >
    <ArrowRight size={size === 'lg' ? 22 : 18} strokeWidth={1.75} />
  </span>
);
