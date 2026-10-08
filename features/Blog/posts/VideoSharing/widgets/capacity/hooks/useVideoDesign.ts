import { useVideoDesignStore } from '@/features/Blog/posts/VideoSharing/widgets/capacity/store';
import { deriveDesign } from '../utils/simulation';

/**
 * The live simulation for the widgets that follow it tick by tick: the diagram
 * and the readout. Widgets that only need part of the store use the narrower
 * hooks in useVideoDesignSlices, so they do not re-render on every tick.
 */
export function useVideoDesign() {
  const constraints = useVideoDesignStore((state) => state.constraints);
  const choices = useVideoDesignStore((state) => state.choices);
  const sim = useVideoDesignStore((state) => state.sim);

  const { flows, metrics, bottleneck } = deriveDesign(constraints, choices, sim);

  return { choices, sim, flows, metrics, bottleneck };
}
