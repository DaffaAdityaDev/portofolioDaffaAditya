import type { FlowScenario } from '@/features/Blog/flow/types';
import type { StreamScenarioId, StreamStep } from '@/features/Blog/posts/VideoSharing/widgets/streamingFlow/types';
import { STREAM_NO_QUALITY } from './constants';

const PRESS_PLAY: StreamStep = {
  id: 'press-play',
  title: 'Press play',
  detail:
    'The player asks the API to play video v_42. The request enters through the load balancer, and the API checks the login token locally, with no database call.',
  activeNodes: ['client', 'lb', 'api'],
  activeEdges: ['client-lb', 'lb-api'],
  quality: STREAM_NO_QUALITY,
  bufferSeconds: 0,
  labels: { client: 'play v_42', api: 'token ok' },
};

const MANIFEST: StreamStep = {
  id: 'manifest',
  title: 'Receive the manifest',
  detail:
    'The API answers with a manifest: a list of the video\'s segments in every resolution, as URLs on an edge cache. The API also picks which edge, from the viewer location and the load on each one, and signs one playback token that covers every segment of the video. The answer travels back the same way. No video bytes pass through the API servers.',
  activeNodes: ['client', 'lb', 'api'],
  activeEdges: ['client-lb', 'lb-api'],
  quality: STREAM_NO_QUALITY,
  bufferSeconds: 0,
  labels: { api: 'manifest + edge' },
};

const edgeStep = (
  id: string,
  title: string,
  detail: string,
  fields: Pick<StreamStep, 'quality' | 'bufferSeconds'> & Partial<StreamStep>,
): StreamStep => ({
  id,
  title,
  detail,
  activeNodes: ['client', 'cdn'],
  activeEdges: ['client-cdn', 'cdn-client'],
  cdn: 'hit',
  labels: { cdn: 'hit' },
  ...fields,
});

export const STREAM_SCENARIOS: Record<StreamScenarioId, FlowScenario<StreamStep>> = {
  hit: {
    id: 'hit',
    label: 'Popular video',
    summary: 'Everything is already cached, so nothing slow happens. This is how most views go.',
    steps: [
      PRESS_PLAY,
      {
        id: 'cache-hit',
        title: 'Look up the metadata',
        detail:
          'The API asks the metadata cache. A popular video is almost always there: its title, the available resolutions, and where its segments live on the CDN. The database is never touched.',
        activeNodes: ['api', 'cache'],
        activeEdges: ['api-cache'],
        quality: STREAM_NO_QUALITY,
        bufferSeconds: 0,
        labels: { cache: 'hit' },
      },
      MANIFEST,
      edgeStep(
        'first-segments',
        'Fetch the first segments from the CDN',
        'The player asks the nearest CDN edge for the first segments, starting at a middle resolution to be safe. The edge already has them, so they come back in milliseconds.',
        { quality: 1, bufferSeconds: 4 },
      ),
      edgeStep(
        'playback-starts',
        'Playback starts',
        'With a few seconds buffered, the video starts. The player keeps fetching a few segments ahead of the playhead.',
        { quality: 1, bufferSeconds: 10 },
      ),
      edgeStep(
        'climb',
        'Move up to full quality',
        'Segments arrive faster than they play, so the player measures the spare bandwidth and moves up to 1080p. This is adaptive bitrate streaming.',
        { quality: 3, bufferSeconds: 22 },
      ),
    ],
  },
  miss: {
    id: 'miss',
    label: 'Brand-new video',
    summary: 'Nothing is cached yet. Watch how one slow read is shared instead of repeated for every viewer.',
    steps: [
      PRESS_PLAY,
      {
        id: 'cache-miss',
        title: 'The metadata is not cached',
        detail: 'A brand-new video is not in the metadata cache yet, so the lookup misses.',
        activeNodes: ['api', 'cache'],
        activeEdges: ['api-cache'],
        quality: STREAM_NO_QUALITY,
        bufferSeconds: 0,
        labels: { cache: 'miss' },
      },
      {
        id: 'read-db',
        title: 'Read the database once',
        detail:
          'The API itself reads the metadata database once and writes the answer into the cache. This is called cache-aside: the cache never talks to the database, the service does. The next viewers will hit the cache.',
        activeNodes: ['api', 'cache', 'db'],
        activeEdges: ['api-db', 'api-cache'],
        quality: STREAM_NO_QUALITY,
        bufferSeconds: 0,
        labels: { db: '1 read', cache: 'filled' },
      },
      MANIFEST,
      {
        id: 'edge-miss',
        title: 'The edge does not have the segments',
        detail: 'The player asks the nearest CDN edge, but nobody has watched this video yet, so the edge has to ask storage, the origin, for it.',
        activeNodes: ['client', 'cdn'],
        activeEdges: ['client-cdn'],
        quality: STREAM_NO_QUALITY,
        bufferSeconds: 0,
        cdn: 'miss',
        labels: { cdn: 'miss' },
      },
      {
        id: 'collapse',
        title: 'Many viewers, one request',
        detail:
          'A thousand viewers ask for the same new video at once. The edge sends a single request to video storage and makes the others wait for that one answer, so storage sees one read instead of a thousand.',
        activeNodes: ['cdn', 'storage'],
        activeEdges: ['cdn-storage'],
        quality: STREAM_NO_QUALITY,
        bufferSeconds: 0,
        tone: 'recovery',
        cdn: 'collapsed',
        labels: { cdn: 'collapsing', storage: '1 request' },
      },
      {
        id: 'fill',
        title: 'The edge streams it through and keeps a copy',
        detail:
          'The edge does not wait for the whole file. It forwards each segment to the waiting viewers as it arrives from storage, and stores a copy at the same time. Only the first viewers pay for the extra hop, and only for the first segments.',
        activeNodes: ['storage', 'cdn', 'client'],
        activeEdges: ['storage-cdn', 'cdn-client'],
        quality: STREAM_NO_QUALITY,
        bufferSeconds: 0,
        cdn: 'collapsed',
        labels: { cdn: 'forward + save' },
      },
      edgeStep(
        'playback',
        'Playback starts, and the next viewer gets a hit',
        'The video starts. From now on, every viewer near this edge is a cache hit.',
        { quality: 1, bufferSeconds: 8 },
      ),
    ],
  },
  slow: {
    id: 'slow',
    label: 'Slow network',
    summary: 'The viewer\'s connection gets worse. The player lowers the quality instead of stopping.',
    steps: [
      edgeStep('smooth', 'Smooth playback', 'Everything is fine: 1080p with plenty of buffer ahead.', {
        quality: 3,
        bufferSeconds: 24,
      }),
      edgeStep(
        'degrades',
        'The network gets worse',
        'The viewer walks into a lift. Segments arrive slower than they play, so the buffer starts to drain.',
        { quality: 3, bufferSeconds: 5, tone: 'error', labels: { client: 'buffer draining', cdn: 'hit' } },
      ),
      edgeStep(
        'drop-quality',
        'Drop the quality',
        'Instead of stalling, the player requests the 360p segments for the next requests. They are much smaller, so they still arrive in time.',
        { quality: 0, bufferSeconds: 8, tone: 'recovery', labels: { client: 'switch to 360p', cdn: 'hit' } },
      ),
      edgeStep(
        'recover',
        'The buffer recovers',
        'The small segments let the buffer refill. The picture is softer, but it never froze.',
        { quality: 0, bufferSeconds: 18, tone: 'recovery' },
      ),
      edgeStep(
        'climb-back',
        'Climb back up',
        'When the network recovers, the player moves up one step at a time instead of jumping straight back to 1080p.',
        { quality: 2, bufferSeconds: 22 },
      ),
    ],
  },
  edgeFails: {
    id: 'edgeFails',
    label: 'Edge goes down',
    summary: 'The nearest CDN edge stops answering. The buffer buys time to switch to another one.',
    steps: [
      edgeStep('streaming', 'Streaming from the nearest edge', 'Playback is smooth at 720p with a healthy buffer.', {
        quality: 2,
        bufferSeconds: 20,
      }),
      edgeStep(
        'edge-down',
        'The edge goes down',
        'The nearest edge stops answering. The seconds already buffered keep playing, but the next requests fail.',
        {
          quality: 2,
          bufferSeconds: 14,
          tone: 'error',
          cdn: undefined,
          labels: { cdn: 'down', client: 'requests fail' },
        },
      ),
      edgeStep(
        'retry',
        'Retry on another edge',
        'Traffic is steered to a healthy edge, by DNS or because the player retries another host, and the same segment is fetched there.',
        { quality: 2, bufferSeconds: 10, tone: 'recovery', labels: { cdn: 'other edge', client: 'retrying' } },
      ),
      edgeStep(
        'continues',
        'Playback continues',
        'The viewer never saw a stall, because the buffer lasted longer than the failover took.',
        { quality: 2, bufferSeconds: 20 },
      ),
    ],
  },
};

export const STREAM_SCENARIO_ORDER: StreamScenarioId[] = ['hit', 'miss', 'slow', 'edgeFails'];
