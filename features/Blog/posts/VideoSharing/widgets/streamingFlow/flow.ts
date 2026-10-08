import type { FlowConfig } from '@/features/Blog/flow/types';
import type { StreamStep } from '@/features/Blog/posts/VideoSharing/widgets/streamingFlow/types';
import { useStreamingFlowStore } from '@/features/Blog/posts/VideoSharing/widgets/streamingFlow/store';
import {
  STREAM_EDGE_LABELS,
  STREAM_EDGES,
  STREAM_NODES,
} from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { STREAM_SCENARIO_ORDER, STREAM_SCENARIOS } from './scenarios';

/** The watching story, wired for the generic flow components. */
export const STREAM_FLOW: FlowConfig<StreamStep> = {
  definition: {
    name: 'Streaming path',
    ...FLOW_DIAGRAM_SIZE,
    nodes: STREAM_NODES,
    edges: STREAM_EDGES,
    edgeLabels: STREAM_EDGE_LABELS,
    scenarios: STREAM_SCENARIOS,
    scenarioOrder: STREAM_SCENARIO_ORDER,
  },
  useStore: useStreamingFlowStore,
};
