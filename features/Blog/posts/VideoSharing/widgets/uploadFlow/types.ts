import type { FlowStep } from '@/features/Blog/flow/types';

export type UploadNodeId =
  | 'client'
  | 'db'
  | 'storage'
  | 'broker'
  | 'service'
  | 'workers'
  | 'cdn';

export type UploadEdgeId =
  | 'client-service'
  | 'client-storage'
  | 'broker-service'
  | 'service-db'
  | 'broker-workers'
  | 'workers-broker'
  | 'storage-workers'
  | 'workers-storage'
  | 'storage-cdn'
  | 'service-storage'
  | 'service-broker';

export type VideoStatus = 'uploading' | 'processing' | 'ready' | 'failed' | 'expired';

export type UploadScenarioId =
  | 'happy'
  | 'drop'
  | 'abandoned'
  | 'doubleTap'
  | 'retryWorks'
  | 'givesUp';

export interface UploadStep extends FlowStep {
  activeNodes: UploadNodeId[];
  activeEdges: UploadEdgeId[];
  labels?: Partial<Record<UploadNodeId, string>>;
  status: VideoStatus;
  chunksReceived: number;
  segmentsDone: number;
  /** Zero-based index of a transcoding segment that failed in this step. */
  failedSegment?: number;
}
