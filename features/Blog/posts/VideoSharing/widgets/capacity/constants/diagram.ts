import type { DiagramEdge, DiagramNodeLayout, VideoNodeId } from '../types';
import { WIDGET_COLORS } from '@/features/Blog/components/widgetStyles';

export const DIAGRAM_WIDTH = 720;
export const DIAGRAM_HEIGHT = 340;
export const NODE_WIDTH = 112;
export const NODE_HEIGHT = 52;

export const NODE_IDS: VideoNodeId[] = [
  'clients',
  'lb',
  'api',
  'cache',
  'db',
  'cdn',
  'blob',
  'queue',
  'transcoder',
];

export const NODE_LAYOUT: Record<VideoNodeId, DiagramNodeLayout> = {
  clients: { x: 10, y: 144, label: 'Clients' },
  lb: { x: 160, y: 40, label: 'Load balancer' },
  api: { x: 310, y: 40, label: 'API servers' },
  cache: { x: 460, y: 40, label: 'Metadata cache' },
  db: { x: 598, y: 40, label: 'Metadata DB' },
  cdn: { x: 160, y: 144, label: 'CDN' },
  blob: { x: 598, y: 144, label: 'Video storage' },
  queue: { x: 310, y: 248, label: 'Message broker' },
  transcoder: { x: 460, y: 248, label: 'Transcoders' },
};

export const DIAGRAM_EDGES: DiagramEdge[] = [
  { id: 'clients-lb', path: 'M122,170 C141,170 141,66 160,66', loadNode: 'lb' },
  { id: 'lb-api', path: 'M272,66 H310', loadNode: 'api' },
  { id: 'api-cache', path: 'M422,66 H460', loadNode: 'cache', visibleWhen: 'cacheOn' },
  { id: 'cache-db', path: 'M572,66 H598', loadNode: 'db', visibleWhen: 'cacheOn' },
  {
    id: 'api-db',
    path: 'M366,40 C366,0 654,0 654,40',
    loadNode: 'db',
    visibleWhen: 'cacheOff',
    bypass: true,
  },
  { id: 'clients-cdn', path: 'M122,170 H160', loadNode: 'cdn', visibleWhen: 'cdnOn' },
  { id: 'cdn-blob', path: 'M272,170 H598', loadNode: 'blob', visibleWhen: 'cdnOn' },
  {
    id: 'clients-blob',
    path: 'M66,196 V322 H680 V196',
    loadNode: 'blob',
    visibleWhen: 'cdnOff',
    bypass: true,
  },
  { id: 'api-queue', path: 'M366,92 V248', loadNode: 'queue' },
  { id: 'queue-transcoder', path: 'M422,274 H460', loadNode: 'transcoder' },
  { id: 'transcoder-blob', path: 'M572,262 C626,262 626,230 626,196', loadNode: 'blob' },
];

export const DIAGRAM = {
  edgeStrokeWidth: 1.5,
  edgeOpacity: 0.55,
  particleRadius: 3,
  maxParticles: 4,
  /** Seconds for one particle to cross an edge at normal traffic. */
  baseParticleSeconds: 3,
  minParticleSeconds: 1.2,
  /** Particle durations snap to 1/durationSteps of a second. */
  durationSteps: 5,
  nodeRadius: 2,
  barHeight: 3,
  barInset: 8,
  idleColor: '#525252',
} as const;

export const CHART = {
  width: 320,
  height: 96,
  /** Loads above this are clipped to the top of the chart (300%). */
  maxLoad: 3,
  trafficColor: '#737373',
  loadColor: WIDGET_COLORS.error,
  thresholdColor: WIDGET_COLORS.idle,
} as const;
