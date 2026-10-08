import { ACTION_SCENARIOS } from '@/features/Blog/posts/Nextjs14Improvement/widgets/serverActionFlow/scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the Server Action flow. */
export const useServerActionStore = createFlowStore(ACTION_SCENARIOS, 'apiRoute');
