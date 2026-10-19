export interface AgentLoad {
  /** Users chatting at the busiest hour. */
  peakUsers: number;
  missionsPerUserPerHour: number;
  /** Seconds from the first byte to turn_complete. */
  missionSeconds: number;
  /** Model calls per mission: one per loop iteration. */
  llmCallsPerMission: number;
  /** Input tokens per model call, with history and tool results. */
  inputTokensPerCall: number;
  /** Share of input tokens served from the provider's prompt cache, 0..1. */
  cacheHitShare: number;
  /** Open mission streams one agent replica holds comfortably. */
  streamsPerReplica: number;
}

export interface AgentEstimates {
  missionsPerSecond: number;
  concurrentMissions: number;
  agentReplicas: number;
  llmCallsPerMinute: number;
  inputTokensPerMinute: number;
  uncachedTokensPerMinute: number;
  flushWritesPerSecond: number;
}
