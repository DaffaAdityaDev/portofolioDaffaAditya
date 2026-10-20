import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { LbEdgeId, LbNodeId } from './types';

export const LB_NODES: Record<LbNodeId, FlowNodeLayout> = {
  clients: { x: 10, y: 134, label: 'Clients', caption: 'apps, browsers' },
  lbA: { x: 220, y: 54, label: 'Balancer A', caption: 'layer 7' },
  lbB: { x: 220, y: 214, label: 'Balancer B', caption: 'same address' },
  api1: { x: 560, y: 14, label: 'API server 1', caption: 'healthy' },
  api2: { x: 560, y: 94, label: 'API server 2', caption: 'healthy' },
  api3: { x: 560, y: 174, label: 'API server 3', caption: 'healthy' },
  upload: { x: 560, y: 254, label: 'Upload service', caption: 'own fleet' },
};

// Every balancer can reach every server; the arrows fan out from each one.
export const LB_EDGES: Record<LbEdgeId, FlowEdgeLayout> = {
  'clients-lbA': { path: 'M122,150 C170,150 170,80 220,80' },
  'clients-lbB': { path: 'M122,170 C170,170 170,240 220,240' },
  'lbA-api1': { path: 'M332,70 C450,70 450,36 560,36' },
  'lbA-api2': { path: 'M332,78 C450,78 450,116 560,116' },
  'lbA-api3': { path: 'M332,86 C450,86 450,196 560,196' },
  'lbA-upload': { path: 'M332,94 C440,94 450,276 560,276' },
  'lbB-api1': { path: 'M332,226 C450,226 450,46 560,46' },
  'lbB-api2': { path: 'M332,234 C450,234 450,126 560,126' },
  'lbB-api3': { path: 'M332,242 C450,242 450,206 560,206' },
  'lbB-upload': { path: 'M332,250 C450,250 450,286 560,286' },
};

export const LB_EDGE_LABELS: FlowEdgeLabel[] = [{ x: 132, y: 128, text: 'one address' }];
