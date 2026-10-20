import { CACHE_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the metadata cache flow. */
export const useMetadataCacheStore = createFlowStore(CACHE_SCENARIOS, 'aside');
