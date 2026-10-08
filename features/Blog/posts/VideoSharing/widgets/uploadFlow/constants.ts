import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { UploadEdgeId, UploadNodeId, VideoStatus } from '@/features/Blog/posts/VideoSharing/widgets/uploadFlow/types';

export const UPLOAD_CHUNKS_TOTAL = 8;
export const UPLOAD_SEGMENTS_TOTAL = 6;

export const UPLOAD_NODES: Record<UploadNodeId, FlowNodeLayout> = {
  client: { x: 10, y: 134, label: 'Client', caption: 'phone or browser' },
  db: { x: 410, y: 34, label: 'Metadata DB', caption: 'status' },
  service: { x: 210, y: 34, label: 'Upload service', caption: 'lifecycle owner' },
  broker: { x: 610, y: 134, label: 'Message broker', caption: 'events and jobs' },
  workers: { x: 610, y: 234, label: 'Transcoders', caption: 'GPU workers' },
  storage: { x: 210, y: 234, label: 'Video storage', caption: 'blobs' },
  cdn: { x: 10, y: 234, label: 'Edge cache', caption: 'delivery' },
};

export const UPLOAD_EDGES: Record<UploadEdgeId, FlowEdgeLayout> = {
  'client-service': { path: 'M122,150 C166,150 166,60 210,60' },
  'client-storage': { path: 'M122,172 C170,172 230,190 230,234' },
  'broker-service': { path: 'M610,138 C480,104 360,104 322,80' },
  'service-db': { path: 'M322,60 H410' },
  'broker-workers': { path: 'M650,186 V234' },
  'workers-broker': { path: 'M690,234 V186' },
  'storage-workers': { path: 'M322,254 H610' },
  'workers-storage': { path: 'M610,272 H322' },
  'storage-cdn': { path: 'M210,260 H122' },
  'service-storage': { path: 'M262,86 V234' },
  'service-broker': { path: 'M300,86 C300,160 450,166 610,166' },
};

export const UPLOAD_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 10, y: 214, text: 'signed URL chunks' },
  { x: 470, y: 186, text: 'jobs and events' },
  { x: 268, y: 204, text: 'control calls' },
  { x: 440, y: 249, text: 'read raw' },
  { x: 440, y: 289, text: 'write renditions' },
];

export const VIDEO_STATUS_FLOW: VideoStatus[] = ['uploading', 'processing', 'ready'];

export const VIDEO_STATUS_LABELS: Record<VideoStatus, string> = {
  uploading: 'Uploading',
  processing: 'Processing',
  ready: 'Ready',
  failed: 'Failed',
  expired: 'Expired',
};
