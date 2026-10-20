import type { FlowConfig } from '@/features/Blog/flow/types';
import type { LoginStep } from './types';
import { useLoginFlowStore } from './store';
import { LOGIN_EDGE_LABELS, LOGIN_EDGES, LOGIN_NODES } from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { LOGIN_SCENARIO_ORDER, LOGIN_SCENARIOS } from './scenarios';

/** The login story, wired for the generic flow components. */
export const LOGIN_FLOW: FlowConfig<LoginStep> = {
  definition: {
    name: 'Login and tokens',
    ...FLOW_DIAGRAM_SIZE,
    nodes: LOGIN_NODES,
    edges: LOGIN_EDGES,
    edgeLabels: LOGIN_EDGE_LABELS,
    scenarios: LOGIN_SCENARIOS,
    scenarioOrder: LOGIN_SCENARIO_ORDER,
  },
  useStore: useLoginFlowStore,
};
