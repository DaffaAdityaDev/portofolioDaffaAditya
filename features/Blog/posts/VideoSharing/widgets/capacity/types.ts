/** Inputs that describe the product and its scale (the "constraints"). */
export interface VideoConstraints {
  /** Daily active users, in millions. */
  dailyActiveUsersM: number;
  viewsPerUserPerDay: number;
  /** Views per uploaded video (read-to-write ratio). */
  readWriteRatio: number;
  avgVideoSizeMb: number;
  /** Data transfer price in USD per GB. */
  cdnCostPerGb: number;
}

/** Architecture decisions the reader can toggle (the "design"). */
export interface VideoDesignChoices {
  cdnEnabled: boolean;
  cacheEnabled: boolean;
  autoscaleEnabled: boolean;
  baselineApiServers: number;
  dbReplicas: number;
  dbShards: number;
  transcodeWorkers: number;
}

export type DesignPreset = 'naive' | 'balanced' | 'hardened';

export type VideoNodeId =
  | 'clients'
  | 'lb'
  | 'api'
  | 'cache'
  | 'db'
  | 'cdn'
  | 'blob'
  | 'queue'
  | 'transcoder';

export type NodeStatus = 'ok' | 'warn' | 'critical' | 'off';

export interface CapacityEstimates {
  viewsPerDay: number;
  /** Outbound data per month in GB, used to pick a volume-based price. */
  monthlyEgressGb: number;
  viewsPerSecond: number;
  uploadsPerDay: number;
  storageMbPerDay: number;
  egressCostPerDayUsd: number;
  avgEgressTbps: number;
}

export interface SimSample {
  time: number;
  multiplier: number;
  worstLoad: number;
  successRate: number;
}

/** Mutable-over-time part of the simulation, advanced once per tick. */
export interface SimRuntime {
  time: number;
  targetMultiplier: number;
  multiplier: number;
  apiServers: number;
  /** Videos waiting to be transcoded. */
  backlog: number;
  /** Simulation time when a viral spike ends, or null when none is running. */
  spikeEndsAt: number | null;
  history: SimSample[];
}

/** Demand and capacity of every component at one moment in time. */
export interface SimFlows {
  views: number;
  uploads: number;
  lbDemand: number;
  lbCapacity: number;
  apiServers: number;
  apiDemand: number;
  apiCapacity: number;
  cacheHitRatio: number;
  cacheDemand: number;
  cacheCapacity: number;
  dbReadDemand: number;
  dbReadCapacity: number;
  dbWriteDemand: number;
  dbWriteCapacity: number;
  egressTbps: number;
  cdnCapacityTbps: number;
  originTbps: number;
  originCapacityTbps: number;
  transcodeDemand: number;
  transcodeCapacity: number;
  backlog: number;
  queueDelaySeconds: number;
  /** Share of playback starts that succeed, 0 to 1. */
  successRate: number;
  egressCostPerHourUsd: number;
}

export interface NodeMetric {
  id: VideoNodeId;
  /** Demand divided by capacity. 1 means exactly saturated. */
  load: number;
  status: NodeStatus;
  headline: string;
  detail: string;
}

export type SimMetrics = Record<VideoNodeId, NodeMetric>;

export type BottleneckKey =
  | 'healthy'
  | 'lb'
  | 'api'
  | 'apiScaling'
  | 'cache'
  | 'dbReads'
  | 'dbReadsCached'
  | 'dbWrites'
  | 'cdn'
  | 'blobOrigin'
  | 'blobNoCdn'
  | 'transcode';

export interface Bottleneck {
  nodeId: VideoNodeId | null;
  severity: NodeStatus;
  key: BottleneckKey;
}

export interface BottleneckCopy {
  title: string;
  body: string;
  fix: string;
}

export type EdgeCondition = 'cacheOn' | 'cacheOff' | 'cdnOn' | 'cdnOff';

export interface DiagramNodeLayout {
  x: number;
  y: number;
  label: string;
}

export interface DiagramEdge {
  id: string;
  path: string;
  /** Node whose load sets how busy this edge looks. */
  loadNode: VideoNodeId;
  visibleWhen?: EdgeCondition;
  /** Drawn dashed when this route skips a component that is turned off. */
  bypass?: boolean;
}

export interface CdnPricePoint {
  id: string;
  label: string;
  /** Short name for the checkpoint under the slider. */
  short: string;
  /** List price in USD per GB, North America and Europe. */
  pricePerGb: number;
  /** What the price applies to, e.g. a volume tier. */
  detail: string;
}

export interface PriceTier {
  /** Size of this tier in GB. Infinity for the last, open-ended tier. */
  sizeGb: number;
  pricePerGb: number;
}
