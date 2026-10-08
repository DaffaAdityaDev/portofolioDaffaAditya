import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { LeaseState, TaskEdgeId, TaskNodeId } from '@/features/Blog/posts/VideoSharing/widgets/transcodeTask/types';

/** First attempt plus three retries, then the dead-letter queue. */
export const TASK_MAX_ATTEMPTS = 4;

/** The worker loop, the same five lines as the code block in the post. */
export const TASK_LOOP_STEPS = [
  'pull a task, lease 60 s',
  'run ffmpeg, extend every 20 s',
  'write the segment to storage',
  'publish transcode.done',
  'ack the task',
] as const;

export const TASK_NODES: Record<TaskNodeId, FlowNodeLayout> = {
  storage: { x: 10, y: 134, label: 'Video storage', caption: 'raw + segments' },
  workerA: { x: 210, y: 34, label: 'GPU worker A', caption: 'idle' },
  workerB: { x: 210, y: 234, label: 'GPU worker B', caption: 'idle' },
  broker: { x: 420, y: 134, label: 'Message broker', caption: 'task queue' },
  dlq: { x: 420, y: 254, label: 'Dead letters', caption: 'empty' },
  service: { x: 618, y: 134, label: 'Upload service', caption: 'counts tasks' },
};

// Each worker has one route in and one route out, kept apart so they never cross.
export const TASK_EDGES: Record<TaskEdgeId, FlowEdgeLayout> = {
  'broker-workerA': { path: 'M420,142 C371,142 371,50 322,50' },
  'workerA-broker': { path: 'M322,72 C371,72 371,152 420,152' },
  'workerB-broker': { path: 'M322,256 C371,256 371,162 420,162' },
  'broker-workerB': { path: 'M420,174 C371,174 371,278 322,278' },
  'workerA-storage': { path: 'M240,86 C240,130 170,150 122,150' },
  'workerB-storage': { path: 'M240,234 C240,190 170,170 122,170' },
  'broker-service': { path: 'M532,160 H618' },
  'broker-dlq': { path: 'M476,186 V254' },
  'dlq-service': { path: 'M532,280 C600,280 674,240 674,186' },
};

export const TASK_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 10, y: 124, text: 'write segment' },
  { x: 432, y: 124, text: 'pull, extend, ack' },
  { x: 538, y: 152, text: 'transcode.done' },
  { x: 484, y: 226, text: 'after 4 tries' },
  { x: 604, y: 300, text: 'mark failed' },
];

export const LEASE_LABELS: Record<LeaseState, string> = {
  held: 'Leased',
  expired: 'Expired',
  released: 'Handed back',
  deleted: 'Deleted',
  dead: 'Dead letter',
};
