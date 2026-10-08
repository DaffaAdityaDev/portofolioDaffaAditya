import { useEffect } from 'react';
import { useVideoDesignStore } from '@/features/Blog/posts/VideoSharing/widgets/capacity/store';
import { SIM } from '../constants';

/** Advances the traffic simulation on an interval while `isActive` is true. */
export function useSimulationLoop(isActive: boolean) {
  const tick = useVideoDesignStore((state) => state.tick);

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(tick, SIM.tickMs);
    return () => clearInterval(id);
  }, [isActive, tick]);
}
