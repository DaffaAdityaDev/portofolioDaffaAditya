import React from 'react';
import { cn } from '@/utils/cn';

interface CaseStudyTab {
  id: string;
  label: string;
  count: number;
}

interface CaseStudyTabsProps {
  tabs: CaseStudyTab[];
  activeId: string;
  onChange: (id: string) => void;
}

export const CASE_STUDY_PANEL_ID = 'cs-index-panel';
export const tabDomId = (id: string) => `cs-tab-${id}`;

/**
 * Compact segmented tab control, each tab sized to its label. Roving tabindex: one tab stop, arrows/Home/End move
 * between tabs and select them (automatic activation; switching is instant, nothing to load).
 */
const CaseStudyTabs: React.FC<CaseStudyTabsProps> = ({ tabs, activeId, onChange }) => {
  const activeIndex = tabs.findIndex((t) => t.id === activeId);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (!(e.key in moves)) return;
    e.preventDefault();
    const { id } = tabs[(moves[e.key] + tabs.length) % tabs.length];
    onChange(id);
    document.getElementById(tabDomId(id))?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Filter case studies"
      onKeyDown={onKeyDown}
      className="inline-flex max-w-full gap-0.5 rounded-md border border-border bg-surface-1 p-0.5"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={tabDomId(tab.id)}
            aria-selected={active}
            aria-controls={CASE_STUDY_PANEL_ID}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              'focus-inset flex min-h-8 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded border px-3 font-mono text-2xs uppercase tracking-widest transition-colors duration-200',
              active
                ? 'border-border-strong bg-neutral-800 text-white'
                : 'border-transparent text-muted-foreground hover:text-neutral-200',
            )}
          >
            {tab.label}
            <span className={cn('tabular-nums', active ? 'text-neutral-300' : 'text-neutral-600')}>{tab.count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CaseStudyTabs;
