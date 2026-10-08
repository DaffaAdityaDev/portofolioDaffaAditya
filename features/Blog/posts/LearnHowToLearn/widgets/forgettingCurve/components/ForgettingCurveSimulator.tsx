import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { cn } from '@/utils/cn';
import AnimatedNumber from '@/features/Blog/components/AnimatedNumber';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import ToggleButton from '@/features/Blog/components/ToggleButton';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { CURVE_MODEL, PRESET_ORDER, SCHEDULE_PRESETS } from '../constants';
import { useForgettingCurve } from '../hooks/useForgettingCurve';
import ForgettingCurveChart from './ForgettingCurveChart';

// The last day is where recall is measured, so it is not offered as a review day.
const DAYS = Array.from({ length: CURVE_MODEL.days - 1 }, (_, index) => index + 1);
const formatPercent = (value: number) => `${Math.round(value)}%`;
const formatCount = (value: number) => String(Math.round(value));

/**
 * Pick the days you review and watch modeled recall over a month. Shows why
 * a few reviews spread out beat the same reviews packed together.
 */
const ForgettingCurveSimulator: React.FC = () => {
  const { reviewDays, result, activePreset, applyPreset, toggleDay } = useForgettingCurve();

  return (
    <WidgetFrame title="Forgetting curve" icon={BrainCircuit}>
      <div className="flex flex-col gap-5 p-4">
        <div>
          <div className={cn('mb-1.5', FLOW_METER_LABEL_CLASS)}>Schedule</div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Schedule">
            {PRESET_ORDER.map((id) => {
              const isSelected = id === activePreset;
              return (
                <ToggleButton key={id} selected={isSelected} onClick={() => applyPreset(id)}>
                  {SCHEDULE_PRESETS[id].label}
                </ToggleButton>
              );
            })}
          </div>
        </div>

        <div>
          <div className={cn('mb-1.5', FLOW_METER_LABEL_CLASS)}>Or click the days you review</div>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Review days">
            {DAYS.map((day) => {
              const isOn = reviewDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={isOn}
                  aria-label={`Day ${day}`}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    'size-8 border font-mono text-[11px] tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500',
                    isOn
                      ? 'border-red-500 bg-red-500/20 text-red-300'
                      : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300 ',
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <div className={cn('mb-0.5', FLOW_METER_LABEL_CLASS)}>Average recall</div>
            <AnimatedNumber
              value={result.averageRecall * 100}
              format={formatPercent}
              className="font-mono text-lg font-bold tabular-nums text-red-400"
            />
          </div>
          <div>
            <div className={cn('mb-0.5', FLOW_METER_LABEL_CLASS)}>Recall at day {CURVE_MODEL.days}</div>
            <AnimatedNumber
              value={result.recallAtEnd * 100}
              format={formatPercent}
              className="font-mono text-lg font-bold tabular-nums text-neutral-100"
            />
          </div>
          <div>
            <div className={cn('mb-0.5', FLOW_METER_LABEL_CLASS)}>Reviews</div>
            <AnimatedNumber
              value={reviewDays.length}
              format={formatCount}
              className="font-mono text-lg font-bold tabular-nums text-neutral-100"
            />
          </div>
        </div>

        <ForgettingCurveChart result={result} />

        <div className="text-xs leading-relaxed text-neutral-500">
          Illustrative model, not measured data. Recall falls as exp(-t / S), where t is days since the last review
          and S is the memory's stability: the larger it is, the slower recall falls. Each review grows S, more when
          you had forgotten more, up to a cap. Average recall covers days 0 to {CURVE_MODEL.days}, so reviews packed
          into the last few days cannot fake it.
        </div>
      </div>
    </WidgetFrame>
  );
};

export default ForgettingCurveSimulator;
