import { useEffect, useMemo, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { RenderMode } from '../types';
import { DEFAULT_LATENCY, TIMELINE_MAX_MS } from '../constants';
import { modelResponse } from '../utils/model';

/**
 * Render mode, the two data latencies, and a clock that replays the response
 * in real time. The clock is null when no replay is running.
 */
export function usePprTimeline() {
  const reduceMotion = usePrefersReducedMotion();
  const [mode, setModeState] = useState<RenderMode>('ppr');
  const [cartMs, setCartMs] = useState<number>(DEFAULT_LATENCY.cart);
  const [productsMs, setProductsMs] = useState<number>(DEFAULT_LATENCY.products);
  // 0 = never replayed, so the first render shows the end state.
  const [runId, setRunId] = useState(0);
  const [clockMs, setClockMs] = useState<number | null>(null);

  const response = useMemo(() => modelResponse(mode, cartMs, productsMs), [mode, cartMs, productsMs]);

  useEffect(() => {
    if (runId === 0 || reduceMotion) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= TIMELINE_MAX_MS) {
        setClockMs(null);
        return;
      }
      setClockMs(elapsed);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [runId, reduceMotion]);

  const replay = () => {
    setClockMs(0);
    setRunId((id) => id + 1);
  };

  // Switching mode replays, so the reader sees the difference in timing.
  const setMode = (next: RenderMode) => {
    setModeState(next);
    replay();
  };

  return {
    mode,
    cartMs,
    productsMs,
    response,
    // With reduced motion there is no replay, so the chart shows the end state.
    clockMs: runId === 0 || reduceMotion ? null : clockMs,
    setMode, setCartMs, setProductsMs, replay };
}
