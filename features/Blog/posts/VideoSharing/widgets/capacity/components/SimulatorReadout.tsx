import React from 'react';
import { cn } from '@/utils/cn';
import AnimatedNumber from '@/features/Blog/components/AnimatedNumber';
import { BOTTLENECK_COPY } from '../copy';
import { STATUS_COLORS, SUCCESS_THRESHOLDS } from '../constants';
import { NODE_LAYOUT } from '../diagram';
import { useVideoDesign } from '../hooks/useVideoDesign';
import { formatDuration, formatMultiplier, formatUsd } from '../utils/format';
import SimulationChart from './SimulationChart';

interface StatProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const Stat: React.FC<StatProps> = ({ label, children, className }) => (
  <div className="border border-neutral-800 bg-[#0a0a0a] p-3">
    <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{label}</div>
    <div className={cn('text-xl font-black tabular-nums text-white', className)}>{children}</div>
  </div>
);

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
        <Stat label="Playback success">
          <span style={{ color: successColor(flows.successRate) }}>
            <AnimatedNumber value={flows.successRate} format={formatSuccess} />
          </span>
        </Stat>
        <Stat label="Traffic now">
          <AnimatedNumber value={sim.multiplier} format={formatMultiplier} />
        </Stat>
        <Stat label="Upload wait">
          <AnimatedNumber value={flows.queueDelaySeconds} format={formatDuration} />
        </Stat>
        <Stat label="Bandwidth bill / hour">
          <AnimatedNumber value={flows.egressCostPerHourUsd} format={formatUsd} />
        </Stat>
        <div
          className="col-span-2 border bg-[#0a0a0a] p-3"
          style={{ borderColor: STATUS_COLORS[bottleneck.severity] }}
          role="status"
          aria-live="polite"
        >
          <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">
            {bottleneck.nodeId ? `Bottleneck: ${NODE_LAYOUT[bottleneck.nodeId].label}` : 'Status'}
            {bottleneck.nodeId && ` (${metrics[bottleneck.nodeId].headline})`}
          </div>
          <div className="mt-1 font-bold text-white">{copy.title}</div>
          <div className="mt-1 text-sm leading-relaxed text-neutral-400">{copy.body}</div>
          <div className="mt-2 text-sm leading-relaxed text-neutral-300">
            <span className="font-mono text-[11px] uppercase tracking-wider text-red-500">Try: </span>
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
