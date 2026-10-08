import React, { useRef } from 'react';
import { cn } from '@/utils/cn';
import type { PlaygroundFileTabsProps } from '@/types/blog';
import { fileLabel } from '../../utils/playground';

const NEXT_KEYS: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };

export const tabId = (panelId: string, index: number) => `${panelId}-tab-${index}`;

/** One tab per file. Arrow keys move between tabs, as in any ARIA tablist. */
const PlaygroundFileTabs: React.FC<PlaygroundFileTabsProps> = ({ paths, activePath, onSelect, panelId }) => {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = NEXT_KEYS[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (index + step + paths.length) % paths.length;
    onSelect(paths[next]);
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Files"
      className="flex shrink-0 overflow-x-auto border-b border-neutral-800 bg-neutral-900/50 font-mono text-xs"
    >
      {paths.map((path, index) => {
        const isActive = path === activePath;
        return (
          <button
            key={path}
            id={tabId(panelId, index)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(path)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              'shrink-0 cursor-pointer border-b-2 px-3 py-2 transition-colors',
              'focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-red-500',
              isActive ? 'border-red-500 text-neutral-100' : 'border-transparent text-neutral-500 hover:text-neutral-200',
            )}
          >
            {fileLabel(path)}
          </button>
        );
      })}
    </div>
  );
};

export default PlaygroundFileTabs;
