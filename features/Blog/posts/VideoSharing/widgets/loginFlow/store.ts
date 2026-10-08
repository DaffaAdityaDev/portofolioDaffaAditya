import { LOGIN_SCENARIOS } from '@/features/Blog/posts/VideoSharing/widgets/loginFlow/scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the login flow visualizer. */
export const useLoginFlowStore = createFlowStore(LOGIN_SCENARIOS, 'login');
