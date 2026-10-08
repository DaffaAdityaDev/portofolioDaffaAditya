import React from 'react';
import { cn } from '@/utils/cn';
import { clamp } from '@/utils/math';
import type { SimSample } from '@/features/Blog/posts/VideoSharing/widgets/capacity/types';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { SIM } from '../constants';
import { CHART } from '../diagram';

const stepX = CHART.width / (SIM.historyLength - 1);

/** Points for a polyline, newest sample pinned to the right edge. */
function toPoints(history: SimSample[], valueOf: (sample: SimSample) => number): string {
  return history
    .map((sample, index) => {
      const x = CHART.width - (history.length - 1 - index) * stepX;
      const y = CHART.height - clamp(valueOf(sample), 0, 1) * CHART.height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

/** Last minute of traffic and of the busiest component's load. */
const SimulationChart: React.FC<{ history: SimSample[] }> = ({ history }) => {
  const thresholdY = CHART.height - CHART.height / CHART.maxLoad;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        role="img"
        aria-label="Chart of traffic and of the busiest component's load over the last minute"
        className="block h-auto w-full border border-neutral-800 bg-[#0a0a0a]"
      >
        <line
          x1={0}
          x2={CHART.width}
          y1={thresholdY}
          y2={thresholdY}
          stroke={CHART.thresholdColor}
          strokeDasharray="4 4"
        />
        <text x={4} y={thresholdY - 4} fontSize={9} className="fill-neutral-600 font-mono">
          100% = limit
        </text>
        {history.length > 1 && (
          <>
            <polyline
              points={toPoints(history, (s) => s.multiplier / SIM.maxMultiplier)}
              fill="none"
              stroke={CHART.trafficColor}
              strokeWidth={1.5}
            />
            <polyline
              points={toPoints(history, (s) => s.worstLoad / CHART.maxLoad)}
              fill="none"
              stroke={CHART.loadColor}
              strokeWidth={2}
            />
          </>
        )}
      </svg>
      <figcaption className={cn('mt-1 flex gap-4', FLOW_METER_LABEL_CLASS)}>
        <span>
          <span className="text-neutral-400">&#9632;</span> Traffic
        </span>
        <span>
          <span className="text-red-500">&#9632;</span> Busiest component
        </span>
      </figcaption>
    </figure>
  );
};

export default SimulationChart;
