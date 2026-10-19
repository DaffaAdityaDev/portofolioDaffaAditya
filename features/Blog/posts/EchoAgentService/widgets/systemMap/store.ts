import { MAP_SCENARIOS } from '@/features/Blog/posts/EchoAgentService/widgets/systemMap/scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the system map flow. */
export const useSystemMapStore = createFlowStore(MAP_SCENARIOS, 'turn');
