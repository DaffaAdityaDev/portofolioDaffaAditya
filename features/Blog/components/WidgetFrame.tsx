import React from 'react';
import type { WidgetFrameProps } from '@/types/blog';

/** Bordered panel with a mono header bar, shared by every interactive widget in a post. */
const WidgetFrame: React.FC<WidgetFrameProps> = ({ title, icon: Icon, ref, children }) => (
  <div ref={ref} className="my-8 rounded-lg border border-border bg-surface-1">
    <div className="flex items-center gap-2 rounded-t-lg border-b border-border bg-neutral-900/50 px-3 py-2 font-mono text-xs text-muted-foreground">
      <Icon className="size-3.5 text-accent-brand" aria-hidden="true" />
      <span>{title}</span>
    </div>
    {children}
  </div>
);

export default WidgetFrame;
