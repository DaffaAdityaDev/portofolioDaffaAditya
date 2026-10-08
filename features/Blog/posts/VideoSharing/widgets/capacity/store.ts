import { create } from 'zustand';
import { clamp } from '@/utils/math';
import {
  DEFAULT_CONSTRAINTS,
  DEFAULT_PRESET,
  DESIGN_PRESETS,
  SIM,
} from '@/features/Blog/posts/VideoSharing/widgets/capacity/constants';
import {
  createInitialRuntime,
  stepSimulation,
} from '@/features/Blog/posts/VideoSharing/widgets/capacity/utils/simulation';
import type {
  DesignPreset,
  SimRuntime,
  VideoConstraints,
  VideoDesignChoices,
} from '@/features/Blog/posts/VideoSharing/widgets/capacity/types';

export interface VideoDesignStoreState {
  constraints: VideoConstraints;
  choices: VideoDesignChoices;
  sim: SimRuntime;

  // Actions
  setConstraint: <K extends keyof VideoConstraints>(key: K, value: VideoConstraints[K]) => void;
  setChoice: <K extends keyof VideoDesignChoices>(key: K, value: VideoDesignChoices[K]) => void;
  applyPreset: (preset: DesignPreset) => void;
  setTargetMultiplier: (multiplier: number) => void;
  triggerSpike: () => void;
  tick: () => void;
  resetSimulation: () => void;
}

const INITIAL_CHOICES = DESIGN_PRESETS[DEFAULT_PRESET];

export const useVideoDesignStore = create<VideoDesignStoreState>((set) => ({
  constraints: DEFAULT_CONSTRAINTS,
  choices: INITIAL_CHOICES,
  sim: createInitialRuntime(INITIAL_CHOICES),

  setConstraint: (key, value) =>
    set((state) => ({ constraints: { ...state.constraints, [key]: value } })),

  setChoice: (key, value) =>
    set((state) => ({ choices: { ...state.choices, [key]: value } })),

  applyPreset: (preset) => set({ choices: DESIGN_PRESETS[preset] }),

  setTargetMultiplier: (multiplier) =>
    set((state) => ({
      sim: {
        ...state.sim,
        targetMultiplier: clamp(multiplier, SIM.minMultiplier, SIM.maxMultiplier),
        spikeEndsAt: null,
      },
    })),

  triggerSpike: () =>
    set((state) => ({
      sim: {
        ...state.sim,
        targetMultiplier: SIM.viralMultiplier,
        spikeEndsAt: state.sim.time + SIM.viralHoldSeconds,
      },
    })),

  tick: () =>
    set((state) => ({ sim: stepSimulation(state.sim, state.constraints, state.choices) })),

  resetSimulation: () => set((state) => ({ sim: createInitialRuntime(state.choices) })),
}));
