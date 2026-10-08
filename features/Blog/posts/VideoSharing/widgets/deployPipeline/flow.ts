import type { FlowConfig } from '@/features/Blog/flow/types';
import type { DeployStep } from '@/features/Blog/posts/VideoSharing/widgets/deployPipeline/types';
import { useDeployPipelineStore } from '@/features/Blog/posts/VideoSharing/widgets/deployPipeline/store';
import { DEPLOY_EDGE_LABELS, DEPLOY_EDGES, DEPLOY_NODES } from './constants';
import { FLOW_DIAGRAM_SIZE } from '@/features/Blog/flow/constants';
import { DEPLOY_SCENARIO_ORDER, DEPLOY_SCENARIOS } from './scenarios';

/** A release from merge to full traffic, and the ways it can go wrong, wired for the generic flow components. */
export const DEPLOY_PIPELINE_FLOW: FlowConfig<DeployStep> = {
  definition: {
    name: 'Shipping a release',
    ...FLOW_DIAGRAM_SIZE,
    nodes: DEPLOY_NODES,
    edges: DEPLOY_EDGES,
    edgeLabels: DEPLOY_EDGE_LABELS,
    scenarios: DEPLOY_SCENARIOS,
    scenarioOrder: DEPLOY_SCENARIO_ORDER,
  },
  useStore: useDeployPipelineStore,
};
