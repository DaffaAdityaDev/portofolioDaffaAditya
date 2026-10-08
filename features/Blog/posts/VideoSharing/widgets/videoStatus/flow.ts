import type { FlowConfig } from '@/features/Blog/flow/types';
import type { StatusStep } from '@/features/Blog/posts/VideoSharing/widgets/videoStatus/types';
import { useVideoStatusStore } from '@/features/Blog/posts/VideoSharing/widgets/videoStatus/store';
import { STATUS_EDGE_LABELS, STATUS_EDGES, STATUS_NODES } from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { STATUS_SCENARIO_ORDER, STATUS_SCENARIOS } from './scenarios';

/** The life of a video's status, wired for the generic flow components. */
export const VIDEO_STATUS_FLOW: FlowConfig<StatusStep> = {
  definition: {
    name: 'Video status',
    ...FLOW_DIAGRAM_SIZE,
    nodes: STATUS_NODES,
    edges: STATUS_EDGES,
    edgeLabels: STATUS_EDGE_LABELS,
    scenarios: STATUS_SCENARIOS,
    scenarioOrder: STATUS_SCENARIO_ORDER,
  },
  useStore: useVideoStatusStore,
};
