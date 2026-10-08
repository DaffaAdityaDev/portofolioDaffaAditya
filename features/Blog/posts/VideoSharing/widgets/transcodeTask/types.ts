import type { FlowStep } from '@/features/Blog/flow/types';

export type TaskNodeId = 'storage' | 'workerA' | 'workerB' | 'broker' | 'dlq' | 'service';

export type TaskEdgeId =
  | 'broker-workerA'
  | 'workerA-broker'
  | 'broker-workerB'
  | 'workerB-broker'
  | 'workerA-storage'
  | 'workerB-storage'
  | 'broker-service'
  | 'broker-dlq'
  | 'dlq-service';

export type TaskScenarioId = 'happy' | 'crashEncoding' | 'crashAfterWrite' | 'crashAfterPublish' | 'brokenFile';

/** Where the task's lease stands in this step. */
export type LeaseState = 'held' | 'expired' | 'released' | 'deleted' | 'dead';

export interface TaskFailure {
  /** Last loop step that finished before things went wrong. */
  afterStep: number;
  text: string;
}

export interface TaskStep extends FlowStep {
  activeNodes: TaskNodeId[];
  activeEdges: TaskEdgeId[];
  labels?: Partial<Record<TaskNodeId, string>>;
  /** Step of the worker loop being run, 1 to 5, or 0 when no worker holds the task. */
  loopStep: number;
  /** What went wrong in this attempt, drawn in red after the last loop step that finished. */
  failure?: TaskFailure;
  /** Delivery count of the task, as the broker keeps it. */
  attempt: number;
  lease: LeaseState;
  /** transcode.done events the upload service received for this task. */
  doneReceived: number;
  /** Whether the upload service has recorded the task as complete. Always once at most. */
  counted: boolean;
}
