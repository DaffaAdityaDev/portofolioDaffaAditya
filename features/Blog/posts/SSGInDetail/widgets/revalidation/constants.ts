import type { RenderMode, ResponseKind } from './types';
import { WIDGET_COLORS } from '@/features/Blog/components/widgetStyles';

/** 4 minutes after the build, with 8 visitors at uneven times. */
export const TIMELINE = {
  durationSeconds: 240,
  requestTimes: [15, 40, 70, 95, 120, 150, 185, 220],
  revalidate: { min: 10, max: 120, step: 10, initial: 60 },
  editAt: { min: 5, max: 200, step: 5, initial: 50 },
} as const;

export const RENDER_MODES: Record<RenderMode, { label: string; summary: string }> = {
  ssg: {
    label: 'SSG',
    summary: 'Built once by next build. Nothing changes until the next deploy, however long that takes.',
  },
  isr: {
    label: 'ISR',
    summary:
      'Built once, then rebuilt in the background by the first request after the revalidate time runs out. That request still gets the old page.',
  },
  ssr: {
    label: 'SSR',
    summary: 'Rendered by the server on every request. Always current, and the server does the work every time.',
  },
};

export const RENDER_MODE_ORDER: RenderMode[] = ['ssg', 'isr', 'ssr'];

export const RESPONSE_STYLES: Record<ResponseKind, { color: string; label: string }> = {
  current: { color: '#737373', label: 'Old post, before the edit' },
  stale: { color: WIDGET_COLORS.error, label: 'Old post after the edit (stale)' },
  fresh: { color: WIDGET_COLORS.recovery, label: 'New post' },
};

export const TIMELINE_CHART = {
  width: 720,
  height: 150,
  padLeft: 24,
  padRight: 24,
  axisY: 70,
  dotRadius: 9,
  renderY: 100,
  renderHeight: 14,
  renderWidth: 18,
  gridColor: '#262626',
  minWidthClass: 'min-w-[640px]',
} as const;
