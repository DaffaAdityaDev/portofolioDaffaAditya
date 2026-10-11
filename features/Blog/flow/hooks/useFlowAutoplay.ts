import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { FlowConfig, FlowStep } from '@/features/Blog/flow/types';
import { FLOW_STEP_MS } from '../constants';

/**
 * Drives a flow's playback while it is mounted:
 * - starts playing once, the first time the flow scrolls into view
 * - steps forward on a timer while playing and on screen
 * - resets to the first step on unmount, so coming back starts fresh
 *
 * Nothing starts or advances on its own for reduced-motion users.
 */
export function useFlowAutoplay<TStep extends FlowStep>(flow: FlowConfig<TStep>, isVisible: boolean) {
  const reduceMotion = usePrefersReducedMotion();
  const isPlaying = flow.useStore((state) => state.isPlaying);
  const play = flow.useStore((state) => state.play);
  const advance = flow.useStore((state) => state.advance);
  const reset = flow.useStore((state) => state.reset);
  const hasAutoStarted = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAutoStarted.current || reduceMotion) return;
    hasAutoStarted.current = true;
    play();
  }, [isVisible, reduceMotion, play]);

  useEffect(() => {
    if (!isPlaying || !isVisible || reduceMotion) return;

    let id: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (!id && !document.hidden) id = setInterval(advance, FLOW_STEP_MS);
    };
    const stop = () => {
      if (id) {
        clearInterval(id);
        id = null;
      }
    };

    start();
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isPlaying, isVisible, reduceMotion, advance]);

  useEffect(() => reset, [reset]);
}
