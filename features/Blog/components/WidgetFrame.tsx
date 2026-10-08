import React from 'react';
import type { WidgetFrameProps } from '@/types/blog';

/** Bordered panel with a mono header bar, shared by every interactive widget in a post. */
const WidgetFrame: React.FC<WidgetFrameProps> = ({ title, icon: Icon, ref, children }) => (
  <div ref={ref} className="my-8 border border-neutral-800 bg-[#0d0d0d]">
    <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/50 px-3 py-2 font-mono text-xs text-neutral-400">
      <Icon className="size-3.5 text-red-500" aria-hidden="true" />
      <span>{title}</span>
    </div>
    {children}
  </div>
);

export default WidgetFrame;
