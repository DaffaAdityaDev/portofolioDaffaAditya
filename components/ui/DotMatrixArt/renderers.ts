import type { DotMatrixRamp, DotMatrixRenderer } from './field';

/** Colour of the faint level-0 dot for halftone and glyph. */
const EMPTY_DOT = '#18181b';
const HUD_LINE = 'rgba(255,255,255,0.04)';
const HUD_CROSS = 'rgba(255,255,255,0.14)';
/** Columns between HUD lines, and rows between crosses. */
const HUD_STEP = 8;

export interface GlyphAtlas {
  canvas: HTMLCanvasElement;
  /** Sprite edge in device pixels. */
  sprite: number;
}

/* ------------------------------------------------------------------ */
/* Glyph atlas                                                        */
/* ------------------------------------------------------------------ */

const atlasCache = new Map<string, GlyphAtlas>();

/**
 * Five sprites, one per level, in the site's matrix vocabulary: faint dot, small dot, plus,
 * boxed dot, solid cell. Baked once per ramp, cell size and pixel ratio.
 */
export function bakeGlyphAtlas(ramp: DotMatrixRamp, cell: number, dpr: number): GlyphAtlas {
  const key = `${ramp.join(',')}|${cell}|${dpr}`;
  const cached = atlasCache.get(key);
  if (cached) return cached;

  const sprite = Math.max(1, Math.round(cell * dpr));
  const canvas = document.createElement('canvas');
  canvas.width = sprite * 5;
  canvas.height = sprite;
  const ctx = canvas.getContext('2d');
  const atlas = { canvas, sprite };
  if (!ctx) return atlas;

  const half = sprite / 2;
  const arm = sprite * 0.32;
  const px = dpr;

  // 0: 1px dot
  ctx.fillStyle = EMPTY_DOT;
  ctx.fillRect(Math.round(half - px / 2), Math.round(half - px / 2), Math.max(1, Math.round(px)), Math.max(1, Math.round(px)));

  // 1: 2px dot
  {
    const ox = sprite;
    const s = Math.max(1, Math.round(2 * px));
    ctx.fillStyle = ramp[1];
    ctx.fillRect(Math.round(ox + half - s / 2), Math.round(half - s / 2), s, s);
  }

  // 2: plus
  {
    const ox = sprite * 2;
    ctx.strokeStyle = ramp[2];
    ctx.lineWidth = 1.5 * px;
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(ox + half - arm, half);
    ctx.lineTo(ox + half + arm, half);
    ctx.moveTo(ox + half, half - arm);
    ctx.lineTo(ox + half, half + arm);
    ctx.stroke();
  }

  // 3: boxed dot
  {
    const ox = sprite * 3;
    ctx.strokeStyle = ramp[3];
    ctx.fillStyle = ramp[3];
    ctx.lineWidth = 1.25 * px;
    ctx.strokeRect(ox + half - arm, half - arm, arm * 2, arm * 2);
    const d = Math.max(1, Math.round(1.5 * px));
    ctx.fillRect(Math.round(ox + half - d / 2), Math.round(half - d / 2), d, d);
  }

  // 4: solid cell with a 1px gutter
  ctx.fillStyle = ramp[4];
  ctx.fillRect(sprite * 4, 0, sprite - Math.round(px), sprite - Math.round(px));

  atlasCache.set(key, atlas);
  return atlas;
}

/* ------------------------------------------------------------------ */
/* Cells                                                              */
/* ------------------------------------------------------------------ */

/**
 * Draws one cell. The context is in CSS pixels. With `clear`, the cell is first reset to the
 * background so a lower level can replace a higher one.
 */
export function drawCell(
  ctx: CanvasRenderingContext2D,
  renderer: DotMatrixRenderer,
  x: number,
  y: number,
  level: number,
  cell: number,
  ramp: DotMatrixRamp,
  atlas: GlyphAtlas | null,
  clear: boolean,
): void {
  const px = x * cell;
  const py = y * cell;
  if (clear) {
    ctx.fillStyle = ramp[0];
    ctx.fillRect(px, py, cell, cell);
  }
  switch (renderer) {
    case 'pixel':
      if (level === 0) return;
      ctx.fillStyle = ramp[level];
      ctx.fillRect(px, py, cell - 1, cell - 1);
      return;
    case 'halftone':
      if (level === 0) {
        ctx.fillStyle = EMPTY_DOT;
        ctx.fillRect(px + cell / 2 - 0.5, py + cell / 2 - 0.5, 1, 1);
        return;
      }
      ctx.fillStyle = ramp[level];
      ctx.beginPath();
      ctx.arc(px + cell / 2, py + cell / 2, cell * 0.5 * Math.sqrt(level / 4), 0, Math.PI * 2);
      ctx.fill();
      return;
    case 'glyph':
      if (!atlas) return;
      ctx.drawImage(atlas.canvas, level * atlas.sprite, 0, atlas.sprite, atlas.sprite, px, py, cell, cell);
      return;
  }
}

/**
 * Paints the whole grid. Pixel and halftone batch by level (one fill style, one path per level).
 * Cells below `minLevel` stay background, for the boot reveal.
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  renderer: DotMatrixRenderer,
  levels: Uint8Array,
  cols: number,
  rows: number,
  cell: number,
  ramp: DotMatrixRamp,
  atlas: GlyphAtlas | null,
  minLevel = 0,
): void {
  if (minLevel > 0) {
    // Boot frames stay transparent below the threshold, so the placeholder glow shows through
    // instead of a black box.
    ctx.clearRect(0, 0, cols * cell, rows * cell);
  } else {
    ctx.fillStyle = ramp[0];
    ctx.fillRect(0, 0, cols * cell, rows * cell);
  }

  if (renderer === 'glyph') {
    if (!atlas) return;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const level = levels[y * cols + x];
        if (level < minLevel) continue;
        ctx.drawImage(atlas.canvas, level * atlas.sprite, 0, atlas.sprite, atlas.sprite, x * cell, y * cell, cell, cell);
      }
    }
    return;
  }

  for (let level = Math.max(0, minLevel); level < 5; level++) {
    if (renderer === 'pixel') {
      if (level === 0) continue;
      ctx.fillStyle = ramp[level];
      for (let i = 0; i < levels.length; i++) {
        if (levels[i] !== level) continue;
        const x = i % cols;
        const y = (i - x) / cols;
        ctx.fillRect(x * cell, y * cell, cell - 1, cell - 1);
      }
    } else if (level === 0) {
      ctx.fillStyle = EMPTY_DOT;
      for (let i = 0; i < levels.length; i++) {
        if (levels[i] !== 0) continue;
        const x = i % cols;
        const y = (i - x) / cols;
        ctx.fillRect(x * cell + cell / 2 - 0.5, y * cell + cell / 2 - 0.5, 1, 1);
      }
    } else {
      const r = cell * 0.5 * Math.sqrt(level / 4);
      ctx.fillStyle = ramp[level];
      ctx.beginPath();
      for (let i = 0; i < levels.length; i++) {
        if (levels[i] !== level) continue;
        const x = i % cols;
        const y = (i - x) / cols;
        const cx = x * cell + cell / 2;
        const cy = y * cell + cell / 2;
        ctx.moveTo(cx + r, cy);
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }
}

/* ------------------------------------------------------------------ */
/* HUD and signal                                                     */
/* ------------------------------------------------------------------ */

/** Hairline every 8 columns and a small cross at every 8x8 intersection. Drawn on a transparent layer. */
export function drawHudGrid(ctx: CanvasRenderingContext2D, cols: number, rows: number, cell: number): void {
  const height = rows * cell;

  ctx.fillStyle = HUD_LINE;
  for (let x = HUD_STEP; x < cols; x += HUD_STEP) {
    ctx.fillRect(x * cell, 0, 1, height);
  }

  ctx.strokeStyle = HUD_CROSS;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let y = HUD_STEP; y < rows; y += HUD_STEP) {
    for (let x = HUD_STEP; x < cols; x += HUD_STEP) {
      const cx = x * cell + 0.5;
      const cy = y * cell + 0.5;
      ctx.moveTo(cx - 2.5, cy);
      ctx.lineTo(cx + 2.5, cy);
      ctx.moveTo(cx, cy - 2.5);
      ctx.lineTo(cx, cy + 2.5);
    }
  }
  ctx.stroke();
}

/* ------------------------------------------------------------------ */
/* Bloom                                                              */
/* ------------------------------------------------------------------ */

/** Only these levels glow. */
const BLOOM_MIN_LEVEL = 2;
/** Cells per bloom pixel. */
const BLOOM_DOWNSAMPLE = 2;
/** Strength of the glow, added with 'lighter'. */
export const BLOOM_ALPHA = 0.35;

const hexRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1, 7), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Three-tap box blur along one axis, in place through `tmp`. */
function boxBlur(src: Float32Array, tmp: Float32Array, w: number, h: number, horizontal: boolean): void {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        let n = 0;
        for (let k = -1; k <= 1; k++) {
          const xx = horizontal ? x + k : x;
          const yy = horizontal ? y : y + k;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          sum += src[(yy * w + xx) * 3 + c];
          n++;
        }
        tmp[(y * w + x) * 3 + c] = sum / n;
      }
    }
  }
  src.set(tmp);
}

/**
 * A small, blurred image of the bright cells. Drawn scaled up over the art with 'lighter', it
 * gives the cores a hot glow. Built from the levels on the CPU rather than with ctx.filter, which
 * not every browser supports. Returns null where there is no DOM.
 */
export function bakeBloom(levels: Uint8Array, cols: number, rows: number, ramp: DotMatrixRamp): HTMLCanvasElement | null {
  const w = Math.max(1, Math.ceil(cols / BLOOM_DOWNSAMPLE));
  const h = Math.max(1, Math.ceil(rows / BLOOM_DOWNSAMPLE));
  const rgb = ramp.map(hexRgb);
  const buf = new Float32Array(w * h * 3);
  const area = BLOOM_DOWNSAMPLE * BLOOM_DOWNSAMPLE;
  for (let y = 0; y < rows; y++) {
    const by = Math.floor(y / BLOOM_DOWNSAMPLE);
    for (let x = 0; x < cols; x++) {
      const level = levels[y * cols + x];
      if (level < BLOOM_MIN_LEVEL) continue;
      const o = (by * w + Math.floor(x / BLOOM_DOWNSAMPLE)) * 3;
      const [r, g, b] = rgb[level];
      buf[o] += r / area;
      buf[o + 1] += g / area;
      buf[o + 2] += b / area;
    }
  }
  const tmp = new Float32Array(buf.length);
  for (let pass = 0; pass < 2; pass++) {
    boxBlur(buf, tmp, w, h, true);
    boxBlur(buf, tmp, w, h, false);
  }

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const img = ctx.createImageData(w, h);
  for (let i = 0, p = 0; i < w * h; i++, p += 4) {
    img.data[p] = buf[i * 3];
    img.data[p + 1] = buf[i * 3 + 1];
    img.data[p + 2] = buf[i * 3 + 2];
    img.data[p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

/** Adds the bloom layer over whatever is on `ctx`. */
export function drawBloom(ctx: CanvasRenderingContext2D, bloom: HTMLCanvasElement, width: number, height: number): void {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = BLOOM_ALPHA;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bloom, 0, 0, width, height);
  ctx.restore();
}

/** Opacity of the one-cell ring around the signal. */
const SIGNAL_HALO_ALPHA = 0.25;

/**
 * The signal, in the renderer's own shape, with a faint one-cell halo so it reads as the poster's
 * anchor. Always drawn last, at full opacity unless blinking.
 */
export function drawSignal(
  ctx: CanvasRenderingContext2D,
  renderer: DotMatrixRenderer,
  sx: number,
  sy: number,
  w: number,
  h: number,
  cell: number,
  color: string,
  alpha = 1,
): void {
  ctx.fillStyle = color;
  const paint = (x: number, y: number) => {
    const px = x * cell;
    const py = y * cell;
    if (renderer === 'halftone') {
      ctx.beginPath();
      ctx.arc(px + cell / 2, py + cell / 2, cell * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(px, py, cell - 1, cell - 1);
    }
  };
  ctx.globalAlpha = alpha * SIGNAL_HALO_ALPHA;
  for (let y = sy - 1; y <= sy + h; y++) {
    for (let x = sx - 1; x <= sx + w; x++) {
      const inside = x >= sx && x < sx + w && y >= sy && y < sy + h;
      if (!inside) paint(x, y);
    }
  }
  ctx.globalAlpha = alpha;
  for (let y = sy; y < sy + h; y++) {
    for (let x = sx; x < sx + w; x++) paint(x, y);
  }
  ctx.globalAlpha = 1;
}
