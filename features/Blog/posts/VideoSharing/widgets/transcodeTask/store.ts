import { TASK_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the transcode task flow. */
export const useTranscodeTaskStore = createFlowStore(TASK_SCENARIOS, 'happy');
