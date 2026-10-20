import { UPLOAD_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the upload flow visualizer. */
export const useUploadFlowStore = createFlowStore(UPLOAD_SCENARIOS, 'happy');
