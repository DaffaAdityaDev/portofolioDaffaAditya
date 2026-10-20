import { clamp } from '@/utils/math';
import type {
  Bottleneck,
  BottleneckKey,
  CapacityEstimates,
  NodeMetric,
  NodeStatus,
  SimFlows,
  SimMetrics,
  SimRuntime,
  SimSample,
  VideoConstraints,
  VideoDesignChoices,
  VideoNodeId,
} from '../types';
import {
  AUTOSCALE,
  CAPACITY,
  DAYS_PER_MONTH,
  MB_PER_GB,
  MBITS_PER_MB,
  MBITS_PER_TBIT,
  SECONDS_PER_DAY,
  SECONDS_PER_HOUR,
  SIM,
  STATUS_THRESHOLDS,
  TRAFFIC,
} from '../constants';
import { NODE_IDS } from '../constants/diagram';
import {
  formatCompact,
  formatDuration,
  formatLoad,
  formatBandwidth,
} from './format';

/** Smallest capacity used as a divisor, keeps "zero workers" from producing NaN. */
const MIN_CAPACITY = 1e-6;

const ratio = (demand: number, capacity: number): number => demand / Math.max(capacity, MIN_CAPACITY);
const servedShare = (demand: number, capacity: number): number =>
  demand <= 0 ? 1 : clamp(capacity / demand, 0, 1);
const mbToTbps = (mb: number): number => (mb * MBITS_PER_MB) / MBITS_PER_TBIT;

function statusFromLoad(load: number): NodeStatus {
  if (load >= STATUS_THRESHOLDS.critical) return 'critical';
  if (load >= STATUS_THRESHOLDS.warn) return 'warn';
  return 'ok';
}

/** Average requests per second implied by the product constraints. */
function baseRates(c: VideoConstraints): { views: number; uploads: number } {
  const views = (c.dailyActiveUsersM * 1e6 * c.viewsPerUserPerDay) / SECONDS_PER_DAY;
  return { views, uploads: views / c.readWriteRatio };
}

export function calculateEstimates(c: VideoConstraints): CapacityEstimates {
  const { views, uploads } = baseRates(c);
  const viewsPerDay = views * SECONDS_PER_DAY;
  const uploadsPerDay = uploads * SECONDS_PER_DAY;
  return {
    viewsPerDay,
    monthlyEgressGb: viewsPerDay * (c.avgVideoSizeMb / MB_PER_GB) * DAYS_PER_MONTH,
    viewsPerSecond: views,
    uploadsPerDay,
    storageMbPerDay: uploadsPerDay * c.avgVideoSizeMb,
    egressCostPerDayUsd: viewsPerDay * (c.avgVideoSizeMb / MB_PER_GB) * c.cdnCostPerGb,
    avgEgressTbps: mbToTbps(views * c.avgVideoSizeMb),
  };
}

export function createInitialRuntime(choices: VideoDesignChoices): SimRuntime {
  return {
    time: 0,
    targetMultiplier: SIM.minMultiplier,
    multiplier: SIM.minMultiplier,
    apiServers: choices.baselineApiServers,
    backlog: 0,
    spikeEndsAt: null,
    history: [],
  };
}

function transcodeCapacity(choices: VideoDesignChoices): number {
  return choices.transcodeWorkers * CAPACITY.transcodeVideosPerWorker;
}

function playbackSuccess(f: Omit<SimFlows, 'successRate'>, cacheOn: boolean): number {
  const dbServed = servedShare(f.dbReadDemand, f.dbReadCapacity);
  const metadataServed = cacheOn ? f.cacheHitRatio + (1 - f.cacheHitRatio) * dbServed : dbServed;
  const cdnServed = servedShare(f.egressTbps, f.cdnCapacityTbps);
  const originServed = servedShare(f.originTbps, f.originCapacityTbps);

  return (
    servedShare(f.lbDemand, f.lbCapacity) *
    servedShare(f.apiDemand, f.apiCapacity) *
    metadataServed *
    originServed *
    (f.cdnCapacityTbps > 0 ? cdnServed : 1)
  );
}

/** Demand and capacity of every component for the current runtime state. */
export function computeFlows(
  c: VideoConstraints,
  choices: VideoDesignChoices,
  sim: SimRuntime,
): SimFlows {
  const base = baseRates(c);
  const views = base.views * sim.multiplier;
  const uploads = base.uploads * sim.multiplier;
  const apiServers = choices.autoscaleEnabled ? sim.apiServers : choices.baselineApiServers;
  const cacheHitRatio = choices.cacheEnabled ? TRAFFIC.cacheHitRatio : 0;
  const egressTbps = mbToTbps(views * c.avgVideoSizeMb);
  const ingestTbps = mbToTbps(uploads * c.avgVideoSizeMb);
  const dbNodes = choices.dbShards * (1 + choices.dbReplicas);
  const transcodeRate = transcodeCapacity(choices);

  const flows = {
    views,
    uploads,
    lbDemand: views + uploads,
    lbCapacity: CAPACITY.lbRps,
    apiServers,
    apiDemand: views + uploads,
    apiCapacity: apiServers * CAPACITY.apiRpsPerServer,
    cacheHitRatio,
    cacheDemand: choices.cacheEnabled ? views : 0,
    cacheCapacity: CAPACITY.cacheOps,
    dbReadDemand: views * (1 - cacheHitRatio),
    dbReadCapacity: dbNodes * CAPACITY.dbReadQpsPerNode,
    dbWriteDemand: uploads * TRAFFIC.dbWritesPerUpload + views * TRAFFIC.engagementWriteRatio,
    dbWriteCapacity: choices.dbShards * CAPACITY.dbWriteQpsPerShard,
    egressTbps,
    cdnCapacityTbps: choices.cdnEnabled ? CAPACITY.cdnTbps : 0,
    originTbps:
      (choices.cdnEnabled ? egressTbps * (1 - TRAFFIC.cdnOriginOffload) : egressTbps) + ingestTbps,
    originCapacityTbps: CAPACITY.originTbps,
    transcodeDemand: uploads,
    transcodeCapacity: transcodeRate,
    backlog: sim.backlog,
    queueDelaySeconds: sim.backlog / Math.max(transcodeRate, MIN_CAPACITY),
    egressCostPerHourUsd:
      views * SECONDS_PER_HOUR * (c.avgVideoSizeMb / MB_PER_GB) * c.cdnCostPerGb,
  };

  return { ...flows, successRate: playbackSuccess(flows, choices.cacheEnabled) };
}

function metric(
  id: VideoNodeId,
  load: number,
  headline: string,
  detail: string,
  status: NodeStatus = statusFromLoad(load),
): NodeMetric {
  return { id, load, status, headline, detail };
}

function dbMetric(f: SimFlows): NodeMetric {
  const readLoad = ratio(f.dbReadDemand, f.dbReadCapacity);
  const writeLoad = ratio(f.dbWriteDemand, f.dbWriteCapacity);
  const detail =
    `reads ${formatCompact(f.dbReadDemand)} of ${formatCompact(f.dbReadCapacity)} qps, ` +
    `writes ${formatCompact(f.dbWriteDemand)} of ${formatCompact(f.dbWriteCapacity)} qps`;
  const load = Math.max(readLoad, writeLoad);
  return metric('db', load, formatLoad(load), detail);
}

function queueMetric(f: SimFlows): NodeMetric {
  const load = f.queueDelaySeconds / SIM.queueDelayBudgetSeconds;
  return metric(
    'queue',
    load,
    `${formatCompact(f.backlog)} queued`,
    `Videos wait about ${formatDuration(f.queueDelaySeconds)} before they are playable`,
  );
}

/** One metric per diagram node, ready for display. */
export function computeMetrics(f: SimFlows, choices: VideoDesignChoices): SimMetrics {
  const apiLoad = ratio(f.apiDemand, f.apiCapacity);
  const lbLoad = ratio(f.lbDemand, f.lbCapacity);
  const cacheLoad = ratio(f.cacheDemand, f.cacheCapacity);
  const cdnLoad = ratio(f.egressTbps, f.cdnCapacityTbps);
  const blobLoad = ratio(f.originTbps, f.originCapacityTbps);
  const workerLoad = ratio(f.transcodeDemand, f.transcodeCapacity);

  return {
    clients: metric('clients', 0, `${formatCompact(f.views)}/s`, `${formatCompact(f.views)} playback starts per second`, 'ok'),
    lb: metric('lb', lbLoad, formatLoad(lbLoad), `${formatCompact(f.lbDemand)} of ${formatCompact(f.lbCapacity)} req/s`),
    api: metric('api', apiLoad, formatLoad(apiLoad), `${formatCompact(f.apiDemand)} of ${formatCompact(f.apiCapacity)} req/s on ${f.apiServers} servers`),
    cache: choices.cacheEnabled
      ? metric('cache', cacheLoad, formatLoad(cacheLoad), `${Math.round(f.cacheHitRatio * 100)}% hit ratio, ${formatCompact(f.cacheDemand)} lookups/s`)
      : metric('cache', 0, 'OFF', 'Cache is disabled, every view reads the database', 'off'),
    db: dbMetric(f),
    cdn: choices.cdnEnabled
      ? metric('cdn', cdnLoad, formatLoad(cdnLoad), `${formatBandwidth(f.egressTbps)} of ${formatBandwidth(f.cdnCapacityTbps)} edge bandwidth`)
      : metric('cdn', 0, 'OFF', 'CDN is disabled, storage serves every viewer', 'off'),
    blob: metric('blob', blobLoad, formatLoad(blobLoad), `${formatBandwidth(f.originTbps)} of ${formatBandwidth(f.originCapacityTbps)} origin bandwidth`),
    queue: queueMetric(f),
    transcoder: metric('transcoder', workerLoad, formatLoad(workerLoad), `${formatCompact(f.transcodeDemand)} of ${formatCompact(f.transcodeCapacity)} videos/s`),
  };
}

function bottleneckKey(id: VideoNodeId, f: SimFlows, choices: VideoDesignChoices): BottleneckKey {
  switch (id) {
    case 'lb':
      return 'lb';
    case 'api':
      return choices.autoscaleEnabled ? 'apiScaling' : 'api';
    case 'cache':
      return 'cache';
    case 'db':
      if (ratio(f.dbWriteDemand, f.dbWriteCapacity) > ratio(f.dbReadDemand, f.dbReadCapacity)) return 'dbWrites';
      return choices.cacheEnabled ? 'dbReadsCached' : 'dbReads';
    case 'cdn':
      return 'cdn';
    case 'blob':
      return choices.cdnEnabled ? 'blobOrigin' : 'blobNoCdn';
    default:
      return 'transcode';
  }
}

/** The most loaded component, or a healthy result when nothing is near its limit. */
export function findBottleneck(
  metrics: SimMetrics,
  f: SimFlows,
  choices: VideoDesignChoices,
): Bottleneck {
  const worst = NODE_IDS.filter((id) => id !== 'clients' && metrics[id].status !== 'off').reduce(
    (top, id) => (metrics[id].load > metrics[top].load ? id : top),
    'lb' as VideoNodeId,
  );
  const { load, status } = metrics[worst];

  if (load < STATUS_THRESHOLDS.warn) return { nodeId: null, severity: 'ok', key: 'healthy' };
  return { nodeId: worst, severity: status, key: bottleneckKey(worst, f, choices) };
}

interface DesignView {
  flows: SimFlows;
  metrics: SimMetrics;
  bottleneck: Bottleneck;
}

let lastDerived: {
  constraints: VideoConstraints;
  choices: VideoDesignChoices;
  sim: SimRuntime;
  view: DesignView;
} | null = null;

/**
 * Flows, metrics and bottleneck for one moment of the simulation. The diagram
 * and the readout both ask for the same moment on every tick, so the last answer
 * is reused instead of being computed once per component.
 */
export function deriveDesign(
  constraints: VideoConstraints,
  choices: VideoDesignChoices,
  sim: SimRuntime,
): DesignView {
  const last = lastDerived;
  if (last && last.constraints === constraints && last.choices === choices && last.sim === sim) {
    return last.view;
  }

  const flows = computeFlows(constraints, choices, sim);
  const metrics = computeMetrics(flows, choices);
  const view = { flows, metrics, bottleneck: findBottleneck(metrics, flows, choices) };
  lastDerived = { constraints, choices, sim, view };
  return view;
}

/** Highest load among components that are switched on. */
export function worstLoad(metrics: SimMetrics): number {
  return Math.max(...NODE_IDS.filter((id) => metrics[id].status !== 'off').map((id) => metrics[id].load));
}

function easeToward(current: number, target: number): number {
  const diff = target - current;
  return Math.abs(diff) < SIM.snapDistance ? target : current + diff * SIM.rampEase;
}

/** Autoscaler: adds servers quickly but never instantly, and sheds them slowly. */
function nextApiServers(
  current: number,
  demand: number,
  choices: VideoDesignChoices,
): number {
  if (!choices.autoscaleEnabled) return choices.baselineApiServers;

  const needed = Math.ceil(demand / (CAPACITY.apiRpsPerServer * AUTOSCALE.targetUtilization));
  const desired = clamp(needed, choices.baselineApiServers, AUTOSCALE.maxServers);
  if (desired > current) return Math.min(desired, current + AUTOSCALE.stepUp);
  return Math.max(desired, current - AUTOSCALE.stepDown);
}

/** Advances the simulation by one tick. Pure: returns a new runtime. */
export function stepSimulation(
  sim: SimRuntime,
  c: VideoConstraints,
  choices: VideoDesignChoices,
): SimRuntime {
  const dt = SIM.secondsPerTick;
  const time = sim.time + dt;
  const spikeOver = sim.spikeEndsAt !== null && time >= sim.spikeEndsAt;
  const targetMultiplier = spikeOver ? SIM.minMultiplier : sim.targetMultiplier;
  const multiplier = easeToward(sim.multiplier, targetMultiplier);

  const base = baseRates(c);
  const apiServers = nextApiServers(sim.apiServers, (base.views + base.uploads) * multiplier, choices);
  const surplus = base.uploads * multiplier - transcodeCapacity(choices);
  const backlog = Math.max(0, sim.backlog + surplus * dt);

  const next: SimRuntime = {
    ...sim,
    time,
    targetMultiplier,
    multiplier,
    apiServers,
    backlog,
    spikeEndsAt: spikeOver ? null : sim.spikeEndsAt,
  };
  const flows = computeFlows(c, choices, next);
  const sample: SimSample = {
    time,
    multiplier,
    worstLoad: worstLoad(computeMetrics(flows, choices)),
    successRate: flows.successRate,
  };

  return { ...next, history: [...sim.history, sample].slice(-SIM.historyLength) };
}
