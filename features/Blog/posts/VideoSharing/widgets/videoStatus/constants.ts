import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { StatusEdgeId, StatusNodeId } from './types';

// The happy path runs left to right along the middle row; every way out of it drops below.
export const STATUS_NODES: Record<StatusNodeId, FlowNodeLayout> = {
  uploading: { x: 10, y: 104, label: 'uploading', caption: 'chunks arriving' },
  processing: { x: 220, y: 104, label: 'processing', caption: 'transcoding' },
  ready: { x: 430, y: 104, label: 'ready', caption: 'plays' },
  removed: { x: 618, y: 104, label: 'removed', caption: 'not available' },
  expired: { x: 10, y: 244, label: 'expired', caption: 'chunks removed' },
  failed: { x: 220, y: 244, label: 'failed', caption: 'reason stored' },
};

export const STATUS_EDGES: Record<StatusEdgeId, FlowEdgeLayout> = {
  'uploading-processing': { path: 'M122,130 H220' },
  'processing-ready': { path: 'M332,130 H430' },
  'ready-removed': { path: 'M542,130 H618' },
  'uploading-expired': { path: 'M66,156 V244' },
  'processing-failed': { path: 'M256,156 V244' },
  'failed-processing': { path: 'M296,244 V156' },
};

export const STATUS_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 126, y: 96, text: 'all chunks in' },
  { x: 336, y: 96, text: 'all tasks done' },
  { x: 548, y: 96, text: 'deleted' },
  { x: 74, y: 204, text: 'went quiet' },
  { x: 160, y: 204, text: 'retries out' },
  { x: 304, y: 204, text: 'creator retries' },
];
