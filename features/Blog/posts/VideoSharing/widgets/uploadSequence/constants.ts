import type { SequenceLane, SequenceLegendEntry, SequenceStep } from '@/features/Blog/sequence/types';
import type { UploadLaneId } from './types';

export const UPLOAD_LANES: Record<UploadLaneId, SequenceLane> = {
  client: { label: 'Client', caption: 'app or browser', x: 130 },
  upload: { label: 'Upload service', caption: 'small requests', x: 290 },
  db: { label: 'Metadata DB', caption: 'videos schema', x: 450 },
  storage: { label: 'Video storage', caption: 'raw + processed', x: 610 },
  broker: { label: 'Message broker', caption: 'tasks + events', x: 760 },
  transcoders: { label: 'Transcoders', caption: 'GPU workers', x: 890 },
};

export const UPLOAD_SEQUENCE_STEPS: SequenceStep<UploadLaneId>[] = [
  {
    number: 1,
    title: 'Create the upload',
    messages: [
      { from: 'client', to: 'upload', kind: 'call', text: 'POST /uploads: token, idempotency key, size' },
      { from: 'upload', to: 'db', kind: 'call', text: 'check quota, insert upload "uploading"' },
      { from: 'upload', to: 'client', kind: 'reply', text: 'uploadId + one signed URL per chunk' },
    ],
  },
  {
    number: 2,
    title: 'Send the chunks straight to storage',
    messages: [
      { from: 'client', to: 'storage', kind: 'bytes', text: 'PUT chunk 1 … 8, the video bytes' },
      { from: 'storage', to: 'client', kind: 'reply', text: '200 per chunk' },
    ],
  },
  {
    number: 3,
    title: 'Hint that it is done',
    messages: [{ from: 'client', to: 'upload', kind: 'call', text: 'POST /uploads/{id}/complete' }],
  },
  {
    number: 4,
    title: 'The upload service finishes the file',
    messages: [
      { from: 'upload', to: 'storage', kind: 'call', text: 'list parts, complete multipart' },
      { from: 'upload', to: 'db', kind: 'call', text: 'status "processing", 18 tasks' },
      { from: 'upload', to: 'broker', kind: 'call', text: 'publish 18 transcode tasks' },
    ],
  },
  {
    number: 5,
    title: 'Transcode',
    messages: [
      { from: 'transcoders', to: 'broker', kind: 'call', text: 'pull a task' },
      { from: 'transcoders', to: 'storage', kind: 'bytes', text: 'read raw range, write segment' },
      { from: 'transcoders', to: 'broker', kind: 'call', text: 'publish done, ack' },
    ],
  },
  {
    number: 6,
    title: 'Report back through the broker',
    messages: [
      { from: 'upload', to: 'broker', kind: 'call', text: 'pull transcode.done' },
      { from: 'upload', to: 'db', kind: 'call', text: 'task row + count, once per task' },
      { from: 'upload', to: 'storage', kind: 'call', text: 'at 18 of 18: write manifests' },
      { from: 'upload', to: 'db', kind: 'call', text: 'status "ready"' },
      { from: 'upload', to: 'broker', kind: 'call', text: 'publish video.ready' },
    ],
  },
];

export const UPLOAD_SEQUENCE_LEGEND: SequenceLegendEntry[] = [
  { kind: 'call', text: 'request' },
  { kind: 'reply', text: 'answer' },
  { kind: 'bytes', text: 'video bytes, never through the upload service' },
];
