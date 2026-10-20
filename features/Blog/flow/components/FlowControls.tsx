import React from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { cn } from '@/utils/cn';
import ActionButton from '@/features/Blog/components/ActionButton';
import ToggleButton from '@/features/Blog/components/ToggleButton';
import type { FlowConfig, FlowStep } from '@/features/Blog/flow/types';
import { useFlow } from '../hooks/useFlow';

interface FlowProps<TStep extends FlowStep> {
  flow: FlowConfig<TStep>;
}

/** Scenario picker: one button per story the reader can replay. */
export const ScenarioPicker = <TStep extends FlowStep>({ flow }: FlowProps<TStep>) => {
  const { definition, scenario, selectScenario } = useFlow(flow);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario">
        {definition.scenarioOrder.map((id) => {
          const isSelected = id === scenario.id;
          return (
            <ToggleButton key={id} selected={isSelected} onClick={() => selectScenario(id)}>
              {definition.scenarios[id].label}
            </ToggleButton>
          );
        })}
      </div>
      <div className="text-xs leading-relaxed text-neutral-500">{scenario.summary}</div>
    </div>
  );
};

/** Previous, play or pause, next, restart, and a dot per step to jump to it. */
export const PlaybackControls = <TStep extends FlowStep>({ flow }: FlowProps<TStep>) => {
  const { stepIndex, totalSteps, isPlaying, scenario, goToStep, next, prev, togglePlay, restart } =
    useFlow(flow);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <ActionButton iconOnly variant="bordered" aria-label="Previous step" onClick={prev} disabled={stepIndex === 0}>
          <SkipBack className="size-4" aria-hidden="true" />
        </ActionButton>
        <ActionButton iconOnly aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay}>
          {isPlaying ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
        </ActionButton>
        <ActionButton
          iconOnly
          variant="bordered"
          aria-label="Next step"
          onClick={next}
          disabled={stepIndex === totalSteps - 1}
        >
          <SkipForward className="size-4" aria-hidden="true" />
        </ActionButton>
        <ActionButton iconOnly variant="bordered" aria-label="Restart scenario" onClick={restart}>
          <RotateCcw className="size-4" aria-hidden="true" />
        </ActionButton>
      </div>

      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Jump to step">
        {scenario.steps.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-label={`Step ${index + 1}: ${item.title}`}
            aria-current={index === stepIndex ? 'step' : undefined}
            onClick={() => goToStep(index)}
            className={cn(
              'h-2.5 w-6 cursor-pointer transition-colors',
              index === stepIndex && 'bg-accent-brand',
              index < stepIndex && 'bg-neutral-500',
              index > stepIndex && 'bg-neutral-800 hover:bg-neutral-700',
            )}
          />
        ))}
      </div>
    </div>
  );
};
