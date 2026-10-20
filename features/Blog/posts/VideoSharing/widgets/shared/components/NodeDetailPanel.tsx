import React from 'react';
import { X } from 'lucide-react';
import type { ArchitectureCategory } from '../../architecture/types';
import { ARCHITECTURE_CATEGORIES } from '../../architecture/constants';

interface NodeDetailPanelProps {
  /** The clicked diagram node, or null to show the hint. */
  selected: { name: string; category: ArchitectureCategory; description: string } | null;
  /** Names of the nodes the selected one is wired to. */
  neighbors: string[];
  /** Extra text after the category, e.g. the service that owns the node. */
  categoryNote?: React.ReactNode;
  /** Shown while nothing is selected. */
  hint: string;
  onClear: () => void;
}

/** Live panel under a clickable diagram: what the selected node is, what it does and what it talks to. */
const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ selected, neighbors, categoryNote, hint, onClear }) => (
  <div className="min-h-[96px] rounded-lg border border-border bg-background p-3" role="status" aria-live="polite">
    {selected ? (
      <>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-bold text-white">{selected.name}</div>
            <div
              className="mt-0.5 font-mono text-2xs uppercase tracking-wider"
              style={{ color: ARCHITECTURE_CATEGORIES[selected.category].color }}
            >
              {ARCHITECTURE_CATEGORIES[selected.category].label}
              {categoryNote}
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear selection"
            className="cursor-pointer text-neutral-500 transition-colors hover:text-white"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{selected.description}</div>
        {neighbors.length > 0 && (
          <div className="mt-2 font-mono text-2xs uppercase tracking-wider text-neutral-500">
            Talks to: {neighbors.join(', ')}
          </div>
        )}
      </>
    ) : (
      <div className="text-sm text-neutral-500">{hint}</div>
    )}
  </div>
);

export default NodeDetailPanel;
