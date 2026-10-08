import { IDR_PER_USD, MAX_DISPLAY_LOAD } from '../constants';

const COMPACT_UNITS = [
  { value: 1e12, suffix: 'T' },
  { value: 1e9, suffix: 'B' },
  { value: 1e6, suffix: 'M' },
  { value: 1e3, suffix: 'K' },
] as const;

/** 23148 -> "23.1K", 2e9 -> "2.0B". */
export function formatCompact(value: number, digits = 1): string {
  const unit = COMPACT_UNITS.find(({ value: size }) => Math.abs(value) >= size);
  if (!unit) return value >= 100 ? Math.round(value).toString() : value.toFixed(value >= 10 ? 0 : digits);
  return `${(value / unit.value).toFixed(digits).replace(/\.0+$/, '')}${unit.suffix}`;
}

interface ScaleUnit {
  /** How many base units one of this unit is worth. */
  size: number;
  label: string;
}

/** Picks the largest unit the value reaches, so small numbers never show as 0.0. */
function formatScaled(value: number, units: readonly ScaleUnit[]): string {
  const unit = units.find(({ size }) => value >= size) ?? units[units.length - 1];
  const scaled = value / unit.size;
  const digits = scaled >= 100 ? 0 : scaled >= 10 ? 1 : 2;
  return `${scaled.toFixed(digits)} ${unit.label}`;
}

const STORAGE_UNITS: readonly ScaleUnit[] = [
  { size: 1e9, label: 'PB' },
  { size: 1e6, label: 'TB' },
  { size: 1e3, label: 'GB' },
  { size: 1, label: 'MB' },
  { size: 1e-3, label: 'KB' },
];

const BANDWIDTH_UNITS: readonly ScaleUnit[] = [
  { size: 1, label: 'Tbps' },
  { size: 1e-3, label: 'Gbps' },
  { size: 1e-6, label: 'Mbps' },
  { size: 1e-9, label: 'Kbps' },
  { size: 1e-12, label: 'bps' },
];

/** Storage given in MB, shown in the largest fitting unit from KB to PB. */
export function formatStorage(megabytes: number): string {
  return formatScaled(megabytes, STORAGE_UNITS);
}

export function formatUsd(value: number): string {
  if (value >= 1e3) return `$${formatCompact(value)}`;
  return `$${value.toFixed(value >= 10 ? 0 : 2)}`;
}

/** USD converted to Rupiah, written the Indonesian way (juta, miliar, triliun). */
export function formatIdr(usd: number): string {
  const idr = usd * IDR_PER_USD;
  if (idr >= 1e12) return `Rp${(idr / 1e12).toFixed(1)} triliun`;
  if (idr >= 1e9) return `Rp${(idr / 1e9).toFixed(1)} miliar`;
  return `Rp${(idr / 1e6).toFixed(1)} juta`;
}

/** Load as a percentage, capped so a runaway number stays readable. */
export function formatLoad(load: number): string {
  if (load > MAX_DISPLAY_LOAD) return `>${Math.round(MAX_DISPLAY_LOAD * 100)}%`;
  return `${Math.round(load * 100)}%`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 1) return '0s';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${minutes.toFixed(minutes < 10 ? 1 : 0)} min`;
  return `${(minutes / 60).toFixed(1)} h`;
}

/** Bandwidth given in Tbps, shown in the largest fitting unit from bps to Tbps. */
export function formatBandwidth(tbps: number): string {
  return formatScaled(tbps, BANDWIDTH_UNITS);
}

/** Traffic multiplier, e.g. 5 -> "5.0x". */
export function formatMultiplier(value: number): string {
  return `${value.toFixed(1)}x`;
}
