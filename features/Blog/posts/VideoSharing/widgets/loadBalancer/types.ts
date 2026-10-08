import type { FlowStep } from '@/features/Blog/flow/types';

export type LbNodeId = 'clients' | 'lbA' | 'lbB' | 'api1' | 'api2' | 'api3' | 'upload';

export type LbEdgeId =
  | 'clients-lbA'
  | 'clients-lbB'
  | 'lbA-api1'
  | 'lbA-api2'
  | 'lbA-api3'
  | 'lbA-upload'
  | 'lbB-api1'
  | 'lbB-api2'
  | 'lbB-api3'
  | 'lbB-upload';

export type LbScenarioId = 'route' | 'health' | 'lbDown';

export interface LbStep extends FlowStep {
  activeNodes: LbNodeId[];
  activeEdges: LbEdgeId[];
  labels?: Partial<Record<LbNodeId, string>>;
}
