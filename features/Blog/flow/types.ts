import type { StoreApi, UseBoundStore } from 'zustand';

/** normal = the flow works, error = something breaks, recovery = how the system copes. */
export type StepTone = 'normal' | 'error' | 'recovery';

export interface FlowStep {
  id: string;
  title: string;
  /** What happens in this step and why the design does it this way. */
  detail: string;
  activeNodes: string[];
  activeEdges: string[];
  tone?: StepTone;
  /** Text under a node, replacing its default caption for this step. */
  labels?: Partial<Record<string, string>>;
}

export interface FlowScenario<TStep extends FlowStep = FlowStep> {
  id: string;
  label: string;
  summary: string;
  steps: TStep[];
}

export interface FlowNodeLayout {
  x: number;
  y: number;
  label: string;
  /** Caption shown when a step does not override it. */
  caption: string;
}

export interface FlowEdgeLayout {
  path: string;
}

export interface FlowEdgeLabel {
  x: number;
  y: number;
  text: string;
}

/** Everything the generic flow components need to draw one story. */
export interface FlowDefinition<TStep extends FlowStep = FlowStep> {
  /** Used in the accessible name of the diagram. */
  name: string;
  width: number;
  height: number;
  nodeWidth: number;
  nodeHeight: number;
  nodes: Record<string, FlowNodeLayout>;
  edges: Record<string, FlowEdgeLayout>;
  edgeLabels: FlowEdgeLabel[];
  scenarios: Record<string, FlowScenario<TStep>>;
  scenarioOrder: string[];
  /** Live caption for a node, for state that changes per step (such as a status). */
  liveCaption?: (nodeId: string, step: TStep) => string | undefined;
}

export interface FlowStoreState {
  scenarioId: string;
  stepIndex: number;
  isPlaying: boolean;

  // Actions
  selectScenario: (id: string) => void;
  goToStep: (index: number) => void;
  next: () => void;
  prev: () => void;
  play: () => void;
  togglePlay: () => void;
  restart: () => void;
  /** Back to the first scenario, first step, paused. Called when the flow unmounts. */
  reset: () => void;
  /** Called by the autoplay timer: moves forward, and stops on the last step. */
  advance: () => void;
}

export type FlowStoreHook = UseBoundStore<StoreApi<FlowStoreState>>;

/** A flow's data plus the store that holds its playback state. */
export interface FlowConfig<TStep extends FlowStep = FlowStep> {
  definition: FlowDefinition<TStep>;
  useStore: FlowStoreHook;
}
