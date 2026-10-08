import React from 'react';
import { cn } from '@/utils/cn';
import type { PartTiming, PprResponse } from '@/features/Blog/posts/Nextjs14Improvement/widgets/pprTimeline/types';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { TIMELINE_MAX_MS, TIMELINE_TICKS } from '../constants';

const percent = (ms: number): string => `${(Math.min(ms, TIMELINE_MAX_MS) / TIMELINE_MAX_MS) * 100}%`;

const ROWS: { key: 'shell' | 'cart' | 'products'; label: string }[] = [
  { key: 'shell', label: 'Shell' },
  { key: 'cart', label: 'Cart' },
  { key: 'products', label: 'Products' },
];

/**
 * One row: a grey bar while the part waits, and a marker when it appears.
 * Red for the first paint, light for a personal part, dark for the rest.
 */
const Row: React.FC<{ label: string; part: PartTiming; isFirstPaint: boolean }> = ({ label, part, isFirstPaint }) => (
  <div className="flex items-center gap-3">
    <div className={cn('w-16 shrink-0', FLOW_METER_LABEL_CLASS)}>{label}</div>
    <div
      className="relative h-4 flex-1 bg-neutral-900"
      role="img"
      aria-label={`${label} appears at ${Math.round(part.at)} ms`}
    >
      <div className="absolute inset-y-1 left-0 bg-neutral-700/60" style={{ width: percent(part.at) }} />
      <div
        className={cn(
          'absolute top-0 h-4 w-1 -translate-x-1/2',
          isFirstPaint ? 'bg-red-500' : part.isPersonal ? 'bg-neutral-200' : 'bg-neutral-600',
        )}
        style={{ left: percent(part.at) }}
      />
    </div>
  </div>
);

interface TimelineChartProps {
  response: PprResponse;
  clockMs: number | null;
}

/** When each part appears on one shared time axis, with a playhead during a replay. */
const TimelineChart: React.FC<TimelineChartProps> = ({ response, clockMs }) => {
  // Only one row gets the first-paint mark, even when several parts arrive together.
  const firstPaintKey = ROWS.find((row) => response[row.key].at === response.firstContentMs)?.key;

  return (
    <div className="flex flex-col gap-2">
      {ROWS.map((row) => (
        <Row key={row.key} label={row.label} part={response[row.key]} isFirstPaint={row.key === firstPaintKey} />
      ))}

      <div className="flex items-start gap-3" aria-hidden="true">
        <div className="w-16 shrink-0" />
        <div className="relative h-4 flex-1">
          {TIMELINE_TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute -translate-x-1/2 font-mono text-[9px] text-neutral-400"
              style={{ left: percent(tick) }}
            >
              {tick === 0 ? '0' : `${tick / 1000}s`}
            </span>
          ))}
          {clockMs !== null && (
            <div
              className="pointer-events-none absolute -top-[72px] h-[72px] w-px bg-red-500/70"
              style={{ left: percent(clockMs) }}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineChart;
