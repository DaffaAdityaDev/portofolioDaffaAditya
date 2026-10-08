import type { FlowStep } from '@/features/Blog/flow/types';

export type CacheNodeId = 'viewers' | 'apiA' | 'apiB' | 'cache' | 'db' | 'upload';

export type CacheEdgeId =
  | 'viewers-apiA'
  | 'viewers-apiB'
  | 'apiA-cache'
  | 'apiB-cache'
  | 'apiA-db'
  | 'apiB-db'
  | 'upload-db'
  | 'upload-apiB';

export type CacheScenarioId = 'aside' | 'edit' | 'hot' | 'down';

export interface CacheStep extends FlowStep {
  activeNodes: CacheNodeId[];
  activeEdges: CacheEdgeId[];
  labels?: Partial<Record<CacheNodeId, string>>;
}
