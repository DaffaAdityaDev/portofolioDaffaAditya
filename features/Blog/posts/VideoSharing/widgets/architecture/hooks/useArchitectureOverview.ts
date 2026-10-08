import { useState } from 'react';
import type { ArchitectureNodeId, ArchitectureView } from '@/features/Blog/posts/VideoSharing/widgets/architecture/types';
import { ARCHITECTURE_EDGES, ARCHITECTURE_NODES, ARCHITECTURE_VIEWS } from '../constants';

const EDGE_ENTRIES = Object.entries(ARCHITECTURE_EDGES);
const NODE_IDS = Object.keys(ARCHITECTURE_NODES) as ArchitectureNodeId[];

/**
 * State of the architecture overview: which flow is shown and which component
 * is selected. The first render is always the same, so the diagram can be
 * generated at build time.
 */
export const useArchitectureOverview = () => {
  const [view, setView] = useState<ArchitectureView>('all');
  const [selectedId, setSelectedId] = useState<ArchitectureNodeId | null>(null);

  const viewEdges = EDGE_ENTRIES.filter(([, edge]) => view === 'all' || edge.flows.includes(view));
  const activeEdges = selectedId
    ? viewEdges.filter(([, edge]) => edge.from === selectedId || edge.to === selectedId)
    : viewEdges;
  const activeEdgeIds = new Set(activeEdges.map(([id]) => id));

  const activeNodeIds = new Set<ArchitectureNodeId>(
    selectedId || view !== 'all' ? activeEdges.flatMap(([, edge]) => [edge.from, edge.to]) : NODE_IDS,
  );
  if (selectedId) activeNodeIds.add(selectedId);

  const neighbors = selectedId
    ? [...activeNodeIds].filter((id) => id !== selectedId).map((id) => ARCHITECTURE_NODES[id].name)
    : [];

  const toggleNode = (id: ArchitectureNodeId) => setSelectedId((current) => (current === id ? null : id));

  return {
    view,
    viewOption: ARCHITECTURE_VIEWS.find((option) => option.id === view) ?? ARCHITECTURE_VIEWS[0],
    setView,
    selected: selectedId ? ARCHITECTURE_NODES[selectedId] : null,
    selectedId,
    neighbors,
    toggleNode,
    clearSelection: () => setSelectedId(null),
    activeEdgeIds,
    activeNodeIds,
    /** Moving dots only when one flow or one component is in focus, so "everything" stays calm. */
    animateEdges: view !== 'all' || selectedId !== null,
  };
};
