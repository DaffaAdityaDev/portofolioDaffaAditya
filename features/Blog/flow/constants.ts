/** Time each step stays on screen while playing. */
export const FLOW_STEP_MS = 2800;
/** Start playing once this share of a flow is on screen. */
export const FLOW_AUTOPLAY_VISIBLE_AMOUNT = 0.4;

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
