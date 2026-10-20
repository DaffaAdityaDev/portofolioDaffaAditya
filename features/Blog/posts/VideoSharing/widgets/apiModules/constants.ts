import {
  Activity,
  BarChart3,
  Database,
  Heart,
  KeyRound,
  MessageSquare,
  MessagesSquare,
  MonitorSmartphone,
  PlaySquare,
  Sigma,
  Split,
  Users,
  Warehouse,
  Zap,
} from 'lucide-react';
import type { FlowEdgeLabel } from '@/features/Blog/flow/types';
import type { ApiModuleEdge, ApiModuleNode, ApiModuleNodeId } from './types';

export const API_MODULES_DIAGRAM = {
  width: 840,
  height: 400,
  nodeWidth: 112,
  nodeHeight: 52,
  minWidthClass: 'min-w-[680px]',
  edgeColor: '#d4d4d4',
  /** The API service box around the five modules. */
  group: { x: 296, y: 10, width: 140, height: 380, label: 'API service', caption: 'one codebase' },
  groupTitleOffset: 15,
  groupTitleInset: 28,
} as const;

/** Rows of the five modules, top to bottom. Each store sits on the row of its module. */
const ROW = [44, 112, 180, 248, 316] as const;
const MODULE_X = 310;
const STORE_X = 500;
/** The metadata database sits behind its cache, one column further right. */
const DB_X = 690;
const NODE_MID = API_MODULES_DIAGRAM.nodeHeight / 2;

export const API_MODULE_NODES: Record<ApiModuleNodeId, ApiModuleNode> = {
  client: {
    category: 'client',
    icon: MonitorSmartphone,
    x: 10,
    y: 174,
    label: 'Client',
    caption: 'app or browser',
    name: 'Client',
    description: 'Sees one API at one address. It never knows that the modules behind it use different data stores.',
  },
  lb: {
    category: 'network',
    icon: Split,
    scalesOut: true,
    x: 150,
    y: 174,
    label: 'Load balancer',
    caption: 'routes by path',
    name: 'Load balancer',
    description:
      'A layer-7 load balancer. Every module is served by the same API fleet today, so it only spreads requests. When a module is pulled out as its own service later, one new path rule (for example /comments/*) sends its traffic to the new fleet, and the client does not change.',
  },
  accounts: {
    category: 'service',
    icon: KeyRound,
    x: MODULE_X,
    y: ROW[0],
    label: 'Accounts',
    caption: 'login + tokens',
    name: 'Accounts module',
    description:
      'Login, sign-up and token refresh. Logins are rare, but every other request carries an access token, which any API server checks locally without calling this module.',
  },
  watch: {
    category: 'service',
    icon: PlaySquare,
    x: MODULE_X,
    y: ROW[1],
    label: 'Watch page',
    caption: 'video metadata',
    name: 'Watch page module',
    description:
      'Titles, thumbnails, resolutions and the playback answer. Extremely read-heavy, so almost every request is answered from the metadata cache.',
  },
  comments: {
    category: 'service',
    icon: MessageSquare,
    x: MODULE_X,
    y: ROW[2],
    label: 'Comments',
    caption: 'per video',
    name: 'Comments module',
    description:
      'Posts and lists comments. Write-heavy and bursty: a popular video can get thousands of comments a minute. With its own store, a comment storm never slows down the watch page.',
  },
  counters: {
    category: 'service',
    icon: Heart,
    x: MODULE_X,
    y: ROW[3],
    label: 'Likes + views',
    caption: 'events only',
    name: 'Likes and views module',
    description:
      'Accepts a like or a view as an event and answers at once. It never writes a counter to a database itself, so a very high write rate costs it almost nothing.',
  },
  dashboard: {
    category: 'service',
    icon: BarChart3,
    x: MODULE_X,
    y: ROW[4],
    label: 'Dashboard',
    caption: 'creator stats',
    name: 'Creator dashboard module',
    description:
      'Views per day, watch time, top videos. It only reads pre-computed aggregates, so a heavy query never touches the database that serves the watch page.',
  },
  userDb: {
    category: 'data',
    icon: Users,
    scalesOut: true,
    x: STORE_X,
    y: ROW[0],
    label: 'User DB',
    caption: '+ token store',
    name: 'User database',
    description:
      'Accounts and password hashes, plus a fast key-value store (Redis) for refresh tokens and login rate limits.',
  },
  metadataCache: {
    category: 'data',
    icon: Zap,
    scalesOut: true,
    x: STORE_X,
    y: ROW[1],
    label: 'Metadata cache',
    caption: 'asked first',
    name: 'Metadata cache',
    description:
      'The same metadata cache as in the architecture above. The watch page asks it first, and almost every request ends here. Only on a miss does the module read the database and fill the cache.',
  },
  metadataDb: {
    category: 'data',
    icon: Database,
    scalesOut: true,
    x: DB_X,
    y: ROW[1],
    label: 'Metadata DB',
    caption: 'source of truth',
    name: 'Metadata database',
    description:
      'The same sharded metadata database as in the architecture above, read through the metadata cache. Counter totals arrive here in batches, never one write per view.',
  },
  commentsDb: {
    category: 'data',
    icon: MessagesSquare,
    scalesOut: true,
    x: STORE_X,
    y: ROW[2],
    label: 'Comments DB',
    caption: 'keyed by video',
    name: 'Comments store',
    description:
      'Partitioned by video ID, so all comments of one video sit together and a page of them is one read. The top comments of hot videos are cached.',
  },
  events: {
    category: 'async',
    icon: Activity,
    scalesOut: true,
    x: STORE_X,
    y: ROW[3],
    label: 'Event stream',
    caption: 'views + likes',
    name: 'Event stream',
    description:
      'A durable, partitioned log (Kafka, or the message broker) that holds every view and like event until the aggregator has processed it. A burst queues up here instead of hitting a database.',
  },
  analytics: {
    category: 'data',
    icon: Warehouse,
    scalesOut: true,
    x: STORE_X,
    y: ROW[4],
    label: 'Analytics store',
    caption: 'pre-aggregated',
    name: 'Analytics store',
    description:
      'A column store (ClickHouse, BigQuery) built for counting and grouping, filled only by the aggregator. Dashboards read from it, never from the primary database.',
  },
  aggregator: {
    category: 'async',
    icon: Sigma,
    scalesOut: true,
    x: 690,
    y: 282,
    label: 'Aggregator',
    caption: 'dedupe + batch',
    name: 'Aggregator',
    description:
      'Workers that pull events from the stream, drop duplicates (one view per viewer per time window), keep running totals in memory, and write them out in batches: totals to the metadata database, aggregates to the analytics store.',
  },
};

const MODULE_IDS: ApiModuleNodeId[] = ['accounts', 'watch', 'comments', 'counters', 'dashboard'];
const STORE_IDS: ApiModuleNodeId[] = ['userDb', 'metadataCache', 'commentsDb', 'events', 'analytics'];

const lbToModule = (row: number): string => `M262,200 C286,200 286,${row + NODE_MID} ${MODULE_X},${row + NODE_MID}`;
const moduleToStore = (row: number): string =>
  `M${MODULE_X + API_MODULES_DIAGRAM.nodeWidth},${row + NODE_MID} H${STORE_X}`;

export const API_MODULE_EDGES: Record<string, ApiModuleEdge> = {
  'client-lb': { from: 'client', to: 'lb', path: 'M122,200 H150' },
  ...Object.fromEntries(
    MODULE_IDS.flatMap((moduleId, index) => [
      [`lb-${moduleId}`, { from: 'lb', to: moduleId, path: lbToModule(ROW[index]) }],
      [`${moduleId}-${STORE_IDS[index]}`, { from: moduleId, to: STORE_IDS[index], path: moduleToStore(ROW[index]) }],
    ]),
  ),
  'aggregator-events': { from: 'aggregator', to: 'events', path: 'M690,300 C650,300 650,274 612,274' },
  'aggregator-analytics': { from: 'aggregator', to: 'analytics', path: 'M690,318 C650,318 650,342 612,342' },
  'watch-metadataDb': { from: 'watch', to: 'metadataDb', path: 'M422,124 C462,124 462,104 500,104 H660 C676,104 676,138 690,138' },
  'aggregator-metadataDb': { from: 'aggregator', to: 'metadataDb', path: 'M746,282 V164' },
};

export const API_MODULE_EDGE_LABELS: FlowEdgeLabel[] = [
  { x: 232, y: 166, text: 'by path' },
  { x: 650, y: 268, text: 'pull' },
  { x: 638, y: 362, text: 'aggregates' },
  { x: 752, y: 210, text: 'batched totals' },
  { x: 620, y: 100, text: 'on a miss' },
];

export const API_MODULES_SUMMARY =
  'One API codebase behind one load balancer, split into modules that each own their data. On day one every store here is its own schema in one MySQL server, shown further down. Click a module or a store to see what it does and what it talks to.';
