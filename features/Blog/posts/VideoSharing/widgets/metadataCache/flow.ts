import type { FlowConfig } from '@/features/Blog/flow/types';
import type { CacheStep } from './types';
import { useMetadataCacheStore } from './store';
import { CACHE_EDGE_LABELS, CACHE_EDGES, CACHE_NODES } from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { CACHE_SCENARIO_ORDER, CACHE_SCENARIOS } from './scenarios';

/** Cache-aside reads, invalidation and failures, wired for the generic flow components. */
export const METADATA_CACHE_FLOW: FlowConfig<CacheStep> = {
  definition: {
    name: 'Metadata cache',
    ...FLOW_DIAGRAM_SIZE,
    nodes: CACHE_NODES,
    edges: CACHE_EDGES,
    edgeLabels: CACHE_EDGE_LABELS,
    scenarios: CACHE_SCENARIOS,
    scenarioOrder: CACHE_SCENARIO_ORDER,
  },
  useStore: useMetadataCacheStore,
};
