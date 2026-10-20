import type { NetworkProfile, NetworkProfileId, Rendition } from './types';

/** The bitrate ladder: one rendition per rung, typical H.264 bitrates. */
export const ABR_LADDER: Rendition[] = [
  { label: '240p', mbps: 0.4 },
  { label: '360p', mbps: 0.8 },
  { label: '480p', mbps: 1.4 },
  { label: '720p', mbps: 2.8 },
  { label: '1080p', mbps: 5 },
];

export const ABR = {
  segmentSeconds: 4,
  maxBufferSeconds: 30,
  /** How long Auto waits on a segment that arrives too slowly before giving up on it. */
  abandonAfterSeconds: 2,
  /** The player only steps up with at least this much buffered. */
  stepUpBufferSeconds: 12,
  /** Use only this share of the measured bandwidth, to leave room for a dip. */
  safetyFactor: 0.8,
  /** Weight of the newest measurement in the bandwidth estimate. */
  estimateWeight: 0.5,
  /** Before the first segment arrives the player guesses a middle rung. */
  initialEstimateMbps: 1.8,
} as const;

const SEGMENT_COUNT = 30;

/** Bandwidth that sits at `base` with a small, repeatable wobble. */
const wobble = (base: number, index: number, amount: number) => base + Math.sin(index * 1.7) * amount;

const profile = (fn: (index: number) => number) =>
  Array.from({ length: SEGMENT_COUNT }, (_, index) => Number(fn(index).toFixed(2)));

export const ABR_PROFILES: Record<NetworkProfileId, NetworkProfile> = {
  steady: {
    id: 'steady',
    label: 'Home Wi-Fi',
    summary: 'Plenty of bandwidth. Auto climbs to 1080p within a few segments and stays there.',
    mbps: profile((i) => wobble(8.5, i, 0.6)),
  },
  lift: {
    id: 'lift',
    label: 'Walk into a lift',
    summary: 'Good signal, then almost none for half a minute, then good again.',
    mbps: profile((i) => (i >= 9 && i < 17 ? wobble(0.7, i, 0.15) : wobble(7, i, 0.5))),
  },
  train: {
    id: 'train',
    label: 'Train ride',
    summary: 'The signal rises and falls every few segments, between barely enough and good.',
    mbps: profile((i) => 3.6 + Math.sin(i * 0.55) * 2.4 + Math.sin(i * 1.9) * 0.4),
  },
};

export const ABR_PROFILE_ORDER: NetworkProfileId[] = ['steady', 'lift', 'train'];

export const ABR_CHART = {
  width: 720,
  rateHeight: 170,
  bufferHeight: 80,
  gap: 26,
  padLeft: 40,
  padRight: 8,
  padTop: 10,
  maxMbps: 10,
  networkColor: '#a3a3a3',
  pickedColor: '#0e9ae0',
  stallColor: '#ef4444',
  gridColor: '#262626',
  axisTextClass: 'fill-neutral-500 font-mono',
  minWidthClass: 'min-w-[560px]',
} as const;
