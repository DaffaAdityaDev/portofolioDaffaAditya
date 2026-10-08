import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { ShieldEdgeId, ShieldNodeId } from '@/features/Blog/posts/VideoSharing/widgets/originShield/types';

export const SHIELD_NODES: Record<ShieldNodeId, FlowNodeLayout> = {
  viewersA: { x: 10, y: 44, label: 'Viewers', caption: 'Jakarta' },
  viewersB: { x: 10, y: 224, label: 'Viewers', caption: 'Surabaya' },
  edgeA: { x: 210, y: 44, label: 'Edge A', caption: 'cache, Jakarta' },
  edgeB: { x: 210, y: 224, label: 'Edge B', caption: 'cache, Surabaya' },
  shield: { x: 420, y: 134, label: 'Shield', caption: 'cache by origin' },
  origin: { x: 618, y: 134, label: 'Origin', caption: 'video storage' },
};

// The direct edge-to-origin routes run along the top and bottom, around the shield.
export const SHIELD_EDGES: Record<ShieldEdgeId, FlowEdgeLayout> = {
  'viewersA-edgeA': { path: 'M122,70 H210' },
  'viewersB-edgeB': { path: 'M122,250 H210' },
  'edgeA-shield': { path: 'M322,80 C380,80 380,150 420,150' },
  'edgeB-shield': { path: 'M322,240 C380,240 380,170 420,170' },
  'shield-origin': { path: 'M532,160 H618' },
  'edgeA-origin': { path: 'M322,56 H600 C674,56 674,95 674,134' },
  'edgeB-origin': { path: 'M322,264 H600 C674,264 674,225 674,186' },
};

export const SHIELD_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 420, y: 48, text: 'no shield: straight to origin' },
  { x: 536, y: 152, text: 'misses only' },
];
