import { STATUS_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the video status flow. */
export const useVideoStatusStore = createFlowStore(STATUS_SCENARIOS, 'normal');
