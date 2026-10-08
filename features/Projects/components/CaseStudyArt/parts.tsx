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
    className={`flex shrink-0 items-center justify-center border border-white/20 bg-[rgba(6,6,8,0.6)] text-zinc-100 transition-[background-color,border-color,color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-[var(--cs-accent)] group-hover:bg-[var(--cs-accent)] group-hover:text-[#0a0a0a] group-focus-within:border-[var(--cs-accent)] group-focus-within:bg-[var(--cs-accent)] group-focus-within:text-[#0a0a0a] motion-safe:group-hover:translate-x-0.5 motion-safe:group-focus-within:translate-x-0.5 ${
      size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'
    }`}
  >
    <ArrowRight size={size === 'lg' ? 22 : 18} strokeWidth={1.75} />
  </span>
);
