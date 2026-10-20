import type { FlowConfig } from '@/features/Blog/flow/types';
import type { CountStep } from './types';
import { useViewCountStore } from './store';
import { COUNT_EDGE_LABELS, COUNT_EDGES, COUNT_NODES } from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { COUNT_SCENARIO_ORDER, COUNT_SCENARIOS } from './scenarios';

/** Views and likes from the player to the counter, wired for the generic flow components. */
export const VIEW_COUNT_FLOW: FlowConfig<CountStep> = {
  definition: {
    name: 'Counting views and likes',
    ...FLOW_DIAGRAM_SIZE,
    nodes: COUNT_NODES,
    edges: COUNT_EDGES,
    edgeLabels: COUNT_EDGE_LABELS,
    scenarios: COUNT_SCENARIOS,
    scenarioOrder: COUNT_SCENARIO_ORDER,
  },
  useStore: useViewCountStore,
};
