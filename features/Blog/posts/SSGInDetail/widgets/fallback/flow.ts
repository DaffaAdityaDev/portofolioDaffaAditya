import type { FlowConfig } from '@/features/Blog/flow/types';
import type { FallbackStep } from './types';
import { useFallbackStore } from './store';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { FALLBACK_EDGE_LABELS, FALLBACK_EDGES, FALLBACK_NODES } from './constants';
import { FALLBACK_SCENARIO_ORDER, FALLBACK_SCENARIOS } from './scenarios';

/** A request for a page that was not built, under each fallback mode, wired for the generic flow components. */
export const FALLBACK_FLOW: FlowConfig<FallbackStep> = {
  definition: {
    name: 'Fallback modes',
    ...FLOW_DIAGRAM_SIZE,
    nodes: FALLBACK_NODES,
    edges: FALLBACK_EDGES,
    edgeLabels: FALLBACK_EDGE_LABELS,
    scenarios: FALLBACK_SCENARIOS,
    scenarioOrder: FALLBACK_SCENARIO_ORDER,
  },
  useStore: useFallbackStore,
};
