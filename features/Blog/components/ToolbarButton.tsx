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
    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 font-mono text-2xs uppercase tracking-wider text-neutral-500 transition-colors hover:text-white aria-pressed:text-accent-brand"
  >
    {children}
  </button>
);

export default ToolbarButton;
