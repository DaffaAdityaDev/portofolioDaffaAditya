import type { FlowStep } from '@/features/Blog/flow/types';

export type DeployNodeId = 'dev' | 'ci' | 'registry' | 'argo' | 'stable' | 'canary' | 'metrics';

export type DeployEdgeId =
  | 'dev-ci'
  | 'ci-registry'
  | 'ci-argo'
  | 'registry-stable'
  | 'registry-canary'
  | 'argo-stable'
  | 'argo-canary'
  | 'canary-metrics'
  | 'metrics-argo';

export type DeployScenarioId = 'success' | 'ciFail' | 'badCanary' | 'rollback' | 'argoDown';

export interface DeployStep extends FlowStep {
  activeNodes: DeployNodeId[];
  activeEdges: DeployEdgeId[];
  labels?: Partial<Record<DeployNodeId, string>>;
}
