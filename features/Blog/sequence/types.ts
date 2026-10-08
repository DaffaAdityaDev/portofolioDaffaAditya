import type { LucideIcon } from 'lucide-react';

export interface SequenceLane {
  label: string;
  caption: string;
  x: number;
}

/** call = a request, reply = its answer, bytes = video data. */
export type SequenceMessageKind = 'call' | 'reply' | 'bytes';

export interface SequenceMessage<TLane extends string = string> {
  from: TLane;
  to: TLane;
  text: string;
  kind: SequenceMessageKind;
}

/** One numbered step, matching a numbered list in the post. */
export interface SequenceStep<TLane extends string = string> {
  number: number;
  title: string;
  messages: SequenceMessage<TLane>[];
}

export interface SequenceLegendEntry {
  kind: SequenceMessageKind;
  text: string;
}

/** Everything one sequence diagram needs: who talks, and what they say, in order. */
export interface SequenceDefinition<TLane extends string = string> {
  title: string;
  icon: LucideIcon;
  ariaLabel: string;
  width: number;
  /** Narrowest the diagram may shrink to before it scrolls sideways. */
  minWidthClass: string;
  lanes: Record<TLane, SequenceLane>;
  steps: SequenceStep<TLane>[];
  legend: SequenceLegendEntry[];
}
