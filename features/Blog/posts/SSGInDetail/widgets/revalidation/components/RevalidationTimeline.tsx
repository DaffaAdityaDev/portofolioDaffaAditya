import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/utils/cn';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import ToggleButton from '@/features/Blog/components/ToggleButton';
import SliderField from '@/features/Blog/components/SliderField';
import AnimatedNumber from '@/features/Blog/components/AnimatedNumber';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { RENDER_MODE_ORDER, RENDER_MODES, TIMELINE } from '../constants';
import { useRevalidationTimeline } from '../hooks/useRevalidationTimeline';
import TimelineChart from './TimelineChart';

const formatCount = (value: number) => String(Math.round(value));
const formatSeconds = (value: number) => `${value} s`;

const Stat: React.FC<{ label: string; value: number; isBad?: boolean }> = ({ label, value, isBad }) => (
  <div>
    <div className={cn('mb-0.5', FLOW_METER_LABEL_CLASS)}>{label}</div>
    <AnimatedNumber
      value={value}
      format={formatCount}
      className={cn('font-mono text-lg font-bold tabular-nums', isBad ? 'text-red-400' : 'text-neutral-100')}
    />
  </div>
);

/**
 * 8 visitors over 4 minutes and one CMS edit, served by SSG, ISR or SSR, to
 * show who gets the old post and how often the server has to render.
 */
const RevalidationTimeline: React.FC = () => {
  const { mode, revalidate, editAt, result, setMode, setRevalidate, setEditAt } = useRevalidationTimeline();

  return (
    <WidgetFrame title="Who gets the new post?" icon={Clock}>
      <div className="flex flex-col gap-5 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Rendering mode">
            {RENDER_MODE_ORDER.map((id) => {
              const isSelected = id === mode;
              return (
                <ToggleButton key={id} selected={isSelected} onClick={() => setMode(id)}>
                  {RENDER_MODES[id].label}
                </ToggleButton>
              );
            })}
          </div>
          <div className="text-xs leading-relaxed text-neutral-500">{RENDER_MODES[mode].summary}</div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SliderField
            label="CMS edit at"
            value={editAt}
            min={TIMELINE.editAt.min}
            max={TIMELINE.editAt.max}
            step={TIMELINE.editAt.step}
            onChange={setEditAt}
            format={formatSeconds}
          />
          {mode === 'isr' && (
            <SliderField
              label="revalidate"
              value={revalidate}
              min={TIMELINE.revalidate.min}
              max={TIMELINE.revalidate.max}
              step={TIMELINE.revalidate.step}
              onChange={setRevalidate}
              format={formatSeconds}
            />
          )}
        </div>

        <TimelineChart result={result} editAt={editAt} />

        <div className="grid grid-cols-2 gap-4" aria-live="polite">
          <Stat label="Renders after the build" value={result.renders} />
          <Stat label="Stale responses" value={result.staleResponses} isBad={result.staleResponses > 0} />
        </div>
      </div>
    </WidgetFrame>
  );
};

export default RevalidationTimeline;
