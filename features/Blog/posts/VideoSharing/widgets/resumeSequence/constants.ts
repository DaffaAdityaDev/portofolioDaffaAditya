import type { SequenceLane, SequenceLegendEntry, SequenceStep } from '@/features/Blog/sequence/types';
import type { ResumeLaneId } from './types';

export const RESUME_LANES: Record<ResumeLaneId, SequenceLane> = {
  client: { label: 'Client', caption: 'app or browser', x: 150 },
  upload: { label: 'Upload service', caption: 'small requests', x: 410 },
  storage: { label: 'Video storage', caption: 'holds the chunks', x: 670 },
};

export const RESUME_SEQUENCE_STEPS: SequenceStep<ResumeLaneId>[] = [
  {
    number: 1,
    title: 'Send chunks',
    messages: [
      { from: 'client', to: 'storage', kind: 'bytes', text: 'PUT chunk 1 … 3 to signed URLs' },
      { from: 'storage', to: 'client', kind: 'reply', text: '200 per chunk, checksum ok' },
    ],
  },
  {
    number: 2,
    title: 'The connection drops',
    messages: [{ from: 'client', to: 'storage', kind: 'bytes', text: 'PUT chunk 4: connection lost' }],
  },
  {
    number: 3,
    title: 'Ask what is missing',
    messages: [
      { from: 'client', to: 'upload', kind: 'call', text: 'GET /uploads/{id}/parts' },
      { from: 'upload', to: 'storage', kind: 'call', text: 'list parts' },
      { from: 'storage', to: 'upload', kind: 'reply', text: 'chunks 1–3 held' },
      { from: 'upload', to: 'client', kind: 'reply', text: 'missing 4–8 + fresh URLs' },
    ],
  },
  {
    number: 4,
    title: 'Send only the rest',
    messages: [
      { from: 'client', to: 'storage', kind: 'bytes', text: 'PUT chunk 4 … 8' },
      { from: 'storage', to: 'client', kind: 'reply', text: '200 per chunk' },
    ],
  },
  {
    number: 5,
    title: 'Finish',
    messages: [
      { from: 'client', to: 'upload', kind: 'call', text: 'POST /uploads/{id}/complete' },
      { from: 'upload', to: 'client', kind: 'reply', text: '202, finish hint accepted' },
    ],
  },
];

export const RESUME_SEQUENCE_LEGEND: SequenceLegendEntry[] = [
  { kind: 'call', text: 'request' },
  { kind: 'reply', text: 'answer' },
  { kind: 'bytes', text: 'video bytes, straight to storage' },
];
