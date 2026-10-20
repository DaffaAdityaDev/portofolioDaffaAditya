import type { FlowConfig } from '@/features/Blog/flow/types';
import type { ShieldStep } from './types';
import { useOriginShieldStore } from './store';
import { SHIELD_EDGE_LABELS, SHIELD_EDGES, SHIELD_NODES } from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { SHIELD_SCENARIO_ORDER, SHIELD_SCENARIOS } from './scenarios';

/** A launch-day crowd and the defenses that keep it off the origin, wired for the generic flow components. */
export const ORIGIN_SHIELD_FLOW: FlowConfig<ShieldStep> = {
  definition: {
    name: 'Launch day',
    ...FLOW_DIAGRAM_SIZE,
    nodes: SHIELD_NODES,
    edges: SHIELD_EDGES,
    edgeLabels: SHIELD_EDGE_LABELS,
    scenarios: SHIELD_SCENARIOS,
    scenarioOrder: SHIELD_SCENARIO_ORDER,
  },
  useStore: useOriginShieldStore,
};
