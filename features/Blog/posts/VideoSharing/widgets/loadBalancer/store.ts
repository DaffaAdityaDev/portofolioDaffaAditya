import { LB_SCENARIOS } from './scenarios';
import { createFlowStore } from '@/features/Blog/flow/createFlowStore';

/** Playback state (scenario, step, playing) for the load balancing flow. */
export const useLoadBalancerStore = createFlowStore(LB_SCENARIOS, 'route');
