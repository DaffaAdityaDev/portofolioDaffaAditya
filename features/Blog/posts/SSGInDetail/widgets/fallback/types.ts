import type { FlowStep } from '@/features/Blog/flow/types';

export type FallbackNodeId = 'visitorA' | 'visitorB' | 'server' | 'cache' | 'cms';

export type FallbackEdgeId = 'a-server' | 'server-a' | 'b-server' | 'server-b' | 'server-cache' | 'server-cms';

export type FallbackScenarioId = 'false' | 'true' | 'blocking';

export interface FallbackStep extends FlowStep {
  activeNodes: FallbackNodeId[];
  activeEdges: FallbackEdgeId[];
  labels?: Partial<Record<FallbackNodeId, string>>;
}
