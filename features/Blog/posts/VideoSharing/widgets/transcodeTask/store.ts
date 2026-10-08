import { TASK_SCENARIOS } from '@/features/Blog/posts/VideoSharing/widgets/transcodeTask/scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the transcode task flow. */
export const useTranscodeTaskStore = createFlowStore(TASK_SCENARIOS, 'happy');
