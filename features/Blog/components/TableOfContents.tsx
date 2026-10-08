import React, { useCallback, useState } from 'react';
import { ListTree, X } from 'lucide-react';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import { cn } from '@/utils/cn';
import type { TableOfContentsProps } from '@/types/blog';

/** The list of sections. Subsections are indented under their section. */
const TocList: React.FC<TableOfContentsProps> = ({ items, activeId, onSelect }) => (
  <ol className="flex flex-col">
    {items.map((item) => {
      const isActive = item.id === activeId;
      return (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            aria-current={isActive ? 'location' : undefined}
            onClick={(event) => {
              event.preventDefault();
              onSelect(item.id);
            }}
            className={cn(
              'block border-l py-1.5 pr-2 text-[13px] leading-snug transition-colors',
              item.level === 2 ? 'pl-3 font-medium' : 'pl-6 text-[12px]',
              isActive
                ? 'border-red-500 text-white'
                : 'border-neutral-800 text-neutral-500 hover:border-neutral-500 hover:text-neutral-200 ',
            )}
          >
            {item.text}
          </a>
        </li>
      );
    })}
  </ol>
);

const TocHeader: React.FC = () => (
  <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400">
    <ListTree className="size-3.5 text-red-500" aria-hidden="true" />
    On this page
  </div>
);

/** Sticky sidebar for wide screens. */
export const TocSidebar: React.FC<TableOfContentsProps> = (props) => (
  <nav aria-label="Table of contents" className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto pb-8">
    <TocHeader />
    <TocList {...props} />
  </nav>
);

/** Floating button for narrow screens. It opens the list as a bottom sheet and closes after a jump. */
export const TocSheet: React.FC<TableOfContentsProps> = ({ items, activeId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  useModalDismiss(isOpen, close);

  const activeText = items.find((item) => item.id === activeId)?.text;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="fixed bottom-4 right-4 z-[90] flex max-w-[calc(100vw-2rem)] cursor-pointer items-center gap-2 border border-neutral-700 bg-[#0d0d0d]/95 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-300 shadow-xl backdrop-blur transition-colors hover:border-red-500 hover:text-white"
      >
        <ListTree className="size-3.5 shrink-0 text-red-500" aria-hidden="true" />
        <span className="truncate">{activeText ?? 'Contents'}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-end bg-black/60" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Table of contents"
            onClick={(event) => event.stopPropagation()}
            className="max-h-[75vh] w-full overflow-y-auto border-t border-neutral-800 bg-[#0d0d0d] p-4 pb-8"
          >
            <div className="flex items-start justify-between">
              <TocHeader />
              <button
                type="button"
                onClick={close}
                aria-label="Close table of contents"
                className="cursor-pointer text-neutral-500 transition-colors hover:text-white"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            <TocList
              items={items}
              activeId={activeId}
              onSelect={(id) => {
                close();
                // Wait a frame, so the sheet has released the page scroll before the jump.
                requestAnimationFrame(() => onSelect(id));
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
