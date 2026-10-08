import React from 'react';
import { Flame, RotateCcw } from 'lucide-react';
import type { DesignPreset, VideoDesignChoices } from '@/features/Blog/posts/VideoSharing/widgets/capacity/types';
import ActionButton from '@/features/Blog/components/ActionButton';
import SliderField from '@/features/Blog/components/SliderField';
import SwitchField from '@/features/Blog/components/SwitchField';
import ToggleButton from '@/features/Blog/components/ToggleButton';
import {
  CHOICE_LIMITS,
  DESIGN_PRESETS,
  PRESET_LABELS,
  SIM,
} from '../constants';
import { useTrafficControls, useVideoChoices } from '../hooks/useVideoDesignSlices';
import { formatMultiplier } from '../utils/format';

type ToggleKey = 'cdnEnabled' | 'cacheEnabled' | 'autoscaleEnabled';
type SliderKey = keyof typeof CHOICE_LIMITS;

const TOGGLES: { key: ToggleKey; label: string }[] = [
  { key: 'cdnEnabled', label: 'CDN' },
  { key: 'cacheEnabled', label: 'Metadata cache' },
  { key: 'autoscaleEnabled', label: 'Autoscale API servers' },
];

const CHOICE_SLIDERS: { key: SliderKey; label: string }[] = [
  { key: 'baselineApiServers', label: 'API servers (baseline)' },
  { key: 'dbReplicas', label: 'DB read replicas' },
  { key: 'dbShards', label: 'DB shards' },
  { key: 'transcodeWorkers', label: 'Transcoding workers' },
];

const PRESETS = Object.keys(DESIGN_PRESETS) as DesignPreset[];

/** True when the current choices equal a preset exactly. */
function matchesPreset(choices: VideoDesignChoices, preset: DesignPreset): boolean {
  const target = DESIGN_PRESETS[preset];
  return (Object.keys(target) as (keyof VideoDesignChoices)[]).every(
    (key) => choices[key] === target[key],
  );
}

/** Traffic slider, the viral-spike button, and a reset. Sits above the diagram. */
export const TrafficControls: React.FC = () => {
  const { targetMultiplier, isSpiking, triggerSpike, setTargetMultiplier, resetSimulation } =
    useTrafficControls();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <ActionButton
        onClick={triggerSpike}
        disabled={isSpiking}
        className="shrink-0 font-mono font-bold uppercase tracking-wider"
      >
        <Flame className="size-4" aria-hidden="true" />
        {isSpiking ? 'Going viral...' : 'Go viral'}
      </ActionButton>
      <div className="flex-1">
        <SliderField
          label="Traffic target"
          value={targetMultiplier}
          min={SIM.minMultiplier}
          max={SIM.maxMultiplier}
          step={SIM.multiplierStep}
          format={formatMultiplier}
          onChange={setTargetMultiplier}
        />
      </div>
      <ActionButton
        variant="bordered"
        onClick={resetSimulation}
        className="shrink-0 font-mono uppercase tracking-wider"
      >
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Reset
      </ActionButton>
    </div>
  );
};

/** Presets, on/off switches, and capacity sliders for the architecture. */
export const DesignControls: React.FC = () => {
  const { choices, setChoice, applyPreset } = useVideoChoices();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Start from preset">
        <span className="mr-1 font-mono text-[11px] uppercase tracking-wider text-neutral-500" aria-hidden="true">
          Start from
        </span>
        {PRESETS.map((preset) => (
          <ToggleButton
            key={preset}
            selected={matchesPreset(choices, preset)}
            onClick={() => applyPreset(preset)}
          >
            {PRESET_LABELS[preset]}
          </ToggleButton>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {TOGGLES.map(({ key, label }) => (
          <SwitchField
            key={key}
            label={label}
            checked={choices[key]}
            onChange={(value) => setChoice(key, value)}
          />
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {CHOICE_SLIDERS.map(({ key, label }) => (
          <SliderField
            key={key}
            label={label}
            value={choices[key]}
            onChange={(value) => setChoice(key, value)}
            {...CHOICE_LIMITS[key]}
          />
        ))}
      </div>
    </div>
  );
};
