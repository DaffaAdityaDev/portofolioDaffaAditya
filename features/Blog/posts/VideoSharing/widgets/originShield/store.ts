import { SHIELD_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the origin shield flow. */
export const useOriginShieldStore = createFlowStore(SHIELD_SCENARIOS, 'none');
