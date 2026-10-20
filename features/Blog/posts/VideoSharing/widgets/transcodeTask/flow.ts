import type { FlowConfig } from '@/features/Blog/flow/types';
import type { TaskStep } from './types';
import { useTranscodeTaskStore } from './store';
import { TASK_EDGE_LABELS, TASK_EDGES, TASK_NODES } from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { TASK_SCENARIO_ORDER, TASK_SCENARIOS } from './scenarios';

/** One transcode task from pull to ack, wired for the generic flow components. */
export const TRANSCODE_TASK_FLOW: FlowConfig<TaskStep> = {
  definition: {
    name: 'Life of a transcode task',
    ...FLOW_DIAGRAM_SIZE,
    nodes: TASK_NODES,
    edges: TASK_EDGES,
    edgeLabels: TASK_EDGE_LABELS,
    scenarios: TASK_SCENARIOS,
    scenarioOrder: TASK_SCENARIO_ORDER,
  },
  useStore: useTranscodeTaskStore,
};
