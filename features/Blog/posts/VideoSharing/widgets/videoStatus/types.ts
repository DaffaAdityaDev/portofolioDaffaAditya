import type { FlowStep } from '@/features/Blog/flow/types';

export type StatusNodeId = 'uploading' | 'processing' | 'ready' | 'removed' | 'expired' | 'failed';

export type StatusEdgeId =
  | 'uploading-processing'
  | 'processing-ready'
  | 'ready-removed'
  | 'uploading-expired'
  | 'processing-failed'
  | 'failed-processing';

export type StatusScenarioId = 'normal' | 'race' | 'abandoned' | 'failedRetry' | 'removed';

export interface StatusStep extends FlowStep {
  activeNodes: StatusNodeId[];
  activeEdges: StatusEdgeId[];
  labels?: Partial<Record<StatusNodeId, string>>;
}
