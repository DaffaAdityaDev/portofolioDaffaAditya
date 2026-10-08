import type { FlowConfig } from '@/features/Blog/flow/types';
import type { LbStep } from '@/features/Blog/posts/VideoSharing/widgets/loadBalancer/types';
import { useLoadBalancerStore } from '@/features/Blog/posts/VideoSharing/widgets/loadBalancer/store';
import { LB_EDGE_LABELS, LB_EDGES, LB_NODES } from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { LB_SCENARIO_ORDER, LB_SCENARIOS } from './scenarios';

/** Routing, health checks and a failed balancer, wired for the generic flow components. */
export const LOAD_BALANCER_FLOW: FlowConfig<LbStep> = {
  definition: {
    name: 'Load balancing',
    ...FLOW_DIAGRAM_SIZE,
    nodes: LB_NODES,
    edges: LB_EDGES,
    edgeLabels: LB_EDGE_LABELS,
    scenarios: LB_SCENARIOS,
    scenarioOrder: LB_SCENARIO_ORDER,
  },
  useStore: useLoadBalancerStore,
};
