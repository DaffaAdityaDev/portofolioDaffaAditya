import type { FlowEdgeLabel, FlowEdgeLayout, FlowNodeLayout } from '@/features/Blog/flow/types';
import type { CountEdgeId, CountNodeId } from '@/features/Blog/posts/VideoSharing/widgets/viewCount/types';

export const COUNT_NODES: Record<CountNodeId, FlowNodeLayout> = {
  player: { x: 10, y: 54, label: 'Player', caption: 'a real viewer' },
  bot: { x: 10, y: 214, label: 'Bot', caption: 'fake views' },
  api: { x: 190, y: 134, label: 'API', caption: 'accepts only' },
  stream: { x: 370, y: 134, label: 'Event stream', caption: 'Kafka' },
  aggregator: { x: 550, y: 134, label: 'Aggregator', caption: 'counts' },
  redis: { x: 550, y: 24, label: 'Redis', caption: 'seen set, counts' },
  db: { x: 550, y: 254, label: 'Metadata DB', caption: 'counter, likes' },
};

export const COUNT_EDGES: Record<CountEdgeId, FlowEdgeLayout> = {
  'player-api': { path: 'M122,80 C160,80 160,150 190,150' },
  'bot-api': { path: 'M122,240 C160,240 160,170 190,170' },
  'api-stream': { path: 'M302,160 H370' },
  'api-db': { path: 'M246,186 C246,280 420,280 550,280' },
  'stream-aggregator': { path: 'M482,160 H550' },
  'aggregator-redis': { path: 'M606,134 V76' },
  'aggregator-db': { path: 'M606,186 V254' },
};

export const COUNT_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 306, y: 152, text: 'events' },
  { x: 614, y: 224, text: 'one write per batch' },
  { x: 330, y: 296, text: 'likes: one row each' },
];
