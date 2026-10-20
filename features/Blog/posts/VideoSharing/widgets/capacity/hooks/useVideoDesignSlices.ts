import { useMemo } from 'react';
import { useVideoDesignStore } from '../store';
import { calculateEstimates } from '../utils/simulation';

/*
 * Narrow views of the video design store. The simulation ticks four times a
 * second, so a component that reads the whole store re-renders four times a
 * second. These hooks subscribe only to what a component needs: constraints for
 * the estimator, choices for the design controls, and two primitives for the
 * traffic controls. Only the diagram and readout use the full `useVideoDesign`.
 */

export function useVideoConstraints() {
  const constraints = useVideoDesignStore((state) => state.constraints);
  const setConstraint = useVideoDesignStore((state) => state.setConstraint);
  const estimates = useMemo(() => calculateEstimates(constraints), [constraints]);

  return { constraints, estimates, setConstraint };
}

export function useVideoChoices() {
  const choices = useVideoDesignStore((state) => state.choices);
  const setChoice = useVideoDesignStore((state) => state.setChoice);
  const applyPreset = useVideoDesignStore((state) => state.applyPreset);

  return { choices, setChoice, applyPreset };
}

export function useTrafficControls() {
  const targetMultiplier = useVideoDesignStore((state) => state.sim.targetMultiplier);
  const isSpiking = useVideoDesignStore((state) => state.sim.spikeEndsAt !== null);
  const triggerSpike = useVideoDesignStore((state) => state.triggerSpike);
  const setTargetMultiplier = useVideoDesignStore((state) => state.setTargetMultiplier);
  const resetSimulation = useVideoDesignStore((state) => state.resetSimulation);

  return { targetMultiplier, isSpiking, triggerSpike, setTargetMultiplier, resetSimulation };
}
