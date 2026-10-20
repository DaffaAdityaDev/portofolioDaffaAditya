import { useState } from 'react';
import type { ApiModuleNodeId } from '../types';
import { API_MODULE_EDGES, API_MODULE_NODES } from '../constants';

const EDGE_ENTRIES = Object.entries(API_MODULE_EDGES);
const NODE_IDS = Object.keys(API_MODULE_NODES) as ApiModuleNodeId[];

/** Which component of the API modules diagram is selected, and what it lights up. */
export const useApiModulesDiagram = () => {
  const [selectedId, setSelectedId] = useState<ApiModuleNodeId | null>(null);

  const activeEdges = selectedId
    ? EDGE_ENTRIES.filter(([, edge]) => edge.from === selectedId || edge.to === selectedId)
    : EDGE_ENTRIES;
  const activeEdgeIds = new Set(activeEdges.map(([id]) => id));

  const activeNodeIds = new Set<ApiModuleNodeId>(
    selectedId ? activeEdges.flatMap(([, edge]) => [edge.from, edge.to]) : NODE_IDS,
  );
  if (selectedId) activeNodeIds.add(selectedId);

  const neighbors = selectedId
    ? [...activeNodeIds].filter((id) => id !== selectedId).map((id) => API_MODULE_NODES[id].name)
    : [];

  return {
    selected: selectedId ? API_MODULE_NODES[selectedId] : null,
    selectedId,
    neighbors,
    toggleNode: (id: ApiModuleNodeId) => setSelectedId((current) => (current === id ? null : id)),
    clearSelection: () => setSelectedId(null),
    activeEdgeIds,
    activeNodeIds,
  };
};
