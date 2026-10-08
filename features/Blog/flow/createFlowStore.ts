import { create } from 'zustand';
import { clamp } from '@/utils/math';
import type { FlowStoreHook, FlowStoreState } from '@/features/Blog/flow/types';

type ScenarioSteps = Record<string, { steps: readonly unknown[] }>;

/**
 * Builds the playback store for one step-by-step flow. Every flow shares the
 * same behaviour: pick a scenario, move between steps, play on a timer, and
 * stop on the last step. Each flow gets its own store instance.
 */
export function createFlowStore(scenarios: ScenarioSteps, initialScenarioId: string): FlowStoreHook {
  const lastStepIndex = (id: string): number => scenarios[id].steps.length - 1;
  const initialState = { scenarioId: initialScenarioId, stepIndex: 0, isPlaying: false };

  return create<FlowStoreState>((set, get) => {
    const goToStep = (index: number, keepPlaying = false) =>
      set((state) => ({
        stepIndex: clamp(index, 0, lastStepIndex(state.scenarioId)),
        isPlaying: keepPlaying,
      }));

    return {
      ...initialState,

      selectScenario: (id) => set({ scenarioId: id, stepIndex: 0, isPlaying: true }),

      goToStep: (index) => goToStep(index),
      next: () => goToStep(get().stepIndex + 1),
      prev: () => goToStep(get().stepIndex - 1),

      play: () =>
        set((state) => ({
          // Pressing play on the last step starts the scenario over.
          stepIndex: state.stepIndex >= lastStepIndex(state.scenarioId) ? 0 : state.stepIndex,
          isPlaying: true,
        })),

      togglePlay: () => (get().isPlaying ? set({ isPlaying: false }) : get().play()),

      restart: () => set({ stepIndex: 0, isPlaying: true }),

      // Forget the reader's position, so coming back to the page starts fresh.
      reset: () => set(initialState),

      advance: () =>
        set((state) => {
          const next = state.stepIndex + 1;
          if (next > lastStepIndex(state.scenarioId)) return { isPlaying: false };
          // Playing stops on arrival at the last step.
          return { stepIndex: next, isPlaying: next < lastStepIndex(state.scenarioId) };
        }),
    };
  });
}
