import { CloudUpload, Cpu, Database, Globe, HardDrive, Layers, MessagesSquare, MonitorSmartphone, Server, Split, Zap } from 'lucide-react';
import type { FlowEdgeLabel } from '@/features/Blog/flow/types';
import type {
  ArchitectureCategory,
  ArchitectureCategoryOption,
  ArchitectureEdge,
  ArchitectureGroup,
  ArchitectureGroupId,
  ArchitectureNode,
  ArchitectureNodeId,
  ArchitectureViewOption,
} from '@/features/Blog/posts/VideoSharing/widgets/architecture/types';

export const ARCHITECTURE_DIAGRAM = {
  width: 830,
  height: 530,
  nodeWidth: 112,
  nodeHeight: 52,
  /** Wider than the step-by-step flows, so it needs a wider minimum to keep the text readable. */
  minWidthClass: 'min-w-[680px]',
  /** Color of active routes. Neutral, so it never reads as one of the categories. */
  edgeColor: '#d4d4d4',
  legend: { x: 12, y: 30, rowHeight: 15, swatch: 8 },
  /** Size of the stacked-box sample in the legend. */
  legendStack: { width: 14, height: 9 },
  /** Distance from the top of a group box to its title baseline. */
  groupTitleOffset: 15,
  /** Leaves room for the icon badge of the first component in the box. */
  groupTitleInset: 28,
} as const;

/** Kinds of component, each with its own color in the diagram and the legend. */
export const ARCHITECTURE_CATEGORIES: Record<ArchitectureCategory, ArchitectureCategoryOption> = {
  client: { label: 'Client', color: '#34d399' },
  network: { label: 'Network and delivery', color: '#a78bfa' },
  service: { label: 'Services', color: '#38bdf8' },
  async: { label: 'Async processing', color: '#fbbf24' },
  data: { label: 'Data and storage', color: '#fb7185' },
};

/** Each deployable service draws a box around the components it owns. */
export const ARCHITECTURE_GROUPS: Record<ArchitectureGroupId, ArchitectureGroup> = {
  upload: { label: 'Upload service', caption: 'video in', x: 318, y: 24, width: 496, height: 92 },
  data: { label: 'Shared data', caption: 'one writer per table or zone', x: 318, y: 164, width: 496, height: 92 },
  api: { label: 'API service', caption: 'reads + manifest', x: 318, y: 304, width: 316, height: 92 },
  delivery: { label: 'Delivery service', caption: 'video out', x: 318, y: 424, width: 316, height: 92 },
};

/** The order here is the order of the component table. */
export const ARCHITECTURE_NODES: Record<ArchitectureNodeId, ArchitectureNode> = {
  client: {
    category: 'client',
    icon: MonitorSmartphone,
    x: 10,
    y: 192,
    label: 'Client',
    caption: 'phone or browser',
    name: 'Client',
    description: 'Any device that can play video.',
  },
  lb: {
    category: 'network',
    icon: Split,
    scalesOut: true,
    x: 150,
    y: 192,
    label: 'Load balancer',
    caption: 'entry point',
    name: 'Load balancer',
    description:
      'The entry point for every request. It spreads them across the servers and routes each one to the right service, by host or path. Helps with scale and availability. It is a fleet too: a managed load balancer adds nodes behind one address on its own, and a self-hosted one runs several copies behind DNS or anycast, never just one.',
  },
  api: {
    category: 'service',
    group: 'api',
    icon: Server,
    scalesOut: true,
    x: 330,
    y: 332,
    label: 'API servers',
    caption: 'token + manifest',
    name: 'API servers',
    description:
      'A fleet of stateless servers behind the load balancer. It checks login tokens and runs modules such as accounts, video metadata, comments and dashboards, which can become separate services as they grow. It decides who may watch and from which edge, using the health and load each edge reports, shared between instances through a small Redis, and returns the manifest address with a playback token. It handles the metadata cache itself: it asks the cache first, and on a miss reads the database and fills the cache. It never carries video bytes.',
  },
  broker: {
    category: 'async',
    group: 'upload',
    icon: MessagesSquare,
    scalesOut: true,
    x: 510,
    y: 52,
    label: 'Message broker',
    caption: 'events and jobs',
    name: 'Message broker',
    description:
      'Carries events and jobs between services, such as "check this upload" or "transcode this video". It absorbs bursts, so the database and the workers are not hit all at once.',
  },
  upload: {
    category: 'service',
    group: 'upload',
    icon: CloudUpload,
    scalesOut: true,
    x: 330,
    y: 52,
    label: 'Upload API',
    caption: 'lifecycle owner',
    name: 'Upload API',
    description:
      'The endpoint clients use to upload, deployed and scaled separately from the API servers. It owns the lifecycle of every upload. It checks quotas and hands out signed URLs, finishes uploads (assembles the file and plans the transcode tasks), consumes events from the broker, checks that each status change is allowed, keeps the video status in the database up to date, and sweeps away uploads that were abandoned.',
  },
  transcoders: {
    category: 'async',
    group: 'upload',
    icon: Cpu,
    scalesOut: true,
    x: 690,
    y: 52,
    label: 'Transcoders',
    caption: 'GPU workers',
    name: 'Transcoders',
    description:
      'GPU workers that encode one task at a time: one segment of a video in one resolution (1080p, 720p, 480p). The upload API plans the tasks, and every result is reported back through the broker. Each GPU machine runs a worker program that pulls its task from the broker and reads and writes storage with its own credentials, which allow reading raw uploads and writing finished videos, nothing else. It has no public API, only health and metrics endpoints, so the autoscaler can add GPUs when the queue grows.',
  },
  storage: {
    category: 'data',
    group: 'data',
    icon: HardDrive,
    scalesOut: true,
    x: 690,
    y: 192,
    label: 'Video storage',
    caption: 'raw + processed',
    name: 'Video storage',
    description:
      'BLOB storage for the raw uploads and the transcoded videos. A BLOB (binary large object) is data stored as one chunk, typically video, audio or images. Raw uploads and finished videos live in separate zones (two prefixes in one bucket, or two buckets) with different access and cleanup rules, so a raw file can never be served to viewers.',
  },
  edge: {
    category: 'network',
    group: 'delivery',
    icon: Globe,
    scalesOut: true,
    x: 330,
    y: 452,
    label: 'Edge cache',
    caption: 'near the viewer',
    name: 'Edge cache',
    description:
      'A fleet (a group of identical servers working together) of cache servers near the viewers that serves the video segments. A rented one is called a CDN, a content delivery network. Each of its servers is an border-zinc-800, because it sits at the border-zinc-800 of the network, close to viewers. It checks the playback token on every request, keeps popular segments on disk, reports its health and load to the API servers, and asks the mid-tier cache only on a miss. It knows nothing about users or metadata. It can be rented or run yourself.',
  },
  midtier: {
    category: 'network',
    group: 'delivery',
    icon: Layers,
    scalesOut: true,
    x: 510,
    y: 452,
    label: 'Mid-tier cache',
    caption: 'shield',
    name: 'Mid-tier cache (shield)',
    description:
      'A cache layer between the edges and video storage. When many edges miss on the same segment, they share one fetch from storage instead of each making their own. It is also the only reader that holds storage credentials: the bucket stays private, viewers only ever get signed URLs that the edge checks, so it doubles as the gateway for every read. It runs apart from the API servers on purpose, because it moves video bytes and the API never should.',
  },
  db: {
    category: 'data',
    group: 'data',
    icon: Database,
    scalesOut: true,
    x: 330,
    y: 192,
    label: 'Metadata DB',
    caption: 'source of truth',
    name: 'Metadata database',
    description:
      'Titles, descriptions, video status, manifest locations, thumbnails and counters. Users and comments live in schemas of their own. Sharded and replicated for performance and availability. The upload API writes the video status, and the API servers only read it.',
  },
  cache: {
    category: 'data',
    group: 'api',
    icon: Zap,
    scalesOut: true,
    x: 510,
    y: 332,
    label: 'Metadata cache',
    caption: 'hot metadata',
    name: 'Metadata cache',
    description: 'Keeps hot metadata in memory so the database is asked less often. The API servers fill it on a miss.',
  },
};

export const ARCHITECTURE_EDGES: Record<string, ArchitectureEdge> = {
  'client-lb': { from: 'client', to: 'lb', flows: ['upload', 'stream'], path: 'M122,218 H150' },
  'lb-upload': { from: 'lb', to: 'upload', flows: ['upload'], path: 'M206,192 C206,120 260,78 330,78' },
  'lb-api': { from: 'lb', to: 'api', flows: ['stream'], path: 'M236,244 C236,320 270,358 330,358' },
  'client-storage': {
    from: 'client',
    to: 'storage',
    flows: ['upload'],
    path: 'M40,192 C40,152 60,140 90,140 H650 Q662,140 662,152 V206 Q662,218 674,218 H690',
  },
  'upload-db': { from: 'upload', to: 'db', flows: ['upload'], path: 'M386,104 V192' },
  'upload-storage': { from: 'upload', to: 'storage', flows: ['upload'], path: 'M420,104 V121 Q420,129 428,129 H708 Q716,129 716,137 V192' },
  'upload-broker': { from: 'upload', to: 'broker', flows: ['upload'], path: 'M442,78 H510' },
  'transcoders-broker': { from: 'transcoders', to: 'broker', flows: ['upload'], path: 'M690,78 H622' },
  'transcoders-storage': { from: 'transcoders', to: 'storage', flows: ['upload'], path: 'M746,104 V192' },
  'api-cache': { from: 'api', to: 'cache', flows: ['stream'], path: 'M442,358 H510' },
  'api-db': { from: 'api', to: 'db', flows: ['stream'], path: 'M386,332 V244' },
  'edge-api': { from: 'edge', to: 'api', flows: ['stream'], path: 'M386,452 V384' },
  'client-edge': { from: 'client', to: 'edge', flows: ['stream'], path: 'M50,244 C50,410 200,478 330,478' },
  'edge-midtier': { from: 'edge', to: 'midtier', flows: ['stream'], path: 'M442,478 H510' },
  'midtier-storage': { from: 'midtier', to: 'storage', flows: ['stream'], path: 'M622,478 C700,478 746,330 746,244' },
};

export const ARCHITECTURE_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 250, y: 134, text: 'chunks via signed URLs' },
  { x: 560, y: 124, text: 'control calls' },
  { x: 448, y: 72, text: 'pub + pull' },
  { x: 624, y: 72, text: 'pull, done' },
  { x: 752, y: 152, text: 'read raw, write' },
  { x: 392, y: 290, text: 'on a miss' },
  { x: 392, y: 414, text: 'reports health + load' },
  { x: 450, y: 470, text: 'on a miss' },
  { x: 640, y: 500, text: 'only on a miss' },
  { x: 190, y: 490, text: 'video segments' },
];

export const ARCHITECTURE_VIEWS: ArchitectureViewOption[] = [
  {
    id: 'all',
    label: 'Everything',
    summary:
      'Every service and route on the video path. Login, comments and the cleanup sweep are left out to keep it readable. Each dashed box is one service that is deployed and scaled on its own, a stacked box runs as many identical copies and scales out by adding more, and every arrow points from the component that makes the call. Click a component to see what it does and what it talks to.',
  },
  {
    id: 'upload',
    label: 'Upload',
    summary:
      'A video goes in. The client gets signed URLs from the upload API and sends the chunks straight to storage. The upload API publishes tasks to the broker, and the GPU transcoders pull them with long polling. The broker never calls anyone.',
  },
  {
    id: 'stream',
    label: 'Streaming',
    summary:
      'A video comes out. The API servers return the manifest from cached metadata and pick an edge from the health reports. The segments come from the edge cache, which asks the mid-tier, and through it storage, only on a miss.',
  },
];
