import React from 'react';
import AnimatedNumber from '@/features/Blog/components/AnimatedNumber';
import ResultTile from '@/features/Blog/components/ResultTile';
import { BOTTLENECK_COPY } from '../constants/copy';
import { STATUS_COLORS, SUCCESS_THRESHOLDS } from '../constants';
import { NODE_LAYOUT } from '../constants/diagram';
import { useVideoDesign } from '../hooks/useVideoDesign';
import { formatDuration, formatMultiplier, formatUsd } from '../utils/format';
import SimulationChart from './SimulationChart';

const formatSuccess = (value: number): string => `${(value * 100).toFixed(value >= 0.995 ? 0 : 1)}%`;

function successColor(rate: number): string {
  if (rate >= SUCCESS_THRESHOLDS.good) return STATUS_COLORS.ok;
  if (rate >= SUCCESS_THRESHOLDS.degraded) return STATUS_COLORS.warn;
  return STATUS_COLORS.critical;
}

/** Headline numbers, a plain-language diagnosis, and the recent history. */
const SimulatorReadout: React.FC = () => {
  const { flows, sim, bottleneck, metrics } = useVideoDesign();
  const copy = BOTTLENECK_COPY[bottleneck.key];

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="grid grid-cols-2 gap-3 lg:col-span-3">
        <ResultTile label="Playback success" className="text-xl">
          <span style={{ color: successColor(flows.successRate) }}>
            <AnimatedNumber value={flows.successRate} format={formatSuccess} />
          </span>
        </ResultTile>
        <ResultTile label="Traffic now" value={sim.multiplier} format={formatMultiplier} className="text-xl" />
        <ResultTile label="Upload wait" value={flows.queueDelaySeconds} format={formatDuration} className="text-xl" />
        <ResultTile
          label="Bandwidth bill / hour"
          value={flows.egressCostPerHourUsd}
          format={formatUsd}
          className="text-xl"
        />
        <div
          className="col-span-2 rounded-lg border bg-background p-3"
          style={{ borderColor: STATUS_COLORS[bottleneck.severity] }}
          role="status"
          aria-live="polite"
        >
          <div className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            {bottleneck.nodeId ? `Bottleneck: ${NODE_LAYOUT[bottleneck.nodeId].label}` : 'Status'}
            {bottleneck.nodeId && ` (${metrics[bottleneck.nodeId].headline})`}
          </div>
          <div className="mt-1 font-bold text-white">{copy.title}</div>
          <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy.body}</div>
          <div className="mt-2 text-sm leading-relaxed text-neutral-300">
            <span className="font-mono text-2xs uppercase tracking-wider text-accent-brand">Try: </span>
            {copy.fix}
          </div>
        </div>
      </div>
      <div className="lg:col-span-2">
        <SimulationChart history={sim.history} />
      </div>
    </div>
  );
};

export default SimulatorReadout;
