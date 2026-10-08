import React from 'react';
import { Gauge } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { QualityMode } from '@/features/Blog/posts/VideoSharing/widgets/abr/types';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import ToggleButton from '@/features/Blog/components/ToggleButton';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { ABR_LADDER, ABR_PROFILE_ORDER, ABR_PROFILES } from '../constants';
import { useAbrSimulator } from '../hooks/useAbrSimulator';
import AbrChart from './AbrChart';

const QUALITY_OPTIONS: { mode: QualityMode; label: string }[] = [
  { mode: 'auto', label: 'Auto' },
  ...ABR_LADDER.map((rendition, index) => ({ mode: index, label: rendition.label })),
];

interface PickerProps<T> {
  label: string;
  options: { value: T; label: string }[];
  selected: T;
  onSelect: (value: T) => void;
}

/** A row of toggle buttons, styled like the scenario picker of the flows. */
const Picker = <T extends string | number>({ label, options, selected, onSelect }: PickerProps<T>) => (
  <div>
    <div className={cn('mb-1.5', FLOW_METER_LABEL_CLASS)}>{label}</div>
    <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <ToggleButton
            key={option.value}
            selected={isSelected}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </ToggleButton>
        );
      })}
    </div>
  </div>
);

const Stat: React.FC<{ label: string; value: string; isBad?: boolean }> = ({ label, value, isBad }) => (
  <div>
    <div className={cn('mb-0.5', FLOW_METER_LABEL_CLASS)}>{label}</div>
    <div className={cn('font-mono text-lg font-bold tabular-nums', isBad ? 'text-red-400' : 'text-neutral-100')}>{value}</div>
  </div>
);

/**
 * Two minutes of playback over a chosen network, with the quality on Auto or
 * pinned to one rendition, to show why Auto is the default.
 */
const AbrSimulator: React.FC = () => {
  const { profile, mode, result, setProfileId, setMode } = useAbrSimulator();

  return (
    <WidgetFrame title="Auto quality simulator" icon={Gauge}>
      <div className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-4">
          <Picker
            label="Network"
            options={ABR_PROFILE_ORDER.map((id) => ({ value: id, label: ABR_PROFILES[id].label }))}
            selected={profile.id}
            onSelect={setProfileId}
          />
          <Picker
            label="Quality setting"
            options={QUALITY_OPTIONS.map((option) => ({ value: option.mode, label: option.label }))}
            selected={mode}
            onSelect={setMode}
          />
          <div className="text-xs leading-relaxed text-neutral-500">{profile.summary}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Start-up" value={`${result.startupSeconds.toFixed(1)} s`} />
          <Stat
            label="Freezes"
            value={result.stalls === 0 ? 'None' : `${result.stalls} · ${Math.round(result.stallSeconds)} s`}
            isBad={result.stalls > 0}
          />
          <Stat label="Quality switches" value={String(result.switches)} />
          <Stat label="Average bitrate" value={`${result.averageMbps.toFixed(1)} Mbps`} />
        </div>

        <AbrChart result={result} />
      </div>
    </WidgetFrame>
  );
};

export default AbrSimulator;
