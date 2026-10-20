import { FALLBACK_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the fallback flow. */
export const useFallbackStore = createFlowStore(FALLBACK_SCENARIOS, 'false');
