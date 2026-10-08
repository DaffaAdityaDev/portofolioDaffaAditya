import type { FlowStep } from '@/features/Blog/flow/types';

export type StreamNodeId = 'client' | 'lb' | 'api' | 'cache' | 'db' | 'cdn' | 'storage';

export type StreamEdgeId =
  | 'client-lb'
  | 'lb-api'
  | 'api-cache'
  | 'api-db'
  | 'client-cdn'
  | 'cdn-client'
  | 'cdn-storage'
  | 'storage-cdn';

export type StreamScenarioId = 'hit' | 'miss' | 'slow' | 'edgeFails';

/** What the CDN edge answered for the segments a step asked for. */
export type CdnResult = 'hit' | 'miss' | 'collapsed';

export interface StreamStep extends FlowStep {
  activeNodes: StreamNodeId[];
  activeEdges: StreamEdgeId[];
  labels?: Partial<Record<StreamNodeId, string>>;
  /** Index into the quality ladder, or -1 before playback starts. */
  quality: number;
  /** Seconds of video buffered ahead of the playhead. */
  bufferSeconds: number;
  cdn?: CdnResult;
}
