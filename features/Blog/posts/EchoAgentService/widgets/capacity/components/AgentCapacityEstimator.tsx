import React, { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import type { AgentLoad } from '@/features/Blog/posts/EchoAgentService/widgets/capacity/types';
import ResultTile from '@/features/Blog/components/ResultTile';
import SliderField from '@/features/Blog/components/SliderField';
import WidgetFrame from '@/features/Blog/components/WidgetFrame';
import { DEFAULT_LOAD, FLUSH_INTERVAL_SECONDS, LOAD_LIMITS, MIN_AGENT_REPLICAS, REPLICA_HEADROOM } from '../constants';
import { estimateAgentLoad, formatCompact, formatRate } from '../utils/estimate';

interface LoadField {
  key: keyof AgentLoad;
  label: string;
  format?: (value: number) => string;
}

const LOAD_FIELDS: LoadField[] = [
  { key: 'peakUsers', label: 'Users chatting at peak', format: formatCompact },
  { key: 'missionsPerUserPerHour', label: 'Messages / user / hour' },
  { key: 'missionSeconds', label: 'Mission length', format: (v) => `${v} s` },
  { key: 'llmCallsPerMission', label: 'Model calls / mission' },
  { key: 'inputTokensPerCall', label: 'Input tokens / call', format: formatCompact },
  { key: 'cacheHitShare', label: 'Prompt cache hits', format: (v) => `${Math.round(v * 100)}%` },
  { key: 'streamsPerReplica', label: 'Streams / agent replica' },
];

/** Sliders for the traffic an agent service sees, with the capacity each tier needs. */
const AgentCapacityEstimator: React.FC = () => {
  const [load, setLoad] = useState<AgentLoad>(DEFAULT_LOAD);
  const estimates = useMemo(() => estimateAgentLoad(load), [load]);

  return (
    <WidgetFrame title="Agent capacity estimator" icon={Calculator}>
      <div className="grid gap-6 p-4 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          {LOAD_FIELDS.map(({ key, label, format }) => (
            <SliderField
              key={key}
              label={label}
              value={load[key]}
              format={format}
              onChange={(value) => setLoad((current) => ({ ...current, [key]: value }))}
              {...LOAD_LIMITS[key]}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 content-start gap-3">
          <ResultTile
            label="Missions / second"
            value={estimates.missionsPerSecond}
            format={formatRate}
            hint="New chat turns arriving at the gateway"
          />
          <ResultTile
            label="Open streams"
            value={estimates.concurrentMissions}
            format={formatCompact}
            hint="Arrival rate × mission length (Little's law)"
          />
          <ResultTile
            label="Agent replicas"
            value={estimates.agentReplicas}
            format={formatCompact}
            hint={`With ${REPLICA_HEADROOM}× headroom, and never fewer than ${MIN_AGENT_REPLICAS}`}
          />
          <ResultTile
            label="DB flushes / second"
            value={estimates.flushWritesPerSecond}
            format={formatRate}
            hint={`Up to one UPDATE per open stream every ${FLUSH_INTERVAL_SECONDS} s, rewriting the answer so far`}
          />
          <ResultTile
            label="Model calls / minute"
            value={estimates.llmCallsPerMinute}
            format={formatCompact}
            hint="Compare with the provider's request limit"
          />
          <ResultTile
            label="Uncached tokens / min"
            value={estimates.uncachedTokensPerMinute}
            format={formatCompact}
            hint={`Of ${formatCompact(estimates.inputTokensPerMinute)} input tokens a minute`}
            accent
          />
        </div>
      </div>

      <div className="border-t border-neutral-800 px-4 py-2 text-xs text-neutral-500">
        The defaults are assumptions for this post, not measurements. Push the users up and watch which number outgrows its limit first.
      </div>
    </WidgetFrame>
  );
};

export default AgentCapacityEstimator;
