import type { FlowStep } from '@/features/Blog/flow/types';

export type MapNodeId = 'clients' | 'gateway' | 'agent' | 'llm' | 'tools' | 'redis' | 'postgres';

export type MapEdgeId =
  | 'clients-gateway'
  | 'gateway-clients'
  | 'gateway-agent'
  | 'agent-gateway'
  | 'gateway-redis'
  | 'gateway-postgres'
  | 'agent-llm'
  | 'agent-tools';

export type MapScenarioId = 'turn' | 'memory' | 'stop';

export interface MapStep extends FlowStep {
  activeNodes: MapNodeId[];
  activeEdges: MapEdgeId[];
  labels?: Partial<Record<MapNodeId, string>>;
}
