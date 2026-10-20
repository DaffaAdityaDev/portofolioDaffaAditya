import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { CdnResult, StreamEdgeId, StreamNodeId } from './types';

/** The resolutions the player can switch between, lowest first. */
export const STREAM_QUALITIES = ['360p', '480p', '720p', '1080p'] as const;
export const STREAM_BUFFER_MAX_SECONDS = 30;
/** Below this much buffer the player is close to stalling. */
export const STREAM_BUFFER_LOW_SECONDS = 6;
/** Quality index meaning "playback has not started". */
export const STREAM_NO_QUALITY = -1;

export const STREAM_NODES: Record<StreamNodeId, FlowNodeLayout> = {
  client: { x: 10, y: 134, label: 'Client', caption: 'the player' },
  lb: { x: 190, y: 34, label: 'Load balancer', caption: 'entry point' },
  api: { x: 370, y: 34, label: 'API servers', caption: 'token + metadata' },
  cache: { x: 570, y: 34, label: 'Metadata cache', caption: 'hot metadata' },
  db: { x: 570, y: 134, label: 'Metadata DB', caption: 'source of truth' },
  cdn: { x: 190, y: 234, label: 'Edge cache', caption: 'delivery, near viewer' },
  storage: { x: 570, y: 234, label: 'Video storage', caption: 'processed videos' },
};

export const STREAM_EDGES: Record<StreamEdgeId, FlowEdgeLayout> = {
  'client-lb': { path: 'M122,150 C156,150 156,60 190,60' },
  'lb-api': { path: 'M302,60 H370' },
  'api-cache': { path: 'M482,60 H570' },
  'api-db': { path: 'M482,76 C530,90 540,160 570,160' },
  'client-cdn': { path: 'M80,186 C80,230 130,262 190,262' },
  'cdn-client': { path: 'M190,246 C120,246 100,220 100,186' },
  'cdn-storage': { path: 'M302,252 H570' },
  'storage-cdn': { path: 'M570,274 H302' },
};

export const STREAM_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 306, y: 52, text: 'play request' },
  { x: 8, y: 214, text: 'segments' },
  { x: 380, y: 244, text: 'only on a miss' },
  { x: 380, y: 290, text: 'streams and saves' },
];

export const CDN_RESULT_LABELS: Record<CdnResult, string> = {
  hit: 'Hit',
  miss: 'Miss',
  collapsed: 'Collapsed',
};
