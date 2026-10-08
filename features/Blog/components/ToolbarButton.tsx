import React from 'react';
import type { ToolbarButtonProps } from '@/types/blog';

/** Small mono button for the header bars of CodeBlock and ReactPlayground. */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({ label, onClick, pressed, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-pressed={pressed}
    title={label}
    className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-neutral-500 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-red-500 aria-pressed:text-red-500"
  >
    {children}
  </button>
);

export default ToolbarButton;
