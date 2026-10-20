import type { FlowScenario, StepTone } from '@/features/Blog/flow/types';
import type {
  ShieldEdgeId,
  ShieldNodeId,
  ShieldScenarioId,
  ShieldStep,
} from './types';

const step = (
  id: string,
  title: string,
  detail: string,
  fields: {
    nodes: ShieldNodeId[];
    edges: ShieldEdgeId[];
    origin: number | null;
    labels?: Partial<Record<ShieldNodeId, string>>;
    tone?: StepTone;
  },
): ShieldStep => ({
  id,
  title,
  detail,
  activeNodes: fields.nodes,
  activeEdges: fields.edges,
  labels: fields.labels,
  tone: fields.tone,
  originRequests: fields.origin,
});

const LAUNCH = step(
  'launch',
  'Everyone presses play',
  'A video is announced and 20,000 viewers press play in the same minute, in two cities. They all ask their nearest edge for segment 1. Nobody has watched it yet, so both edges miss.',
  {
    nodes: ['viewersA', 'viewersB', 'edgeA', 'edgeB'],
    edges: ['viewersA-edgeA', 'viewersB-edgeB'],
    origin: null,
    labels: { edgeA: '12,000 misses', edgeB: '8,000 misses' },
    tone: 'error',
  },
);

export const SHIELD_SCENARIOS: Record<ShieldScenarioId, FlowScenario<ShieldStep>> = {
  none: {
    id: 'none',
    label: 'No protection',
    summary: 'Every miss becomes its own request to the origin.',
    steps: [
      LAUNCH,
      step(
        'flood',
        'The origin is flooded',
        'Each miss fetches the segment from video storage on its own. 20,000 identical requests for the same file arrive at the origin within seconds, and storage has request limits. Viewers wait, retry, and make it worse.',
        {
          nodes: ['edgeA', 'edgeB', 'origin'],
          edges: ['edgeA-origin', 'edgeB-origin'],
          origin: 20000,
          labels: { origin: 'flooded' },
          tone: 'error',
        },
      ),
    ],
  },
  collapse: {
    id: 'collapse',
    label: 'Request collapsing',
    summary: 'Each edge sends one request per file and lets everyone else wait for that answer.',
    steps: [
      LAUNCH,
      step(
        'one-fetch',
        'One fetch per edge',
        'Edge A sends one request for segment 1 and holds the other 11,999 requests until it answers. Edge B does the same. The origin sees two requests instead of 20,000.',
        {
          nodes: ['edgeA', 'edgeB', 'origin'],
          edges: ['edgeA-origin', 'edgeB-origin'],
          origin: 2,
          labels: { edgeA: '1 fetch only', edgeB: '1 fetch only' },
          tone: 'recovery',
        },
      ),
      step(
        'stream-out',
        'Everyone gets the same answer',
        'The bytes stream to every waiting viewer as they arrive, and the edge keeps a copy. From now on every viewer in that city hits. But a real CDN has hundreds of edge locations, and each one still sends its own first request.',
        {
          nodes: ['viewersA', 'viewersB', 'edgeA', 'edgeB'],
          edges: ['viewersA-edgeA', 'viewersB-edgeB'],
          origin: 2,
          labels: { edgeA: 'hit', edgeB: 'hit' },
        },
      ),
    ],
  },
  shield: {
    id: 'shield',
    label: 'Shield layer',
    summary: 'A cache in front of the origin turns hundreds of edge misses into one.',
    steps: [
      step(
        'many-edges',
        'Hundreds of edges',
        'With 300 edge locations, collapsing still leaves 300 first requests for every segment in every resolution. For a long video that is a storm of its own.',
        {
          nodes: ['edgeA', 'edgeB', 'origin'],
          edges: ['edgeA-origin', 'edgeB-origin'],
          origin: 300,
          labels: { edgeA: '1 of 300 edges', edgeB: '1 of 300 edges' },
          tone: 'error',
        },
      ),
      step(
        'via-shield',
        'Ask the shield instead',
        'Edges send their misses to the shield, one cache placed next to the origin. The shield collapses them again: 300 requests in, one request out. The origin only ever sees the shield.',
        {
          nodes: ['edgeA', 'edgeB', 'shield', 'origin'],
          edges: ['edgeA-shield', 'edgeB-shield', 'shield-origin'],
          origin: 1,
          labels: { shield: '300 in, 1 out' },
          tone: 'recovery',
        },
      ),
      step(
        'price',
        'The price',
        'A miss now takes one extra hop, and only for the first viewers of a file in each city. In return, the origin can be sized for the shield, not for the whole internet.',
        {
          nodes: ['shield', 'origin'],
          edges: [],
          origin: 1,
          labels: { origin: 'small and calm' },
        },
      ),
    ],
  },
  expiry: {
    id: 'expiry',
    label: 'Mass expiry',
    summary: 'Entries written together expire together, and a popular video vanishes from every cache at once.',
    steps: [
      step(
        'wave',
        'Everything expires at once',
        'Every edge cached the popular video at 20:00 with a one-hour limit. At 21:00 it expires everywhere in the same second, and every edge misses together: a launch-day storm with no launch.',
        {
          nodes: ['edgeA', 'edgeB', 'shield', 'origin'],
          edges: ['edgeA-shield', 'edgeB-shield', 'shield-origin'],
          origin: 300,
          labels: { edgeA: 'expired 21:00', edgeB: 'expired 21:00', shield: 'expired 21:00' },
          tone: 'error',
        },
      ),
      step(
        'jitter',
        'Add a little randomness',
        'Each entry gets the limit plus or minus a random 10%, so expiries spread over twelve minutes and misses trickle in. Better still, a segment file never changes (an edit gets a new path), so segments can be cached for days. Only the small manifest needs a short limit.',
        {
          nodes: ['edgeA', 'edgeB', 'shield', 'origin'],
          edges: ['edgeA-shield', 'shield-origin'],
          origin: 1,
          labels: { edgeA: 'expires 20:57', edgeB: 'expires 21:04' },
          tone: 'recovery',
        },
      ),
    ],
  },
  prewarm: {
    id: 'prewarm',
    label: 'Known launch',
    summary: 'When the launch time is known, fill the caches before anyone asks.',
    steps: [
      step(
        'night',
        'Fetch ahead, the night before',
        'In quiet hours, the edges in the main viewer regions fetch the first minutes of the video in every resolution through the shield. The origin serves them once, when nobody else is asking.',
        {
          nodes: ['edgeA', 'edgeB', 'shield', 'origin'],
          edges: ['edgeA-shield', 'edgeB-shield', 'shield-origin'],
          origin: 1,
          labels: { edgeA: 'pre-warmed', edgeB: 'pre-warmed', shield: 'pre-warmed' },
        },
      ),
      step(
        'launch-hit',
        'Launch: all hits',
        'At launch, 20,000 viewers press play and every request is a hit at the nearest edge. The origin is not asked at all.',
        {
          nodes: ['viewersA', 'viewersB', 'edgeA', 'edgeB'],
          edges: ['viewersA-edgeA', 'viewersB-edgeB'],
          origin: 0,
          labels: { edgeA: '12,000 hits', edgeB: '8,000 hits' },
          tone: 'recovery',
        },
      ),
    ],
  },
};

export const SHIELD_SCENARIO_ORDER: ShieldScenarioId[] = ['none', 'collapse', 'shield', 'expiry', 'prewarm'];
