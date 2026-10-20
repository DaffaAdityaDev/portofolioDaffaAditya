import type { FlowConfig } from '@/features/Blog/flow/types';
import type { ActionStep } from './types';
import { useServerActionStore } from './store';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { ACTION_EDGE_LABELS, ACTION_EDGES, ACTION_NODES } from './constants';
import { ACTION_SCENARIO_ORDER, ACTION_SCENARIOS } from './scenarios';

/** API route vs Server Action, a submit before JavaScript loads, and a missing auth check. */
export const SERVER_ACTION_FLOW: FlowConfig<ActionStep> = {
  definition: {
    name: 'Server Action',
    ...FLOW_DIAGRAM_SIZE,
    nodes: ACTION_NODES,
    edges: ACTION_EDGES,
    edgeLabels: ACTION_EDGE_LABELS,
    scenarios: ACTION_SCENARIOS,
    scenarioOrder: ACTION_SCENARIO_ORDER,
  },
  useStore: useServerActionStore,
};
