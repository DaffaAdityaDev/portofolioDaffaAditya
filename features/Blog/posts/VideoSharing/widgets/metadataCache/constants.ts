import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { CacheEdgeId, CacheNodeId } from './types';

export const CACHE_NODES: Record<CacheNodeId, FlowNodeLayout> = {
  viewers: { x: 10, y: 134, label: 'Viewers', caption: 'watch pages' },
  apiA: { x: 190, y: 44, label: 'API server A', caption: 'cache-aside' },
  apiB: { x: 190, y: 224, label: 'API server B', caption: 'cache-aside' },
  cache: { x: 400, y: 134, label: 'Redis', caption: 'hot metadata' },
  db: { x: 618, y: 134, label: 'Metadata DB', caption: 'source of truth' },
  upload: { x: 400, y: 254, label: 'Upload service', caption: 'owns video rows' },
};

// The cache never talks to the database: every arrow to the database starts at an API server.
export const CACHE_EDGES: Record<CacheEdgeId, FlowEdgeLayout> = {
  'viewers-apiA': { path: 'M122,150 C156,150 156,70 190,70' },
  'viewers-apiB': { path: 'M122,170 C156,170 156,250 190,250' },
  'apiA-cache': { path: 'M302,70 C350,70 350,150 400,150' },
  'apiB-cache': { path: 'M302,250 C350,250 350,170 400,170' },
  'apiA-db': { path: 'M302,56 H600 C674,56 674,95 674,134' },
  'apiB-db': { path: 'M302,236 C420,206 560,196 618,176' },
  'upload-db': { path: 'M512,280 C600,280 674,240 674,186' },
  'upload-apiB': { path: 'M400,272 H302' },
};

export const CACHE_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 420, y: 48, text: 'only on a miss' },
  { x: 308, y: 292, text: 'video.updated' },
];
