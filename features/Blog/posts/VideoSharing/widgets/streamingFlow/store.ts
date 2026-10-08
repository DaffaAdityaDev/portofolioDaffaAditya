import { STREAM_SCENARIOS } from '@/features/Blog/posts/VideoSharing/widgets/streamingFlow/scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the streaming flow visualizer. */
export const useStreamingFlowStore = createFlowStore(STREAM_SCENARIOS, 'hit');
