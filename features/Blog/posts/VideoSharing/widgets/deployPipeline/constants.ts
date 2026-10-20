import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { DeployEdgeId, DeployNodeId } from './types';

export const DEPLOY_NODES: Record<DeployNodeId, FlowNodeLayout> = {
  dev: { x: 10, y: 134, label: 'Developer', caption: 'merges to main' },
  ci: { x: 170, y: 134, label: 'CI pipeline', caption: 'build, test' },
  registry: { x: 330, y: 34, label: 'Registry', caption: 'image per commit' },
  argo: { x: 330, y: 234, label: 'Argo CD', caption: 'syncs from git' },
  stable: { x: 560, y: 34, label: 'Stable pods', caption: 'v41, 100%' },
  canary: { x: 560, y: 134, label: 'Canary pods', caption: 'none' },
  metrics: { x: 560, y: 254, label: 'Prometheus', caption: 'errors, latency' },
};

export const DEPLOY_EDGES: Record<DeployEdgeId, FlowEdgeLayout> = {
  'dev-ci': { path: 'M122,160 H170' },
  'ci-registry': { path: 'M226,134 C226,90 270,60 330,60' },
  'ci-argo': { path: 'M226,186 C226,230 270,260 330,260' },
  'registry-stable': { path: 'M442,50 H560' },
  'registry-canary': { path: 'M442,70 C500,70 500,150 560,150' },
  'argo-stable': { path: 'M442,244 C520,244 500,72 560,72' },
  'argo-canary': { path: 'M442,256 C510,256 510,170 560,170' },
  'canary-metrics': { path: 'M616,186 V254' },
  'metrics-argo': { path: 'M560,280 H442' },
};

export const DEPLOY_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 448, y: 42, text: 'pull image' },
  { x: 624, y: 224, text: 'error rate' },
  { x: 470, y: 296, text: 'verdict' },
];
