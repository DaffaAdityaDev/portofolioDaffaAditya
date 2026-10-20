import type { FlowConfig } from '@/features/Blog/flow/types';
import type { UploadStep } from './types';
import { useUploadFlowStore } from './store';
import {
  UPLOAD_EDGE_LABELS,
  UPLOAD_EDGES,
  UPLOAD_NODES,
} from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { UPLOAD_SCENARIO_ORDER, UPLOAD_SCENARIOS } from './scenarios';

/** The upload story, wired for the generic flow components. */
export const UPLOAD_FLOW: FlowConfig<UploadStep> = {
  definition: {
    name: 'Upload pipeline',
    ...FLOW_DIAGRAM_SIZE,
    nodes: UPLOAD_NODES,
    edges: UPLOAD_EDGES,
    edgeLabels: UPLOAD_EDGE_LABELS,
    scenarios: UPLOAD_SCENARIOS,
    scenarioOrder: UPLOAD_SCENARIO_ORDER,
    // The metadata DB always shows the video status of the current step.
    liveCaption: (nodeId, step) => (nodeId === 'db' ? step.status : undefined),
  },
  useStore: useUploadFlowStore,
};
