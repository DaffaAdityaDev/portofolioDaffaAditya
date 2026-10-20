import { useMemo, useState } from 'react';
import type { RenderMode } from '../types';
import { TIMELINE } from '../constants';
import { simulateTimeline } from '../utils/simulate';

/** Mode, revalidate time and edit time, plus what every visitor got. Pure, so it is computed, not animated. */
export function useRevalidationTimeline() {
  const [mode, setMode] = useState<RenderMode>('isr');
  const [revalidate, setRevalidate] = useState<number>(TIMELINE.revalidate.initial);
  const [editAt, setEditAt] = useState<number>(TIMELINE.editAt.initial);
  const result = useMemo(() => simulateTimeline(mode, revalidate, editAt), [mode, revalidate, editAt]);

  return { mode, revalidate, editAt, result, setMode, setRevalidate, setEditAt };
}
