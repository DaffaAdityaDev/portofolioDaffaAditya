'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

export type CyberPalette = 'lime' | 'red' | 'cyan' | 'white';

interface CyberMatrixShaderProps {
  className?: string;
  palette?: CyberPalette;
  spotlightRadius?: number;
  interactive?: boolean;
  targetRef?: React.RefObject<HTMLElement | null>;
  onPaletteChange?: (palette: CyberPalette) => void;
  showToggle?: boolean;
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

const PALETTE_COLORS: Record<CyberPalette, { primary: string; glow: string; label: string }> = {
  red: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.6)', label: 'SYSTEM RED' },
  lime: { primary: '#ccff00', glow: 'rgba(204, 255, 0, 0.6)', label: 'CYBER LIME' },
  cyan: { primary: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)', label: 'NEO CYAN' },
  white: { primary: '#ffffff', glow: 'rgba(255, 255, 255, 0.4)', label: 'MONO WHITE' },
};

const GLYPH_COUNT = 9;
const CELL_SIZE = 22;

// Vector glyph rendering routine (executed exclusively during offscreen sprite baking)
function drawGlyph(
  ctx: CanvasRenderingContext2D,
  type: number,
  cx: number,
  cy: number,
  size: number,
  color: string,
  lineWidth: number
) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const r = size * 0.38;

  switch (type) {
    case 0: // Concentric Circle (Outer ring + inner ring + center dot)
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, size * 0.1), 0, Math.PI * 2);
      ctx.fill();
      break;

    case 1: // Target Crosshair (Circle with cross lines)
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - r, cy);
      ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r);
      ctx.lineTo(cx, cy + r);
      ctx.stroke();
      break;

    case 2: // Bold Plus (+)
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.9, cy);
      ctx.lineTo(cx + r * 0.9, cy);
      ctx.moveTo(cx, cy - r * 0.9);
      ctx.lineTo(cx, cy + r * 0.9);
      ctx.stroke();
      break;

    case 3: // Diagonal Forward Slash (/)
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.8, cy + r * 0.8);
      ctx.lineTo(cx + r * 0.8, cy - r * 0.8);
      ctx.stroke();
      break;

    case 4: // Diagonal Backslash (\)
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.8, cy - r * 0.8);
      ctx.lineTo(cx + r * 0.8, cy + r * 0.8);
      ctx.stroke();
      break;

    case 5: // Box with center dot (⊡)
      ctx.beginPath();
      ctx.strokeRect(cx - r * 0.85, cy - r * 0.85, r * 1.7, r * 1.7);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(1, size * 0.12), 0, Math.PI * 2);
      ctx.fill();
      break;

    case 6: // Simple Circle (○)
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case 7: // Bold Cross (X)
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.8, cy - r * 0.8);
      ctx.lineTo(cx + r * 0.8, cy + r * 0.8);
      ctx.moveTo(cx + r * 0.8, cy - r * 0.8);
      ctx.lineTo(cx - r * 0.8, cy + r * 0.8);
      ctx.stroke();
      break;

    case 8: // 2x2 Micro Dots (::)
    default: {
      const d = r * 0.45;
      const dotR = Math.max(1, size * 0.08);
      ctx.beginPath();
      ctx.arc(cx - d, cy - d, dotR, 0, Math.PI * 2);
      ctx.arc(cx + d, cy - d, dotR, 0, Math.PI * 2);
      ctx.arc(cx - d, cy + d, dotR, 0, Math.PI * 2);
      ctx.arc(cx + d, cy + d, dotR, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

// Pre-render glyph sprite atlas offscreen (Row 0: idle, Row 1: active neon, Row 2: inverted cutout)
function createGlyphAtlas(paletteColor: string, dpr: number): { canvas: HTMLCanvasElement; spriteSize: number } {
  const spriteSize = Math.round(CELL_SIZE * dpr);
  const atlas = document.createElement('canvas');
  atlas.width = GLYPH_COUNT * spriteSize;
  atlas.height = 3 * spriteSize;

  const ctx = atlas.getContext('2d', { alpha: true });
  if (!ctx) return { canvas: atlas, spriteSize };

  for (let g = 0; g < GLYPH_COUNT; g++) {
    const cx = g * spriteSize + spriteSize / 2;

    // Row 0: Idle resting blueprint glyph
    drawGlyph(ctx, g, cx, spriteSize * 0.5, spriteSize, '#888888', 1.1 * dpr);

    // Row 1: Active spotlight neon glyph
    drawGlyph(ctx, g, cx, spriteSize * 1.5, spriteSize, paletteColor, 1.5 * dpr);

    // Row 2: Inverted cutout glyph for solid blocks
    drawGlyph(ctx, g, cx, spriteSize * 2.5, spriteSize, '#050505', 1.8 * dpr);
  }

  return { canvas: atlas, spriteSize };
}

interface Cell {
  glyph: number;
  isSolid: boolean;
  isDivider: boolean;
  clusterId: number;
}

export const CyberMatrixShader: React.FC<CyberMatrixShaderProps> = ({
  className = '',
  palette: initialPalette = 'red',
  spotlightRadius = 260,
  interactive = true,
  targetRef,
  onPaletteChange,
  showToggle = false,
  onCanvasReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPalette, setCurrentPalette] = useState<CyberPalette>(initialPalette);

  // Smooth lerp mouse / radar coordinates
  const mouseRef = useRef({
    targetX: -1000,
    targetY: -1000,
    currentX: -1000,
    currentY: -1000,
    isHovered: false,
    lastActivity: Date.now(),
  });

  const cellsRef = useRef<Cell[][]>([]);
  const gridConfigRef = useRef({ cols: 0, rows: 0, cellSize: CELL_SIZE });
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });
  const isVisibleRef = useRef(true);

  // Cached offscreen surfaces
  const atlasRef = useRef<{ canvas: HTMLCanvasElement; spriteSize: number } | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeTheme = PALETTE_COLORS[currentPalette];

  // Bake the static idle background matrix once to an offscreen canvas
  const bakeBackground = useCallback((cols: number, rows: number, cellSize: number, dpr: number) => {
    const atlas = atlasRef.current;
    if (!atlas || cols === 0 || rows === 0) return;

    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = Math.round(cols * cellSize * dpr);
    bgCanvas.height = Math.round(rows * cellSize * dpr);

    const bgCtx = bgCanvas.getContext('2d', { alpha: true });
    if (!bgCtx) return;

    const matrix = cellsRef.current;
    const { canvas: spriteCanvas, spriteSize } = atlas;

    bgCtx.scale(dpr, dpr);

    for (let r = 0; r < rows; r++) {
      const row = matrix[r];
      if (!row) continue;
      const py = r * cellSize;

      for (let c = 0; c < cols; c++) {
        const cell = row[c];
        if (!cell) continue;
        const px = c * cellSize;

        if (cell.isSolid) {
          // Idle solid block faint background
          bgCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
          bgCtx.globalAlpha = 1;
          bgCtx.fillRect(px, py, cellSize, cellSize);

          bgCtx.globalAlpha = 0.08;
          bgCtx.drawImage(
            spriteCanvas,
            cell.glyph * spriteSize,
            0,
            spriteSize,
            spriteSize,
            px,
            py,
            cellSize,
            cellSize
          );
        } else {
          // Standard idle ambient glyph
          bgCtx.globalAlpha = cell.isDivider ? 0.09 : 0.045;
          bgCtx.drawImage(
            spriteCanvas,
            cell.glyph * spriteSize,
            0,
            spriteSize,
            spriteSize,
            px,
            py,
            cellSize,
            cellSize
          );
        }
      }
    }

    bgCtx.globalAlpha = 1;
    bgCanvasRef.current = bgCanvas;
  }, []);

  // Initialize cellular matrix structure and solid clusters
  const buildGrid = useCallback((width: number, height: number, dpr: number) => {
    const cellSize = CELL_SIZE;
    const cols = Math.ceil(width / cellSize) + 1;
    const rows = Math.ceil(height / cellSize) + 1;

    gridConfigRef.current = { cols, rows, cellSize };
    dimensionsRef.current = { width, height, dpr };

    const matrix: Cell[][] = [];
    for (let r = 0; r < rows; r++) {
      matrix[r] = [];
      for (let c = 0; c < cols; c++) {
        const glyph = Math.floor(Math.random() * GLYPH_COUNT);
        const isDivider = c % 8 === 0;
        matrix[r][c] = {
          glyph,
          isSolid: false,
          isDivider,
          clusterId: -1,
        };
      }
    }

    // Carve neon technical clusters
    const solidBlocksCount = Math.max(3, Math.floor((cols * rows) / 95));
    for (let i = 0; i < solidBlocksCount; i++) {
      const bw = Math.floor(Math.random() * 3) + 2;
      const bh = Math.floor(Math.random() * 5) + 3;
      const bx = Math.floor(Math.random() * Math.max(1, cols - bw - 2)) + 1;
      const by = Math.floor(Math.random() * Math.max(1, rows - bh - 2)) + 1;

      for (let y = by; y < by + bh; y++) {
        for (let x = bx; x < bx + bw; x++) {
          if (matrix[y] && matrix[y][x]) {
            matrix[y][x].isSolid = true;
            matrix[y][x].clusterId = i;
          }
        }
      }
    }

    cellsRef.current = matrix;

    // Refresh offscreen sprite atlas and baked background
    atlasRef.current = createGlyphAtlas(activeTheme.primary, dpr);
    bakeBackground(cols, rows, cellSize, dpr);
  }, [activeTheme.primary, bakeBackground]);

  // Handle resizing and initial setup with ResizeObserver & IntersectionObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      buildGrid(rect.width, rect.height, dpr);
    };

    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [buildGrid]);

  // Re-bake sprite sheet when palette changes
  useEffect(() => {
    const dpr = dimensionsRef.current.dpr || 1;
    const { cols, rows, cellSize } = gridConfigRef.current;
    atlasRef.current = createGlyphAtlas(activeTheme.primary, dpr);
    if (cols > 0 && rows > 0) {
      bakeBackground(cols, rows, cellSize, dpr);
    }
  }, [activeTheme.primary, bakeBackground]);

  // Expose canvas for 3D optical transmission / external references
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (typeof window !== 'undefined') {
      (window as unknown as { __cyberMatrixCanvas__?: HTMLCanvasElement }).__cyberMatrixCanvas__ = canvas;
    }
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }
  }, [onCanvasReady]);

  // Ultra-optimized 60FPS render loop: Single background blit + Bounding box sprite blitting
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    const render = () => {
      animId = requestAnimationFrame(render);

      // Skip work completely when offscreen
      if (!isVisibleRef.current) return;

      frameCount++;
      const { cols, rows, cellSize } = gridConfigRef.current;
      const { width, height, dpr } = dimensionsRef.current;
      const bgCanvas = bgCanvasRef.current;
      const atlas = atlasRef.current;

      if (cols === 0 || rows === 0 || width === 0 || height === 0 || !bgCanvas || !atlas) {
        return;
      }

      const m = mouseRef.current;
      const now = Date.now();

      // Autonomous idle radar sweep when no pointer interaction for 2.2s
      if (now - m.lastActivity > 2200) {
        const time = now * 0.001;
        m.targetX = (Math.sin(time * 0.7) * 0.42 + 0.5) * width;
        m.targetY = (Math.cos(time * 0.45) * 0.35 + 0.48) * height;
      }

      // Smooth physics lerp
      m.currentX += (m.targetX - m.currentX) * 0.14;
      m.currentY += (m.targetY - m.currentY) * 0.14;

      // Occasional random cell telemetry mutation: patched directly onto background
      if (frameCount % 8 === 0) {
        const bgCtx = bgCanvas.getContext('2d');
        if (bgCtx) {
          const rx = Math.floor(Math.random() * cols);
          const ry = Math.floor(Math.random() * rows);
          const matrix = cellsRef.current;
          if (matrix[ry] && matrix[ry][rx]) {
            const cell = matrix[ry][rx];
            cell.glyph = Math.floor(Math.random() * GLYPH_COUNT);
            const px = rx * cellSize * dpr;
            const py = ry * cellSize * dpr;
            const sz = cellSize * dpr;
            bgCtx.clearRect(px, py, sz, sz);
            bgCtx.globalAlpha = cell.isDivider ? 0.09 : 0.045;
            bgCtx.drawImage(
              atlas.canvas,
              cell.glyph * atlas.spriteSize,
              0,
              atlas.spriteSize,
              atlas.spriteSize,
              px,
              py,
              sz,
              sz
            );
            bgCtx.globalAlpha = 1;
          }
        }
      }

      // Step 1: Blit entire static background in 1 call (Hardware-accelerated bitblt < 0.08ms)
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bgCanvas, 0, 0, width, height);

      // Step 2: Bounding box spotlight pass (Processes only ~200-350 cells instead of 4,500+)
      const rad = spotlightRadius;
      const radSq = rad * rad;
      const primaryHex = activeTheme.primary;
      const { canvas: spriteCanvas, spriteSize } = atlas;
      const matrix = cellsRef.current;

      const minCol = Math.max(0, Math.floor((m.currentX - rad) / cellSize));
      const maxCol = Math.min(cols - 1, Math.ceil((m.currentX + rad) / cellSize));
      const minRow = Math.max(0, Math.floor((m.currentY - rad) / cellSize));
      const maxRow = Math.min(rows - 1, Math.ceil((m.currentY + rad) / cellSize));

      for (let r = minRow; r <= maxRow; r++) {
        const rowCells = matrix[r];
        if (!rowCells) continue;
        const cy = r * cellSize + cellSize / 2;
        const dy = cy - m.currentY;
        const dySq = dy * dy;

        for (let c = minCol; c <= maxCol; c++) {
          const cell = rowCells[c];
          if (!cell) continue;

          const cx = c * cellSize + cellSize / 2;
          const dx = cx - m.currentX;
          const distSq = dx * dx + dySq;

          if (distSq >= radSq) continue;

          const dist = Math.sqrt(distSq);
          const spotlight = Math.pow(1 - dist / rad, 1.4);
          if (spotlight <= 0.02) continue;

          const px = c * cellSize;
          const py = r * cellSize;

          if (cell.isSolid) {
            // Neon filled block + dark inverted cutout
            ctx.fillStyle = primaryHex;
            ctx.globalAlpha = Math.min(1, 0.2 + spotlight * 0.8);
            ctx.fillRect(px, py, cellSize, cellSize);

            ctx.globalAlpha = Math.min(1, 0.45 + spotlight * 0.55);
            ctx.drawImage(
              spriteCanvas,
              cell.glyph * spriteSize,
              2 * spriteSize,
              spriteSize,
              spriteSize,
              px,
              py,
              cellSize,
              cellSize
            );
          } else {
            // Glowing neon active glyph
            ctx.globalAlpha = Math.min(1, 0.14 + spotlight * 0.86);
            ctx.drawImage(
              spriteCanvas,
              cell.glyph * spriteSize,
              spriteSize,
              spriteSize,
              spriteSize,
              px,
              py,
              cellSize,
              cellSize
            );
          }
        }
      }

      // Step 3: High-tech Radar Target Reticle at spotlight center
      if (m.currentX > -50 && m.currentX < width + 50) {
        ctx.strokeStyle = primaryHex;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.55;

        // Outer reticle circle
        ctx.beginPath();
        ctx.arc(m.currentX, m.currentY, 18, 0, Math.PI * 2);
        ctx.stroke();

        // Inner reticle center dot
        ctx.beginPath();
        ctx.arc(m.currentX, m.currentY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = primaryHex;
        ctx.fill();

        // Crosshair ticks
        ctx.beginPath();
        ctx.moveTo(m.currentX - 24, m.currentY);
        ctx.lineTo(m.currentX - 19, m.currentY);
        ctx.moveTo(m.currentX + 19, m.currentY);
        ctx.lineTo(m.currentX + 24, m.currentY);
        ctx.moveTo(m.currentX, m.currentY - 24);
        ctx.lineTo(m.currentX, m.currentY - 19);
        ctx.moveTo(m.currentX, m.currentY + 19);
        ctx.lineTo(m.currentX, m.currentY + 24);
        ctx.stroke();
      }

      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [spotlightRadius, activeTheme]);

  useEffect(() => {
    if (initialPalette) {
      setCurrentPalette(initialPalette);
    }
  }, [initialPalette]);

  // Pointer event listeners on targetRef or local container with passive flag
  useEffect(() => {
    if (!interactive) return;
    const target = targetRef?.current || containerRef.current;
    if (!target) return;

    const onMove = (e: PointerEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isHovered = true;
      mouseRef.current.lastActivity = Date.now();
    };

    const onLeave = () => {
      mouseRef.current.isHovered = false;
      mouseRef.current.lastActivity = Date.now() - 2400;
    };

    target.addEventListener('pointermove', onMove as EventListener, { passive: true });
    target.addEventListener('pointerleave', onLeave as EventListener, { passive: true });

    return () => {
      target.removeEventListener('pointermove', onMove as EventListener);
      target.removeEventListener('pointerleave', onLeave as EventListener);
    };
  }, [interactive, targetRef]);

  const togglePalette = () => {
    const sequence: CyberPalette[] = ['lime', 'red', 'cyan', 'white'];
    const nextIdx = (sequence.indexOf(currentPalette) + 1) % sequence.length;
    const nextPalette = sequence[nextIdx];
    setCurrentPalette(nextPalette);
    onPaletteChange?.(nextPalette);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Optional Interactive Mini HUD Badge to toggle palettes */}
      {showToggle && (
        <button
          type="button"
          onClick={togglePalette}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-2.5 py-1 rounded-full border border-neutral-800 bg-[#0a0a0a]/80 backdrop-blur-md text-[10px] font-mono tracking-wider transition-all hover:border-neutral-600 focus:outline-none"
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeTheme.primary, boxShadow: `0 0 8px ${activeTheme.glow}` }}
          />
          <span className="text-neutral-400 font-semibold">{activeTheme.label}</span>
          <span className="text-neutral-600 text-[9px]">// TOGGLE</span>
        </button>
      )}
    </div>
  );
};

export default CyberMatrixShader;
