import { COUNT_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the view counting flow. */
export const useViewCountStore = createFlowStore(COUNT_SCENARIOS, 'view');
