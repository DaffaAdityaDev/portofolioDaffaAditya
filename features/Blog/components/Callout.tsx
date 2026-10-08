import React from 'react';
import { Info, Lightbulb, TriangleAlert } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CalloutProps, CalloutVariant } from '@/types/blog';

const VARIANTS: Record<CalloutVariant, { icon: typeof Info; label: string; accent: string }> = {
  note: { icon: Info, label: 'Note', accent: 'border-l-sky-400 text-sky-400' },
  tip: { icon: Lightbulb, label: 'Tip', accent: 'border-l-emerald-400 text-emerald-400' },
  warning: { icon: TriangleAlert, label: 'Watch out', accent: 'border-l-amber-400 text-amber-400' },
};

/** Highlighted aside. Pass inline content, not <p>, so it keeps its own spacing. */
const Callout: React.FC<CalloutProps> = ({ variant = 'note', title, children }) => {
  const { icon: Icon, label, accent } = VARIANTS[variant];

  return (
    <aside className={cn('my-8 border border-l-2 border-neutral-800 bg-[#0d0d0d] p-4', accent)}>
      <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
        <Icon className="size-3.5" aria-hidden="true" />
        <span>{title ?? label}</span>
      </div>
      <div className="text-sm leading-relaxed text-neutral-300">{children}</div>
    </aside>
  );
};

export default Callout;
