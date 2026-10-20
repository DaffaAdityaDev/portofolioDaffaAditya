import { STREAM_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the streaming flow visualizer. */
export const useStreamingFlowStore = createFlowStore(STREAM_SCENARIOS, 'hit');
