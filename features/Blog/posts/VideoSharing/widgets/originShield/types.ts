import type { FlowStep } from '@/features/Blog/flow/types';

export type ShieldNodeId = 'viewersA' | 'viewersB' | 'edgeA' | 'edgeB' | 'shield' | 'origin';

export type ShieldEdgeId =
  | 'viewersA-edgeA'
  | 'viewersB-edgeB'
  | 'edgeA-shield'
  | 'edgeB-shield'
  | 'shield-origin'
  | 'edgeA-origin'
  | 'edgeB-origin';

export type ShieldScenarioId = 'none' | 'collapse' | 'shield' | 'expiry' | 'prewarm';

export interface ShieldStep extends FlowStep {
  activeNodes: ShieldNodeId[];
  activeEdges: ShieldEdgeId[];
  labels?: Partial<Record<ShieldNodeId, string>>;
  /** Requests for segment 1 that reached the origin so far, or null before any were sent. */
  originRequests: number | null;
}
