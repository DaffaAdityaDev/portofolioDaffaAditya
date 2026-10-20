import type {
  CdnPricePoint,
  DesignPreset,
  NodeStatus,
  PriceTier,
  VideoConstraints,
  VideoDesignChoices,
} from '../types';
import { WIDGET_COLORS } from '@/features/Blog/components/widgetStyles';

export const SECONDS_PER_DAY = 86_400;
export const SECONDS_PER_HOUR = 3_600;
export const DAYS_PER_YEAR = 365;
export const DAYS_PER_MONTH = 30;
/** Approximate exchange rate, only used to show the cost in Rupiah. */
export const IDR_PER_USD = 15_500;
export const MB_PER_GB = 1_000;
export const MBITS_PER_MB = 8;
export const MBITS_PER_TBIT = 1_000_000;

export const DEFAULT_CONSTRAINTS: VideoConstraints = {
  dailyActiveUsersM: 400,
  viewsPerUserPerDay: 5,
  readWriteRatio: 100,
  avgVideoSizeMb: 100,
  cdnCostPerGb: 0.02,
};

interface SliderLimit {
  min: number;
  max: number;
  step: number;
}

export const CONSTRAINT_LIMITS: Record<keyof VideoConstraints, SliderLimit> = {
  dailyActiveUsersM: { min: 10, max: 1000, step: 10 },
  viewsPerUserPerDay: { min: 1, max: 20, step: 1 },
  readWriteRatio: { min: 10, max: 500, step: 10 },
  avgVideoSizeMb: { min: 10, max: 1000, step: 10 },
  cdnCostPerGb: { min: 0.002, max: 0.12, step: 0.001 },
};

export const CHOICE_LIMITS = {
  baselineApiServers: { min: 10, max: 200, step: 5 },
  dbReplicas: { min: 0, max: 8, step: 1 },
  dbShards: { min: 1, max: 8, step: 1 },
  transcodeWorkers: { min: 100, max: 2000, step: 50 },
} as const satisfies Record<string, SliderLimit>;

export const DESIGN_PRESETS: Record<DesignPreset, VideoDesignChoices> = {
  naive: {
    cdnEnabled: false,
    cacheEnabled: false,
    autoscaleEnabled: false,
    baselineApiServers: 40,
    dbReplicas: 0,
    dbShards: 1,
    transcodeWorkers: 300,
  },
  balanced: {
    cdnEnabled: true,
    cacheEnabled: true,
    autoscaleEnabled: false,
    baselineApiServers: 40,
    dbReplicas: 2,
    dbShards: 2,
    transcodeWorkers: 800,
  },
  hardened: {
    cdnEnabled: true,
    cacheEnabled: true,
    autoscaleEnabled: true,
    baselineApiServers: 60,
    dbReplicas: 4,
    dbShards: 4,
    transcodeWorkers: 1200,
  },
};

export const PRESET_LABELS: Record<DesignPreset, string> = {
  naive: 'Naive',
  balanced: 'Blog design',
  hardened: 'Hardened',
};

export const DEFAULT_PRESET: DesignPreset = 'balanced';

/** Illustrative capacities. Real numbers vary, the ratios are what matter. */
export const CAPACITY = {
  apiRpsPerServer: 1_000,
  lbRps: 250_000,
  cacheOps: 600_000,
  dbReadQpsPerNode: 5_000,
  dbWriteQpsPerShard: 3_000,
  cdnTbps: 150,
  originTbps: 10,
  transcodeVideosPerWorker: 0.5,
} as const;

export const TRAFFIC = {
  cacheHitRatio: 0.9,
  /** Share of video bytes the CDN serves without touching origin storage. */
  cdnOriginOffload: 0.95,
  dbWritesPerUpload: 3,
  /** Likes, comments and counters written per view. */
  engagementWriteRatio: 0.01,
} as const;

export const AUTOSCALE = {
  targetUtilization: 0.6,
  stepUp: 8,
  stepDown: 2,
  maxServers: 400,
} as const;

export const SIM = {
  tickMs: 250,
  secondsPerTick: 1,
  rampEase: 0.35,
  snapDistance: 0.02,
  historyLength: 60,
  minMultiplier: 1,
  maxMultiplier: 10,
  multiplierStep: 0.5,
  viralMultiplier: 5,
  viralHoldSeconds: 45,
  /** A transcode wait longer than this counts as fully saturated. */
  queueDelayBudgetSeconds: 60,
  /** Margin before the simulator scrolls into view and starts ticking. */
  viewportMargin: '200px 0px',
} as const;

export const STATUS_THRESHOLDS = {
  warn: 0.7,
  critical: 1,
} as const;

export const SUCCESS_THRESHOLDS = {
  good: 0.99,
  degraded: 0.9,
} as const;

export const STATUS_COLORS: Record<NodeStatus, string> = {
  ok: WIDGET_COLORS.recovery,
  warn: '#fbbf24',
  critical: WIDGET_COLORS.error,
  off: WIDGET_COLORS.idle,
};

export const MAX_DISPLAY_LOAD = 9.99;

/** When the CDN prices below were last checked. List prices change, re-check before quoting. */
export const CDN_PRICES_CHECKED = 'October 2026';

/** Published list prices for North America and Europe, cheapest first. */
export const CDN_PRICE_POINTS: CdnPricePoint[] = [
  { id: 'bunny-volume', short: 'Bunny', label: 'Bunny.net', pricePerGb: 0.002, detail: '1 to 2 PB per month' },
  { id: 'bunny', short: 'Bunny', label: 'Bunny.net', pricePerGb: 0.01, detail: 'standard' },
  { id: 'aws-top', short: 'AWS', label: 'AWS CloudFront', pricePerGb: 0.02, detail: 'above 5 PB per month' },
  { id: 'google', short: 'Google', label: 'Google Cloud CDN', pricePerGb: 0.08, detail: 'first 10 TiB' },
  { id: 'azure', short: 'Azure', label: 'Azure CDN', pricePerGb: 0.081, detail: 'first 10 TB' },
  { id: 'aws', short: 'AWS', label: 'AWS CloudFront', pricePerGb: 0.085, detail: 'first 10 TB' },
  { id: 'fastly', short: 'Fastly', label: 'Fastly', pricePerGb: 0.12, detail: 'low volume' },
];

export const CDN_PRICE_SOURCES = [
  { label: 'AWS CloudFront', href: 'https://aws.amazon.com/cloudfront/pricing/pay-as-you-go/' },
  { label: 'Azure CDN', href: 'https://azure.microsoft.com/en-us/pricing/details/cdn/' },
  { label: 'CDN comparison', href: 'https://egresscost.com/cdn-pricing/' },
] as const;

/** AWS CloudFront data transfer out, US and Europe. The first 1 TB each month is free. */
export const AWS_CLOUDFRONT_TIERS: PriceTier[] = [
  { sizeGb: 1_000, pricePerGb: 0 },
  { sizeGb: 9_000, pricePerGb: 0.085 },
  { sizeGb: 40_000, pricePerGb: 0.08 },
  { sizeGb: 100_000, pricePerGb: 0.06 },
  { sizeGb: 350_000, pricePerGb: 0.04 },
  { sizeGb: 524_000, pricePerGb: 0.03 },
  { sizeGb: 4_096_000, pricePerGb: 0.025 },
  { sizeGb: Infinity, pricePerGb: 0.02 },
];

/** The price slider moves along equally spaced checkpoints, not along raw dollars. */
export const CDN_SLIDER = {
  step: 0.01,
  /** Releasing the thumb this close to a checkpoint snaps onto it. */
  snapRadius: 0.25,
  /** Prices are stored rounded to this many decimals, which hides float drift. */
  decimals: 4,
  priceEpsilon: 1e-9,
} as const;
