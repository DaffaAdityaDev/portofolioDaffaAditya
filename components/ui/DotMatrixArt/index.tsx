'use client';

import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  buildField,
  buildMask,
  computeLevels,
  placeholderStyle,
  resampleLuminance,
  sampleLuminance,
  type DotMatrixComposition,
  type DotMatrixImageFit,
  type DotMatrixRamp,
  type DotMatrixRenderer,
  type Drift,
  type LuminanceBuffer,
} from './field';
import {
  bakeBloom,
  bakeGlyphAtlas,
  drawBloom,
  drawCell,
  drawGrid,
  drawHudGrid,
  drawSignal,
  type GlyphAtlas,
} from './renderers';

export type { DotMatrixComposition, DotMatrixImageFit, DotMatrixRamp, DotMatrixRenderer } from './field';
export { fnv1a, hashHex, signalPosition } from './field';

export type DotMatrixMotion = 'idle' | 'hover' | 'none';

export interface DotMatrixArtProps {
  /** Seeds the composition. Use the engagement slug. */
  seed: string;
  /** Five hex colours, level 0..4. */
  ramp: DotMatrixRamp;
  /** Colour of the signal cell(s). */
  signal: string;
  renderer: DotMatrixRenderer;
  /** Same-origin image whose luminance shapes the field. */
  imageSrc?: string;
  /**
   * 'blend' (default): the image is one input of the light field. 'trace': the image is drawn
   * as pixel art, fitted 'contain' and anchored right, with only a faint field over it.
   */
  imageFit?: DotMatrixImageFit;
  /** CSS px per cell. Defaults to 8, or 10 for a hero at least 768px wide; 6 in trace mode. */
  cell?: number;
  /**
   * 'hero': light in the right third at mid-height, left 40% and top 140px held near-black.
   * 'card': top quarter capped under the HUD chips. Both dim to 60% below 480px wide.
   */
  composition?: DotMatrixComposition;
  /** idle: boot, scan and slow drift on its own. hover: scan and blink only while `active`. none: one still frame. */
  motion?: DotMatrixMotion;
  /** Hover or focus state of the parent card. */
  active?: boolean;
  className?: string;
}

const MAX_CELLS = 16_000;
/** Trace mode draws finer cells so the illustration's edges survive (6px over a 1440x900 hero). */
const MAX_CELLS_TRACE = 48_000;
const TRACE_CELL = 6;
const FRAME_MS = 1000 / 30;
/** Device-pixel cap on phones and other small or touch screens: the dot look holds at 1.5x and the canvases shrink ~44%. */
const MAX_DPR_COARSE = 1.5;
const DRIFT_MS = 1000 / 12;
const DRIFT_AMPLITUDE = 0.015;
const DRIFT_PERIOD_S = 20;
const BOOT_STEP_MS = 200;
const SCAN_ROWS = 6;
const SCAN_SPEED_ROWS_S = 8;
const SCAN_PAUSE_S = 2;
const HOVER_SCAN_PERIOD_S = 1.6;
const BLINK_DIM = 0.35;
/** How long the first frame waits for the screenshot before drawing the field alone. */
const IMAGE_WAIT_MS = 250;
const TIMED_OUT = Symbol('timed-out');
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface EngineOptions {
  wrap: HTMLDivElement;
  canvas: HTMLCanvasElement;
  seed: string;
  ramp: DotMatrixRamp;
  signal: string;
  renderer: DotMatrixRenderer;
  imageSrc?: string;
  imageFit: DotMatrixImageFit;
  cell?: number;
  composition: DotMatrixComposition;
  motion: DotMatrixMotion;
}

interface Engine {
  setActive: (active: boolean) => void;
  destroy: () => void;
}

const makeCanvas = (width: number, height: number): HTMLCanvasElement => {
  const c = document.createElement('canvas');
  c.width = Math.max(1, width);
  c.height = Math.max(1, height);
  return c;
};

/**
 * Imperative part of DotMatrixArt. Nothing is loaded or computed until the box is near the
 * viewport. The still frame (cells) is baked offscreen; an animated frame is one blit plus the few
 * cells that change (scan band), the HUD hairlines (drawn live, cheaper than a second full-size
 * layer) and the signal. It never reads the pointer.
 */
function createEngine(opts: EngineOptions): Engine {
  const { wrap, canvas, seed, ramp, signal, renderer, imageSrc, imageFit, composition, motion } = opts;
  const trace = imageFit === 'trace' && !!imageSrc;
  // With alpha: boot frames leave unrevealed cells transparent, over the placeholder glow.
  const ctx = canvas.getContext('2d');
  if (!ctx) return { setActive: () => {}, destroy: () => {} };

  const params = buildField(seed, composition);

  let destroyed = false;
  let near = false;
  let visible = false;
  let active = false;
  let ready = false;
  let buildToken = 0;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let cell = 8;
  let cols = 0;
  let rows = 0;
  let lumGrid: Float32Array | null = null;
  /** Fixed per-cell intensity (see `buildMask`): dark under the text, full behind the shots. */
  let mask: Float32Array | null = null;
  let levels: Uint8Array = new Uint8Array(0);
  let scratch: Uint8Array = new Uint8Array(0);
  let atlas: GlyphAtlas | null = null;
  let art: HTMLCanvasElement | null = null;
  let artCtx: CanvasRenderingContext2D | null = null;
  let bloom: HTMLCanvasElement | null = null;
  let sig = { x: 0, y: 0, w: 1, h: 1 };

  let raf = 0;
  let lastFrame = 0;
  let lastDrift = 0;
  let bootStart = -1;
  let bootThreshold = 5;
  let loopStart = 0;
  let drift: Drift = { dx: 0, dy: 0 };

  const shouldLoop = () => {
    if (!ready || !near || !visible || document.hidden || motion === 'none') return false;
    if (motion === 'idle') return true;
    return active;
  };

  /* ---------------- geometry and baking ---------------- */

  interface Geometry {
    width: number;
    height: number;
    dpr: number;
    cell: number;
    cols: number;
    rows: number;
  }

  /** Reads the box. Applied only by `build`, so the loop never sees a half-updated grid. */
  const measure = (): Geometry | null => {
    const rect = wrap.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w < 1 || h < 1) return null;
    const small = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
    const nextDpr = Math.min(window.devicePixelRatio || 1, small ? MAX_DPR_COARSE : 2);
    let nextCell = opts.cell ?? (trace ? TRACE_CELL : composition === 'hero' && w >= 768 ? 10 : 8);
    const maxCells = trace ? MAX_CELLS_TRACE : MAX_CELLS;
    while (Math.ceil(w / nextCell) * Math.ceil(h / nextCell) > maxCells) nextCell += 1;
    return { width: w, height: h, dpr: nextDpr, cell: nextCell, cols: Math.ceil(w / nextCell), rows: Math.ceil(h / nextCell) };
  };

  const differs = (g: Geometry) =>
    Math.round(g.width * g.dpr) !== canvas.width ||
    Math.round(g.height * g.dpr) !== canvas.height ||
    g.cols !== cols ||
    g.rows !== rows ||
    g.cell !== cell ||
    g.dpr !== dpr;

  const bake = () => {
    art = makeCanvas(Math.round(cols * cell * dpr), Math.round(rows * cell * dpr));
    artCtx = art.getContext('2d', { alpha: false });
    if (artCtx) {
      artCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGrid(artCtx, renderer, levels, cols, rows, cell, ramp, atlas);
    }
    bloom = bakeBloom(levels, cols, rows, ramp);
  };

  /** Re-quantizes with the screenshot once it has decoded, after a field-only first frame. */
  const applyLuminance = (lum: LuminanceBuffer) => {
    lumGrid = resampleLuminance(lum, cols, rows, imageFit);
    levels = computeLevels(params, cols, rows, lumGrid, drift, undefined, mask, imageFit);
    scratch = new Uint8Array(levels.length);
    bake();
    // A running loop (boot or idle) picks the new frame up by itself.
    if (!raf) drawStill();
  };

  const build = async (g: Geometry) => {
    const token = ++buildToken;
    let lum: LuminanceBuffer | null = null;
    let lateLum: Promise<LuminanceBuffer | null> | null = null;
    if (imageSrc) {
      // Wait briefly for the screenshot so the first frame already carries it. If it is slow (or
      // fails), draw the field alone now and upgrade when it arrives: the box never stays empty.
      const pending = sampleLuminance(imageSrc, g.cols / g.rows, imageFit).catch(() => null);
      const first = await Promise.race([pending, wait(IMAGE_WAIT_MS).then((): typeof TIMED_OUT => TIMED_OUT)]);
      if (first === TIMED_OUT) lateLum = pending;
      else lum = first;
    }
    if (destroyed || token !== buildToken) return;

    // Width matters too: the narrow-box dimming in the mask switches at 480px.
    const gridChanged =
      g.cols !== cols || g.rows !== rows || g.cell !== cell || g.dpr !== dpr || !ready || (g.width < 480) !== (width < 480);
    width = g.width;
    height = g.height;
    dpr = g.dpr;
    cell = g.cell;
    cols = g.cols;
    rows = g.rows;
    // Setting the size clears the canvas, so it happens right before the redraw below.
    const pw = Math.round(width * dpr);
    const ph = Math.round(height * dpr);
    if (canvas.width !== pw) canvas.width = pw;
    if (canvas.height !== ph) canvas.height = ph;

    if (gridChanged) {
      lumGrid = lum ? resampleLuminance(lum, cols, rows, imageFit) : null;
      mask = buildMask(composition, cols, rows, cell, width);
      levels = computeLevels(params, cols, rows, lumGrid, drift, undefined, mask, imageFit);
      scratch = new Uint8Array(levels.length);
      atlas = renderer === 'glyph' ? bakeGlyphAtlas(ramp, cell, dpr) : null;
      sig = {
        x: Math.max(0, Math.min(cols - params.signal.w, Math.floor(params.signal.x * cols))),
        y: Math.max(0, Math.min(rows - params.signal.h, Math.floor(params.signal.y * rows))),
        w: params.signal.w,
        h: params.signal.h,
      };
      bake();
    }

    const first = !ready;
    ready = true;
    if (first && motion === 'idle') {
      bootStart = performance.now();
      bootThreshold = 5;
    } else if (bootStart >= 0) {
      bootThreshold = 5;
    } else {
      drawStill();
    }
    if (first && motion !== 'idle') canvas.setAttribute('data-ready', '');
    update();

    if (lateLum) {
      const late = await lateLum;
      if (late && !destroyed && token === buildToken) applyLuminance(late);
    }
  };

  /* ---------------- drawing ---------------- */

  const blitBase = () => {
    if (!art) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.drawImage(art, 0, 0, cols * cell, rows * cell);
  };

  /** Expects the dpr transform already set (by `blitBase` or the boot frame). */
  const blitHud = () => {
    drawHudGrid(ctx, cols, rows, cell);
  };

  /** Glow over the cells, then the HUD grid. */
  const blitOverlay = () => {
    if (bloom) drawBloom(ctx, bloom, cols * cell, rows * cell);
    blitHud();
  };

  const drawStill = () => {
    if (!ready) return;
    blitBase();
    blitOverlay();
    drawSignal(ctx, renderer, sig.x, sig.y, sig.w, sig.h, cell, signal);
  };

  /** Scan band rows for this moment, or null between passes. */
  const scanTop = (t: number): number | null => {
    const span = rows + SCAN_ROWS;
    if (motion === 'hover') {
      const phase = (t % HOVER_SCAN_PERIOD_S) / HOVER_SCAN_PERIOD_S;
      return Math.floor(phase * span) - SCAN_ROWS;
    }
    const passS = span / SCAN_SPEED_ROWS_S;
    const phase = t % (passS + SCAN_PAUSE_S);
    if (phase > passS) return null;
    return Math.floor(phase * SCAN_SPEED_ROWS_S) - SCAN_ROWS;
  };

  const applyDrift = (t: number) => {
    const a = (t / DRIFT_PERIOD_S) * Math.PI * 2;
    drift = { dx: DRIFT_AMPLITUDE * Math.sin(a), dy: DRIFT_AMPLITUDE * Math.sin(a * 2 + Math.PI / 2) };
    const next = computeLevels(params, cols, rows, lumGrid, drift, scratch, mask, imageFit);
    if (artCtx) {
      for (let i = 0; i < next.length; i++) {
        if (next[i] === levels[i]) continue;
        const x = i % cols;
        drawCell(artCtx, renderer, x, (i - x) / cols, next[i], cell, ramp, atlas, true);
      }
    }
    scratch = levels;
    levels = next;
  };

  const frame = (now: number) => {
    raf = 0;
    if (!shouldLoop()) return;
    raf = requestAnimationFrame(frame);
    if (now - lastFrame < FRAME_MS - 1) return;
    lastFrame = now;

    // Boot: reveal from the brightest level down, three steps over 600ms.
    if (bootStart >= 0) {
      const threshold = Math.max(1, 4 - Math.floor((now - bootStart) / BOOT_STEP_MS));
      if (threshold !== bootThreshold) {
        bootThreshold = threshold;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        drawGrid(ctx, renderer, levels, cols, rows, cell, ramp, atlas, threshold);
        blitHud();
        drawSignal(ctx, renderer, sig.x, sig.y, sig.w, sig.h, cell, signal);
        if (!canvas.hasAttribute('data-ready')) canvas.setAttribute('data-ready', '');
      }
      if (threshold > 1) return;
      bootStart = -1;
      loopStart = now;
    }

    const t = (now - loopStart) / 1000;

    if (motion === 'idle' && now - lastDrift >= DRIFT_MS) {
      lastDrift = now;
      applyDrift(t);
    }

    blitBase();

    // Scan band: six rows one level brighter, except where the mask keeps the field dark for text.
    const top = scanTop(t);
    if (top !== null) {
      const y0 = Math.max(0, top);
      const y1 = Math.min(rows, top + SCAN_ROWS);
      for (let y = y0; y < y1; y++) {
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          if (mask && mask[i] < 0.5) continue;
          const level = levels[i];
          if (level < 4) drawCell(ctx, renderer, x, y, level + 1, cell, ramp, atlas, true);
        }
      }
    }

    blitOverlay();
    const alpha = Math.floor(t * 2) % 2 === 0 ? 1 : BLINK_DIM;
    drawSignal(ctx, renderer, sig.x, sig.y, sig.w, sig.h, cell, signal, alpha);
  };

  /** Starts or stops the loop to match the current state. */
  const update = () => {
    if (destroyed) return;
    if (shouldLoop()) {
      if (!raf) {
        lastFrame = 0;
        if (motion === 'hover' && bootStart < 0) loopStart = performance.now();
        raf = requestAnimationFrame(frame);
      }
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      // A paused boot jumps to the finished frame; a card that lost hover returns to its still frame.
      if (bootStart >= 0) {
        bootStart = -1;
        loopStart = performance.now();
        canvas.setAttribute('data-ready', '');
      }
      drawStill();
    }
  };

  /* ---------------- observers ---------------- */

  let resizeRaf = 0;
  const onResize = () => {
    if (resizeRaf) return;
    resizeRaf = requestAnimationFrame(() => {
      resizeRaf = 0;
      if (destroyed) return;
      if (!near) return;
      const g = measure();
      if (g && differs(g)) void build(g);
    });
  };
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(wrap);

  const nearObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting || near) return;
      near = true;
      nearObserver.disconnect();
      const g = measure();
      if (g) void build(g);
    },
    { rootMargin: '200px' },
  );
  nearObserver.observe(wrap);

  // Don't wait for the observer's first callback when the box is already on screen (the hero):
  // the art starts on mount, and a capture that never delivers that callback still gets a frame.
  const startIfNear = () => {
    if (near || destroyed) return;
    const rect = wrap.getBoundingClientRect();
    const margin = 200;
    if (rect.bottom < -margin || rect.top > window.innerHeight + margin || rect.width < 1 || rect.height < 1) return;
    near = true;
    nearObserver.disconnect();
    // The visibility observer may not have reported yet either; on screen means visible.
    if (rect.bottom > 0 && rect.top < window.innerHeight) visible = true;
    const g = measure();
    if (g) void build(g);
  };
  startIfNear();

  const visibleObserver = new IntersectionObserver(
    ([entry]) => {
      visible = !!entry?.isIntersecting;
      update();
    },
    { threshold: 0 },
  );
  visibleObserver.observe(wrap);

  const onVisibility = () => update();
  document.addEventListener('visibilitychange', onVisibility);

  return {
    setActive(next: boolean) {
      if (next === active) return;
      active = next;
      update();
    },
    destroy() {
      destroyed = true;
      buildToken++;
      if (raf) cancelAnimationFrame(raf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeObserver.disconnect();
      nearObserver.disconnect();
      visibleObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}

/**
 * Generative dot-matrix poster art: a seeded light field, optionally shaped by a screenshot,
 * drawn as pixels, halftone dots or glyphs. Purely decorative (aria-hidden). The server renders a
 * gradient placeholder with the same composition; the canvas fades in over it once drawn.
 * The parent must size the box (aspect-ratio or min-height) so nothing shifts.
 */
export default function DotMatrixArt({
  seed,
  ramp,
  signal,
  renderer,
  imageSrc,
  imageFit = 'blend',
  cell,
  composition = 'card',
  motion = 'hover',
  active = false,
  className = '',
}: DotMatrixArtProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const activeRef = useRef(active);
  const reduced = usePrefersReducedMotion();
  const effectiveMotion: DotMatrixMotion = reduced ? 'none' : motion;
  const rampKey = ramp.join(',');

  const placeholder = placeholderStyle(seed, ramp, composition);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const engine = createEngine({
      wrap,
      canvas,
      seed,
      ramp: rampKey.split(',') as DotMatrixRamp,
      signal,
      renderer,
      imageSrc,
      imageFit,
      cell,
      composition,
      motion: effectiveMotion,
    });
    engineRef.current = engine;
    engine.setActive(activeRef.current);
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [seed, rampKey, signal, renderer, imageSrc, imageFit, cell, composition, effectiveMotion]);

  useEffect(() => {
    activeRef.current = active;
    engineRef.current?.setActive(active);
  }, [active]);

  return (
    <div ref={wrapRef} aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`} style={placeholder}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full max-w-full opacity-0 transition-opacity duration-300 motion-reduce:transition-none data-[ready]:opacity-100"
      />
    </div>
  );
}
