import { DEPLOY_SCENARIOS } from '@/features/Blog/posts/VideoSharing/widgets/deployPipeline/scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the deploy pipeline flow. */
export const useDeployPipelineStore = createFlowStore(DEPLOY_SCENARIOS, 'success');
