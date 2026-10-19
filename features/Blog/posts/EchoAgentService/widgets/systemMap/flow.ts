import type { FlowConfig } from '@/features/Blog/flow/types';
import type { MapStep } from '@/features/Blog/posts/EchoAgentService/widgets/systemMap/types';
import { useSystemMapStore } from '@/features/Blog/posts/EchoAgentService/widgets/systemMap/store';
import { MAP_EDGE_LABELS, MAP_EDGES, MAP_NODES } from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { MAP_SCENARIO_ORDER, MAP_SCENARIOS } from './scenarios';

/** A chat turn, a memory call and a cancelled mission, wired for the generic flow components. */
export const SYSTEM_MAP_FLOW: FlowConfig<MapStep> = {
  definition: {
    name: 'Echo system map',
    ...FLOW_DIAGRAM_SIZE,
    nodes: MAP_NODES,
    edges: MAP_EDGES,
    edgeLabels: MAP_EDGE_LABELS,
    scenarios: MAP_SCENARIOS,
    scenarioOrder: MAP_SCENARIO_ORDER,
  },
  useStore: useSystemMapStore,
};
