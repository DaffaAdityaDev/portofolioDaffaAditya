import type { StepTone } from '@/features/Blog/flow/types';

/** Time each step stays on screen while playing. */
export const FLOW_STEP_MS = 2800;
/** Start playing once this share of a flow is on screen. */
export const FLOW_AUTOPLAY_VISIBLE_AMOUNT = 0.4;

export const FLOW_COLORS = {
  idle: '#404040',
  normal: '#38bdf8',
  error: '#ef4444',
  recovery: '#34d399',
  text: '#a3a3a3',
} as const satisfies Record<StepTone | 'idle' | 'text', string>;

/** Small mono caption above a meter or chart. */
export const FLOW_METER_LABEL_CLASS =
  'font-mono text-[10px] uppercase tracking-wider text-neutral-500';

export const FLOW_DIAGRAM_SIZE = {
  width: 740,
  height: 320,
  nodeWidth: 112,
  nodeHeight: 52,
} as const;

export const FLOW_DIAGRAM = {
  nodeRadius: 2,
  particleCount: 3,
  particleRadius: 3,
  particleSeconds: 1.6,
  /** Narrowest the diagram may shrink to before it scrolls sideways. Fits the article column on a laptop. */
  minWidthClass: 'min-w-[600px]',
} as const;
