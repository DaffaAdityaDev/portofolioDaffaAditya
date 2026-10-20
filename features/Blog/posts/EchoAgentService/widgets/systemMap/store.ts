import { MAP_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the system map flow. */
export const useSystemMapStore = createFlowStore(MAP_SCENARIOS, 'turn');
