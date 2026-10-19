import type { AgentLoad } from '@/features/Blog/posts/EchoAgentService/widgets/capacity/types';

export const SECONDS_PER_HOUR = 3_600;
export const SECONDS_PER_MINUTE = 60;
/** The gateway writes a streaming answer to Postgres this often. */
export const FLUSH_INTERVAL_SECONDS = 2;
/** Spare capacity kept on the agent tier, so one replica can die without a queue forming. */
export const REPLICA_HEADROOM = 1.5;
/** Sizing floor for this estimate: two agent replicas, so one can die without stopping chat. */
export const MIN_AGENT_REPLICAS = 2;

export const DEFAULT_LOAD: AgentLoad = {
  peakUsers: 2_000,
  missionsPerUserPerHour: 6,
  missionSeconds: 40,
  llmCallsPerMission: 5,
  inputTokensPerCall: 8_000,
  cacheHitShare: 0.7,
  streamsPerReplica: 200,
};

interface SliderLimit {
  min: number;
  max: number;
  step: number;
}

export const LOAD_LIMITS: Record<keyof AgentLoad, SliderLimit> = {
  peakUsers: { min: 100, max: 50_000, step: 100 },
  missionsPerUserPerHour: { min: 1, max: 30, step: 1 },
  missionSeconds: { min: 5, max: 300, step: 5 },
  llmCallsPerMission: { min: 1, max: 15, step: 1 },
  inputTokensPerCall: { min: 1_000, max: 64_000, step: 1_000 },
  cacheHitShare: { min: 0, max: 0.95, step: 0.05 },
  streamsPerReplica: { min: 25, max: 1_000, step: 25 },
};
