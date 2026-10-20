import type { SequenceLane, SequenceLegendEntry, SequenceStep } from '@/features/Blog/sequence/types';
import type { StreamLaneId } from './types';

export const STREAM_LANES: Record<StreamLaneId, SequenceLane> = {
  player: { label: 'Player', caption: 'app or browser', x: 130 },
  api: { label: 'API servers', caption: 'access + token', x: 310 },
  cache: { label: 'Metadata cache', caption: 'DB on a miss', x: 470 },
  edge: { label: 'Edge cache', caption: 'near the viewer', x: 630 },
  storage: { label: 'Video storage', caption: 'origin', x: 790 },
};

export const STREAM_SEQUENCE_STEPS: SequenceStep<StreamLaneId>[] = [
  {
    number: 1,
    title: 'Ask the API for playback',
    messages: [
      { from: 'player', to: 'api', kind: 'call', text: 'GET /videos/v_42/playback + access token' },
      { from: 'api', to: 'cache', kind: 'call', text: 'get v_42: status, renditions' },
      { from: 'cache', to: 'api', kind: 'reply', text: 'ready, 4 renditions' },
      { from: 'api', to: 'player', kind: 'reply', text: 'manifestUrl, fallbackEdges, playbackToken' },
    ],
  },
  {
    number: 2,
    title: 'Fetch the manifest, the edge checks the token itself',
    messages: [
      { from: 'player', to: 'edge', kind: 'call', text: 'GET v_42/master.m3u8 + playback token' },
      { from: 'edge', to: 'player', kind: 'reply', text: 'resolutions + segment list' },
    ],
  },
  {
    number: 3,
    title: 'Stream the segments, quality follows the bandwidth',
    messages: [
      { from: 'player', to: 'edge', kind: 'call', text: 'GET 720p/seg_001.ts, seg_002.ts …' },
      { from: 'edge', to: 'storage', kind: 'call', text: 'only on a miss' },
      { from: 'storage', to: 'edge', kind: 'bytes', text: 'segment, saved' },
      { from: 'edge', to: 'player', kind: 'bytes', text: 'segments, straight from the edge' },
    ],
  },
  {
    number: 4,
    title: 'Refresh the token before it expires',
    messages: [
      { from: 'player', to: 'api', kind: 'call', text: 'GET /videos/v_42/playback again' },
      { from: 'api', to: 'player', kind: 'reply', text: 'new token, or 403 if now private' },
    ],
  },
];

export const STREAM_SEQUENCE_LEGEND: SequenceLegendEntry[] = [
  { kind: 'call', text: 'request' },
  { kind: 'reply', text: 'answer' },
  { kind: 'bytes', text: 'video bytes, never through the API' },
];
