import type { CSSProperties } from 'react';

/**
 * Seeded light field behind the dot-matrix art. Pure: runs on the server (placeholder, signal
 * position) and in the browser (levels). Ported from the art prototype: the draws from the PRNG
 * happen in a fixed order, so the same seed always gives the same composition.
 */

export type DotMatrixRenderer = 'pixel' | 'halftone' | 'glyph';
export type DotMatrixComposition = 'card' | 'hero';
/**
 * How the image shapes the field. 'blend': the image is one input of the seeded light field
 * (screenshots on case-study covers). 'trace': the image *is* the picture, with only a faint field
 * on top so it still drifts; fitted 'contain', anchored right.
 */
export type DotMatrixImageFit = 'blend' | 'trace';
/** Five colours, level 0 (background) to level 4 (brightest). */
export type DotMatrixRamp = [string, string, string, string, string];

/** 4x4 ordered-dither matrix. */
export const BAYER4: readonly (readonly number[])[] = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** FNV-1a, 32 bit, over the UTF-8 bytes. */
export function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  const bytes = new TextEncoder().encode(input);
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i];
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** 8-digit upper-case hex, e.g. "5EAFC77C". */
export const hashHex = (h: number): string => h.toString(16).toUpperCase().padStart(8, '0');

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Core {
  cx: number;
  cy: number;
  cos: number;
  sin: number;
  sx: number;
  sy: number;
  weight: number;
}

export interface SignalSpec {
  /** Normalised position of the signal's top-left cell, 0..1. */
  x: number;
  y: number;
  /** Size in cells. */
  w: number;
  h: number;
}

export interface FieldParams {
  /** Floor of the field: the hero lifts it so the whole poster glows, not one blob. */
  base: number;
  /** Weight of the light cores. */
  coreGain: number;
  /** Image mix: how much of the field survives, and the screenshot's weight. */
  fieldKeep: number;
  imageGain: number;
  cores: Core[];
  bandCos: number;
  bandSin: number;
  bandFreq: number;
  bandPhase: number;
  /** 5 rows x 7 columns of value noise. */
  lattice: Float32Array;
  signal: SignalSpec;
}

const LATTICE_COLS = 7;
const LATTICE_ROWS = 5;
const SIGNAL_JITTER = 0.06;

const fieldCache = new Map<string, FieldParams>();

export function buildField(seed: string, composition: DotMatrixComposition): FieldParams {
  const key = `${seed}|${composition}`;
  const cached = fieldCache.get(key);
  if (cached) return cached;

  const rng = mulberry32(fnv1a(seed));
  const cores: Core[] = [];
  const n = 1 + (rng() > 0.5 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    const hero = composition === 'hero';
    // Hero: the light sits in the right third, around mid-height, behind the product shots and
    // away from the title column and the navbar. Card: below the HUD chips along the top edge.
    const cx = hero ? 0.7 + rng() * 0.16 : 0.3 + rng() * 0.45;
    const cy = hero ? 0.42 + rng() * 0.16 : 0.4 + rng() * 0.3;
    const angle = rng() * Math.PI;
    // Hero cores are wider so the light fills the poster rather than sitting in one corner.
    const sx = hero ? 0.2 + rng() * 0.12 : 0.18 + rng() * 0.14;
    const sy = sx * (0.35 + rng() * 0.4);
    cores.push({ cx, cy, cos: Math.cos(angle), sin: Math.sin(angle), sx, sy, weight: i === 0 ? 1 : 0.6 });
  }

  const bandAngle = rng() * Math.PI;
  const bandFreq = 6 + rng() * 10;
  const bandPhase = rng() * Math.PI * 2;

  const lattice = new Float32Array(LATTICE_COLS * LATTICE_ROWS);
  for (let i = 0; i < lattice.length; i++) lattice[i] = rng();

  // Signal: core 0 plus a small seeded offset. Seed only, so the server can place the HUD label.
  const clamp01 = (v: number) => Math.min(0.94, Math.max(0.04, v));
  const sigX = clamp01(cores[0].cx + (rng() * 2 - 1) * SIGNAL_JITTER);
  const sigY = clamp01(cores[0].cy + (rng() * 2 - 1) * SIGNAL_JITTER);
  const sigW = 1 + Math.floor(rng() * 2);
  const sigH = 1 + Math.floor(rng() * 2);

  const params: FieldParams = {
    // Tuned with a per-slug level histogram: the hero puts roughly half its cells at level 2+.
    base: composition === 'hero' ? 0.26 : 0.07,
    coreGain: composition === 'hero' ? 0.72 : 0.62,
    fieldKeep: composition === 'hero' ? 0.55 : 0.45,
    imageGain: composition === 'hero' ? 0.5 : 0.6,
    cores,
    bandCos: Math.cos(bandAngle),
    bandSin: Math.sin(bandAngle),
    bandFreq,
    bandPhase,
    lattice,
    signal: { x: sigX, y: sigY, w: sigW, h: sigH },
  };
  fieldCache.set(key, params);
  return params;
}

export const signalPosition = (seed: string, composition: DotMatrixComposition): SignalSpec =>
  buildField(seed, composition).signal;

const smoothstep = (e0: number, e1: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

function noise(lattice: Float32Array, u: number, v: number): number {
  const x = u * (LATTICE_COLS - 1);
  const y = v * (LATTICE_ROWS - 1);
  const ix = Math.min(Math.floor(x), LATTICE_COLS - 2);
  const iy = Math.min(Math.floor(y), LATTICE_ROWS - 2);
  let fx = x - ix;
  let fy = y - iy;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = lattice[iy * LATTICE_COLS + ix];
  const b = lattice[iy * LATTICE_COLS + ix + 1];
  const c = lattice[(iy + 1) * LATTICE_COLS + ix];
  const d = lattice[(iy + 1) * LATTICE_COLS + ix + 1];
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/** Normalised core offset for the idle drift. */
export interface Drift {
  dx: number;
  dy: number;
}

/** Share of the seeded field kept over a traced image. */
const TRACE_FIELD = 0.12;
/** Dither amplitude in trace mode: enough to soften flat faces, not enough to scatter edges. */
const TRACE_DITHER = 0.7;

/**
 * Quantised levels (0..4) for a cols x rows grid. `lum` is the screenshot's luminance, already
 * resampled to the same grid (see `resampleLuminance`).
 */
export function computeLevels(
  params: FieldParams,
  cols: number,
  rows: number,
  lum?: Float32Array | null,
  drift?: Drift,
  out?: Uint8Array,
  mask?: Float32Array | null,
  fit: DotMatrixImageFit = 'blend',
): Uint8Array {
  const levels = out && out.length === cols * rows ? out : new Uint8Array(cols * rows);
  const aspect = cols / rows;
  const ddx = drift?.dx ?? 0;
  const ddy = drift?.dy ?? 0;
  const { base, coreGain, fieldKeep, imageGain, cores, bandCos, bandSin, bandFreq, bandPhase, lattice } = params;

  for (let y = 0; y < rows; y++) {
    const v = (y + 0.5) / rows;
    const bayerRow = BAYER4[y & 3];
    for (let x = 0; x < cols; x++) {
      const u = (x + 0.5) / cols;

      let core = 0;
      for (let i = 0; i < cores.length; i++) {
        const c = cores[i];
        const dx = (u - c.cx - ddx) * aspect;
        const dy = v - c.cy - ddy;
        const rx = dx * c.cos + dy * c.sin;
        const ry = -dx * c.sin + dy * c.cos;
        const gx = rx / (c.sx * aspect);
        const gy = ry / (c.sy * 1.6);
        const g = Math.exp(-(gx * gx + gy * gy)) * c.weight;
        if (g > core) core = g;
      }

      const d = u * bandCos + v * bandSin;
      const bands = 0.5 + 0.5 * Math.sin(d * bandFreq * Math.PI + bandPhase);
      let val = base + coreGain * core + 0.14 * bands * (0.4 + 0.6 * core) + 0.23 * noise(lattice, u, v);

      if (lum && fit === 'trace') {
        // The illustration carries the picture; a trace of the field keeps drift and scan alive.
        val = lum[y * cols + x] + TRACE_FIELD * val;
        if (mask) val *= mask[y * cols + x];
        const level = Math.floor(val * 5 + (bayerRow[x & 3] / 16 - 0.5) * TRACE_DITHER);
        levels[y * cols + x] = level < 0 ? 0 : level > 4 ? 4 : level;
        continue;
      }
      if (lum) {
        // The screenshot reads most strongly inside the light cores (e.g. Run System's chart bars).
        const img = lum[y * cols + x];
        val = fieldKeep * val + imageGain * img * (0.45 + 0.55 * core) + 0.08;
      }
      // Hot centre: the middle of each core blooms to the top levels whatever the screenshot holds
      // there, while its shoulders keep the screenshot's structure. core^2.5 keeps the bloom tight
      // (about 10-20% of core cells at level 4; tuned with a per-slug histogram).
      const bloom = core * core * Math.sqrt(core) * 0.98;
      if (bloom > val) val = bloom;
      // Keeps text areas (hero title column, navbar, card HUD chips) on dark cells.
      if (mask) val *= mask[y * cols + x];

      const level = Math.floor(val * 5 + (bayerRow[x & 3] / 16 - 0.5) * 0.9);
      levels[y * cols + x] = level < 0 ? 0 : level > 4 ? 4 : level;
    }
  }
  return levels;
}

/* ------------------------------------------------------------------ */
/* Intensity mask                                                     */
/* ------------------------------------------------------------------ */

/** Field multiplier where text sits over the art. Level 1 tops out at 0.4, so 0.2 keeps cells near-black. */
const MASK_FLOOR = 0.2;
/** Hero: px from the top that stay dark (navbar and the back row), and how far the fade runs. */
const HERO_TOP_DARK_PX = 140;
const HERO_TOP_FADE_PX = 90;
/** Card: alpha of the top quarter (under the HUD chips), back to full by half height. */
const CARD_TOP_ALPHA = 0.35;
/** Below this width the whole field is dimmed, so the screenshot stays the brightest thing. */
const NARROW_PX = 480;
const NARROW_INTENSITY = 0.6;

/**
 * Per-cell multiplier for the field (0..1), fixed for a given box. Hero: the left 40% (title and
 * summary) and the top 140px are held near-black, fading in to full strength by 70% across.
 * Card: the top edge is capped so the HUD chips sit on dark cells.
 */
export function buildMask(
  composition: DotMatrixComposition,
  cols: number,
  rows: number,
  cell: number,
  width: number,
): Float32Array {
  const mask = new Float32Array(cols * rows);
  const overall = width < NARROW_PX ? NARROW_INTENSITY : 1;
  for (let y = 0; y < rows; y++) {
    const v = (y + 0.5) / rows;
    const py = (y + 0.5) * cell;
    const vertical =
      composition === 'hero'
        ? MASK_FLOOR + (1 - MASK_FLOOR) * smoothstep(HERO_TOP_DARK_PX, HERO_TOP_DARK_PX + HERO_TOP_FADE_PX, py)
        : CARD_TOP_ALPHA + (1 - CARD_TOP_ALPHA) * smoothstep(0.25, 0.5, v);
    for (let x = 0; x < cols; x++) {
      const u = (x + 0.5) / cols;
      const horizontal = composition === 'hero' ? MASK_FLOOR + (1 - MASK_FLOOR) * smoothstep(0.4, 0.7, u) : 1;
      mask[y * cols + x] = Math.min(vertical, horizontal) * overall;
    }
  }
  return mask;
}

/* ------------------------------------------------------------------ */
/* Screenshot luminance (browser only)                                */
/* ------------------------------------------------------------------ */

const SAMPLE_WIDTH = 192;
/** Trace mode keeps the illustration's edges at ~6px cells across a wide hero. */
const TRACE_SAMPLE_WIDTH = 480;

export interface LuminanceBuffer {
  data: Float32Array;
  width: number;
  height: number;
}

/** Sampled luminance per `src|aspect`. Only the small buffer is retained, never the decoded image. */
const luminanceCache = new Map<string, Promise<LuminanceBuffer | null>>();
/** Decodes in flight, shared by concurrent requests for one src; dropped once settled so the image can be collected. */
const pendingImages = new Map<string, Promise<HTMLImageElement | null>>();

function loadImage(src: string): Promise<HTMLImageElement | null> {
  let pending = pendingImages.get(src);
  if (!pending) {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    pending = img
      .decode()
      .then(() => img)
      .catch(() => null)
      .finally(() => pendingImages.delete(src));
    pendingImages.set(src, pending);
  }
  return pending;
}

/**
 * Luminance of `src`, centre-cropped to `aspect` (object-fit: cover) at 192px wide, inverted when
 * the image is mostly light so its structure reads on a dark field. Cached per src and aspect.
 */
export function sampleLuminance(
  src: string,
  aspect: number,
  fit: DotMatrixImageFit = 'blend',
): Promise<LuminanceBuffer | null> {
  const roundedAspect = Math.round(aspect * 100) / 100;
  const sampleWidth = fit === 'trace' ? TRACE_SAMPLE_WIDTH : SAMPLE_WIDTH;
  const key = `${src}|${roundedAspect}|${fit}|${sampleWidth}`;
  let cached = luminanceCache.get(key);
  if (!cached) {
    cached = loadImage(src).then((img) => {
      if (!img) return null;
      return fit === 'trace' ? traceImage(img, roundedAspect, sampleWidth) : sampleImage(img, roundedAspect);
    });
    luminanceCache.set(key, cached);
  }
  return cached;
}

function sampleImage(img: HTMLImageElement, aspect: number): LuminanceBuffer | null {
  if (!img.naturalWidth || !img.naturalHeight) return null;

  const width = SAMPLE_WIDTH;
  const height = Math.max(1, Math.round(SAMPLE_WIDTH / aspect));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;
  if (iw / ih > aspect) {
    sw = ih * aspect;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / aspect;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);

  const { data: rgba } = ctx.getImageData(0, 0, width, height);
  const data = new Float32Array(width * height);
  let sum = 0;
  for (let i = 0, p = 0; i < data.length; i++, p += 4) {
    const l = (0.2126 * rgba[p] + 0.7152 * rgba[p + 1] + 0.0722 * rgba[p + 2]) / 255;
    data[i] = l;
    sum += l;
  }
  if (sum / data.length > 0.5) {
    for (let i = 0; i < data.length; i++) data[i] = 1 - data[i];
  }

  return { data, width, height };
}

const TRACE_PEAK = 0.75;
const TRACE_LUM = 0.6;

/**
 * Trace mode: the whole image fitted 'contain' into the box, anchored right and centred
 * vertically, over black. No inversion: the illustration is light shapes on black by design.
 * Brightness mixes the brightest channel with luminance, so saturated reds (luminance only ~0.3)
 * still reach the top levels while lit and shaded faces stay apart.
 */
function traceImage(img: HTMLImageElement, aspect: number, sampleWidth: number): LuminanceBuffer | null {
  if (!img.naturalWidth || !img.naturalHeight) return null;

  const width = sampleWidth;
  const height = Math.max(1, Math.round(sampleWidth / aspect));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, width - dw, (height - dh) / 2, dw, dh);

  const { data: rgba } = ctx.getImageData(0, 0, width, height);
  const data = new Float32Array(width * height);
  for (let i = 0, p = 0; i < data.length; i++, p += 4) {
    const r = rgba[p];
    const g = rgba[p + 1];
    const b = rgba[p + 2];
    const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    const peak = Math.max(r, g, b) / 255;
    data[i] = Math.min(1, TRACE_PEAK * peak + TRACE_LUM * lum);
  }
  return { data, width, height };
}

/**
 * Box-averages the cached luminance down to the grid, then applies the contrast curve (blend), or
 * passes it through untouched (trace: the image already holds its own contrast).
 */
export function resampleLuminance(
  buffer: LuminanceBuffer,
  cols: number,
  rows: number,
  fit: DotMatrixImageFit = 'blend',
): Float32Array {
  const out = new Float32Array(cols * rows);
  const { data, width, height } = buffer;
  for (let y = 0; y < rows; y++) {
    const y0 = Math.floor((y / rows) * height);
    const y1 = Math.max(y0 + 1, Math.floor(((y + 1) / rows) * height));
    for (let x = 0; x < cols; x++) {
      const x0 = Math.floor((x / cols) * width);
      const x1 = Math.max(x0 + 1, Math.floor(((x + 1) / cols) * width));
      let sum = 0;
      let count = 0;
      for (let yy = y0; yy < y1 && yy < height; yy++) {
        for (let xx = x0; xx < x1 && xx < width; xx++) {
          sum += data[yy * width + xx];
          count++;
        }
      }
      const avg = count ? sum / count : 0;
      out[y * cols + x] = fit === 'trace' ? avg : smoothstep(0.12, 0.85, avg);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Server placeholder                                                 */
/* ------------------------------------------------------------------ */

/** What the box shows before the canvas has drawn, and without JS: a glow at core 0 over a dot grid. */
export function placeholderStyle(
  seed: string,
  ramp: DotMatrixRamp,
  composition: DotMatrixComposition,
): CSSProperties {
  const { cores } = buildField(seed, composition);
  const cx = (cores[0].cx * 100).toFixed(1);
  const cy = (cores[0].cy * 100).toFixed(1);
  const hero = composition === 'hero';
  // Same intent as `buildMask`, so the first paint does not flash light behind the text.
  const shade = hero
    ? 'linear-gradient(90deg, #0a0a0a 0 40%, transparent 70%), linear-gradient(to bottom, #0a0a0a 0 140px, transparent 230px)'
    : 'linear-gradient(to bottom, rgba(6,6,8,0.65) 0 25%, transparent 50%)';
  return {
    background: [
      shade,
      `radial-gradient(ellipse ${hero ? '40% 38%' : '30% 26%'} at ${cx}% ${cy}%, ${ramp[3]}55, transparent 70%)`,
      `radial-gradient(ellipse ${hero ? '60% 55%' : '45% 35%'} at ${cx}% ${cy}%, ${ramp[2]}66, transparent 70%)`,
      `radial-gradient(ellipse 95% 85% at ${cx}% ${cy}%, ${ramp[1]}, transparent 80%)`,
      'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px) 0 0 / 8px 8px',
      ramp[0],
    ].join(', '),
  };
}
