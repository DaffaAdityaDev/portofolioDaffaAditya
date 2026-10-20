import type { AgentEstimates, AgentLoad } from '../types';
import {
  FLUSH_INTERVAL_SECONDS,
  MIN_AGENT_REPLICAS,
  REPLICA_HEADROOM,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
} from '../constants';

/** Little's law for the open streams, then the per-call token traffic they create. */
export function estimateAgentLoad(load: AgentLoad): AgentEstimates {
  const missionsPerSecond = (load.peakUsers * load.missionsPerUserPerHour) / SECONDS_PER_HOUR;
  const concurrentMissions = missionsPerSecond * load.missionSeconds;
  const agentReplicas = Math.max(MIN_AGENT_REPLICAS, Math.ceil((concurrentMissions * REPLICA_HEADROOM) / load.streamsPerReplica));
  const llmCallsPerMinute = missionsPerSecond * load.llmCallsPerMission * SECONDS_PER_MINUTE;
  const inputTokensPerMinute = llmCallsPerMinute * load.inputTokensPerCall;

  return {
    missionsPerSecond,
    concurrentMissions,
    agentReplicas,
    llmCallsPerMinute,
    inputTokensPerMinute,
    uncachedTokensPerMinute: inputTokensPerMinute * (1 - load.cacheHitShare),
    flushWritesPerSecond: concurrentMissions / FLUSH_INTERVAL_SECONDS,
  };
}

const COMPACT = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

export const formatCompact = (value: number): string => COMPACT.format(Math.round(value));

export const formatRate = (value: number): string =>
  value < 10 ? value.toFixed(1) : formatCompact(value);
