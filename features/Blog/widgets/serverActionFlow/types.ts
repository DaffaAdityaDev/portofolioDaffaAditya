import type { FlowStep } from '@/features/Blog/flow/types';

export type ActionNodeId = 'browser' | 'clientJs' | 'server' | 'db' | 'cache';

export type ActionEdgeId =
  | 'browser-clientJs'
  | 'clientJs-server'
  | 'browser-server'
  | 'server-db'
  | 'server-cache';

export type ActionScenarioId = 'apiRoute' | 'action' | 'noJs' | 'noAuth';

export interface ActionStep extends FlowStep {
  activeNodes: ActionNodeId[];
  activeEdges: ActionEdgeId[];
  labels?: Partial<Record<ActionNodeId, string>>;
}
