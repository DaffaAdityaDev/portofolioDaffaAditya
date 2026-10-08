import type { FlowStep } from '@/features/Blog/flow/types';

export type CountNodeId = 'player' | 'bot' | 'api' | 'stream' | 'aggregator' | 'redis' | 'db';

export type CountEdgeId =
  | 'player-api'
  | 'bot-api'
  | 'api-stream'
  | 'api-db'
  | 'stream-aggregator'
  | 'aggregator-redis'
  | 'aggregator-db';

export type CountScenarioId = 'view' | 'rewatch' | 'like' | 'bot' | 'crash';

export interface CountStep extends FlowStep {
  activeNodes: CountNodeId[];
  activeEdges: CountEdgeId[];
  labels?: Partial<Record<CountNodeId, string>>;
  /** View or like events that reached the stream in this scenario so far. */
  events: number;
  /** How much the public count went up. */
  counted: number;
  /** Writes to the database for counting. */
  dbWrites: number;
}
