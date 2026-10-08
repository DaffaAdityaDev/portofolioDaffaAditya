import type { FlowConfig, FlowStep } from '@/features/Blog/flow/types';

/** Current scenario and step of a flow, plus its playback actions. */
export function useFlow<TStep extends FlowStep>(flow: FlowConfig<TStep>) {
  const { definition, useStore } = flow;
  const scenarioId = useStore((state) => state.scenarioId);
  const stepIndex = useStore((state) => state.stepIndex);
  const isPlaying = useStore((state) => state.isPlaying);
  const selectScenario = useStore((state) => state.selectScenario);
  const goToStep = useStore((state) => state.goToStep);
  const next = useStore((state) => state.next);
  const prev = useStore((state) => state.prev);
  const togglePlay = useStore((state) => state.togglePlay);
  const restart = useStore((state) => state.restart);

  const scenario = definition.scenarios[scenarioId];
  const step = scenario.steps[stepIndex];

  return {
    definition,
    scenario,
    step,
    stepIndex,
    totalSteps: scenario.steps.length,
    isPlaying,
    selectScenario,
    goToStep,
    next,
    prev,
    togglePlay,
    restart,
  };
}
