import type { FlowScenario } from '@/features/Blog/flow/types';
import type { TaskScenarioId, TaskStep } from './types';

type StepFields = Omit<TaskStep, 'id' | 'title' | 'detail'>;

const step = (id: string, title: string, detail: string, fields: StepFields): TaskStep => ({
  id,
  title,
  detail,
  ...fields,
});

const PULL = step(
  'pull',
  'Pull a task',
  'Worker A long-polls the broker and gets one task: segment 5 of video v_42, at 720p. The broker does not delete the task. It hides it from every other worker for 60 seconds. That hold is the lease.',
  {
    activeNodes: ['broker', 'workerA'],
    activeEdges: ['broker-workerA'],
    labels: { workerA: 'v_42 720p seg 5', broker: 'hidden for 60 s' },
    loopStep: 1,
    attempt: 1,
    lease: 'held',
    doneReceived: 0,
    counted: false,
  },
);

const ENCODE = step(
  'encode',
  'Encode on the GPU',
  'The worker reads only its own few seconds of the raw video from storage and runs ffmpeg on the GPU. Every 20 seconds it asks the broker for more time, so a slow encode is never handed to a second worker.',
  {
    activeNodes: ['workerA', 'broker'],
    activeEdges: ['workerA-broker'],
    labels: { workerA: 'ffmpeg running', broker: 'lease extended' },
    loopStep: 2,
    attempt: 1,
    lease: 'held',
    doneReceived: 0,
    counted: false,
  },
);

const WRITE = step(
  'write',
  'Write the segment',
  'The result goes to a fixed path in video storage: v_42/720p/seg_005.ts. The path comes from the task, not from the worker, so any worker that runs this task writes the same file.',
  {
    activeNodes: ['workerA', 'storage'],
    activeEdges: ['workerA-storage'],
    labels: { workerA: 'writing', storage: 'seg_005.ts' },
    loopStep: 3,
    attempt: 1,
    lease: 'held',
    doneReceived: 0,
    counted: false,
  },
);

const PUBLISH = step(
  'publish',
  'Publish transcode.done',
  'Only after the file is safe does the worker publish transcode.done with the video ID and the task ID. The upload service pulls the event and inserts a completion row for that task ID, which moves the count up by one.',
  {
    activeNodes: ['workerA', 'broker', 'service'],
    activeEdges: ['workerA-broker', 'broker-service'],
    labels: { workerA: 'done sent', service: 'counted once' },
    loopStep: 4,
    attempt: 1,
    lease: 'held',
    doneReceived: 1,
    counted: true,
  },
);

const ACK = step(
  'ack',
  'Ack the task',
  'Last, the worker acknowledges the task and the broker deletes it. The worker goes back to step 1 and pulls the next one.',
  {
    activeNodes: ['workerA', 'broker'],
    activeEdges: ['workerA-broker'],
    labels: { workerA: 'pulls next', broker: 'task deleted' },
    loopStep: 5,
    attempt: 1,
    lease: 'deleted',
    doneReceived: 1,
    counted: true,
  },
);

/** The broker notices a silent worker only by the lease running out. */
const leaseExpires = (fields: Pick<StepFields, 'doneReceived' | 'counted'>): TaskStep =>
  step(
    'lease-expires',
    'The lease runs out',
    'No extension arrived for 60 seconds, so the broker makes the task visible again. The expired lease is the signal. No heartbeat service watches the GPUs.',
    {
      activeNodes: ['broker'],
      activeEdges: [],
      labels: { broker: 'visible again', workerA: 'gone' },
      tone: 'recovery',
      loopStep: 0,
      attempt: 1,
      lease: 'expired',
      ...fields,
    },
  );

const bPulls = (fields: Pick<StepFields, 'doneReceived' | 'counted'>): TaskStep =>
  step(
    'b-pulls',
    'Worker B takes the task',
    'An idle GPU long-polls and gets the same task with a fresh 60 second lease. The broker counts a second delivery. Worker B knows nothing about worker A, and does not need to.',
    {
      activeNodes: ['broker', 'workerB'],
      activeEdges: ['broker-workerB'],
      labels: { workerA: 'gone', workerB: 'v_42 720p seg 5', broker: 'attempt 2' },
      tone: 'recovery',
      loopStep: 1,
      attempt: 2,
      lease: 'held',
      ...fields,
    },
  );

const B_FINISHES = step(
  'b-finishes',
  'Worker B publishes and acks',
  'Worker B publishes transcode.done and acks the task, and the broker deletes it. The upload service records the task once.',
  {
    activeNodes: ['workerB', 'broker', 'service'],
    activeEdges: ['workerB-broker', 'broker-service'],
    labels: { workerA: 'gone', workerB: 'done + ack', broker: 'task deleted', service: 'counted once' },
    loopStep: 5,
    attempt: 2,
    lease: 'deleted',
    doneReceived: 1,
    counted: true,
  },
);

export const TASK_SCENARIOS: Record<TaskScenarioId, FlowScenario<TaskStep>> = {
  happy: {
    id: 'happy',
    label: 'Happy path',
    summary: 'Write, then publish, then ack. Every other scenario stops a worker between two of these steps.',
    steps: [PULL, ENCODE, WRITE, PUBLISH, ACK],
  },
  crashEncoding: {
    id: 'crashEncoding',
    label: 'Dies while encoding',
    summary: 'A power cut in the middle of ffmpeg. Nothing was written, so another GPU simply starts over.',
    steps: [
      PULL,
      ENCODE,
      step(
        'crash',
        'Worker A loses power',
        'The machine dies in the middle of the encode. It sends no signal to anyone, and the lease stops being extended.',
        {
          activeNodes: ['workerA'],
          activeEdges: [],
          labels: { workerA: 'power cut', broker: 'hears nothing' },
          tone: 'error',
          failure: { afterStep: 1, text: 'worker died' },
          loopStep: 0,
          attempt: 1,
          lease: 'held',
          doneReceived: 0,
          counted: false,
        },
      ),
      leaseExpires({ doneReceived: 0, counted: false }),
      bPulls({ doneReceived: 0, counted: false }),
      step(
        'b-encodes',
        'Worker B encodes and writes',
        'Worker B encodes the segment and writes it to the same fixed path. Worker A never wrote anything, so there is nothing to clean up.',
        {
          activeNodes: ['workerB', 'storage'],
          activeEdges: ['workerB-storage'],
          labels: { workerA: 'gone', workerB: 'writing', storage: 'seg_005.ts' },
          loopStep: 3,
          attempt: 2,
          lease: 'held',
          doneReceived: 0,
          counted: false,
        },
      ),
      B_FINISHES,
    ],
  },
  crashAfterWrite: {
    id: 'crashAfterWrite',
    label: 'Dies after the write',
    summary: 'The segment is in storage but nobody was told. The task runs again and overwrites the same file.',
    steps: [
      PULL,
      ENCODE,
      WRITE,
      step(
        'crash',
        'Worker A dies before publishing',
        'The segment is safe in storage, but transcode.done was never sent and the task was never acked. As far as the broker knows, the task is still running.',
        {
          activeNodes: ['workerA', 'storage'],
          activeEdges: [],
          labels: { workerA: 'died', storage: 'seg_005.ts' },
          tone: 'error',
          failure: { afterStep: 3, text: 'worker died' },
          loopStep: 0,
          attempt: 1,
          lease: 'held',
          doneReceived: 0,
          counted: false,
        },
      ),
      leaseExpires({ doneReceived: 0, counted: false }),
      bPulls({ doneReceived: 0, counted: false }),
      step(
        'b-overwrites',
        'Worker B overwrites the same file',
        "Worker B encodes the segment again and writes it to v_42/720p/seg_005.ts. The path is fixed, so it replaces worker A's copy with the same bytes. No orphan file is left behind.",
        {
          activeNodes: ['workerB', 'storage'],
          activeEdges: ['workerB-storage'],
          labels: { workerA: 'gone', workerB: 'writing', storage: 'overwritten' },
          tone: 'recovery',
          loopStep: 3,
          attempt: 2,
          lease: 'held',
          doneReceived: 0,
          counted: false,
        },
      ),
      B_FINISHES,
    ],
  },
  crashAfterPublish: {
    id: 'crashAfterPublish',
    label: 'Dies before the ack',
    summary: 'The done event was sent but the task was never acked. It runs again, and the second done event changes nothing.',
    steps: [
      PULL,
      ENCODE,
      WRITE,
      PUBLISH,
      step(
        'crash',
        'Worker A dies before the ack',
        'The upload service already counted the task, but the broker never got the ack. To the broker, the task is still unfinished.',
        {
          activeNodes: ['workerA', 'broker'],
          activeEdges: [],
          labels: { workerA: 'died', broker: 'no ack yet', service: 'counted once' },
          tone: 'error',
          failure: { afterStep: 4, text: 'worker died' },
          loopStep: 0,
          attempt: 1,
          lease: 'held',
          doneReceived: 1,
          counted: true,
        },
      ),
      leaseExpires({ doneReceived: 1, counted: true }),
      bPulls({ doneReceived: 1, counted: true }),
      step(
        'b-repeats',
        'Worker B repeats the work',
        'Worker B encodes the segment, overwrites the same file, and publishes transcode.done again. The upload service now receives a second event for the same task.',
        {
          activeNodes: ['workerB', 'storage', 'broker', 'service'],
          activeEdges: ['workerB-storage', 'workerB-broker', 'broker-service'],
          labels: { workerA: 'gone', workerB: 'done sent', storage: 'overwritten', service: 'duplicate' },
          loopStep: 4,
          attempt: 2,
          lease: 'held',
          doneReceived: 2,
          counted: true,
        },
      ),
      step(
        'duplicate-ignored',
        'The duplicate changes nothing',
        'The completion row for this task ID already exists, so the insert does nothing and the count stays the same. Worker B acks, and the broker deletes the task. The event arrived twice and was counted once.',
        {
          activeNodes: ['workerB', 'broker', 'service'],
          activeEdges: ['workerB-broker'],
          labels: { workerA: 'gone', workerB: 'ack', broker: 'task deleted', service: 'no change' },
          tone: 'recovery',
          loopStep: 5,
          attempt: 2,
          lease: 'deleted',
          doneReceived: 2,
          counted: true,
        },
      ),
    ],
  },
  brokenFile: {
    id: 'brokenFile',
    label: 'Broken file',
    summary: 'The task can never succeed. It is retried a few times, then set aside so it does not loop forever.',
    steps: [
      PULL,
      step(
        'ffmpeg-error',
        'ffmpeg fails on a corrupt frame',
        'This time the worker stays alive, so nobody waits for the lease to run out. The worker rejects the task at once, with a delay of 5 seconds, and goes on to other work.',
        {
          activeNodes: ['workerA', 'broker'],
          activeEdges: ['workerA-broker'],
          labels: { workerA: 'corrupt frame', broker: 'retry in 5 s' },
          tone: 'error',
          failure: { afterStep: 1, text: 'ffmpeg failed, task rejected' },
          loopStep: 0,
          attempt: 1,
          lease: 'released',
          doneReceived: 0,
          counted: false,
        },
      ),
      step(
        'retries',
        'Retry, with longer waits',
        'The task comes back after 5 seconds, then 30 seconds, then 2 minutes, on whichever GPU is free. Every try fails on the same frame, and the broker counts every delivery.',
        {
          activeNodes: ['broker', 'workerB'],
          activeEdges: ['broker-workerB', 'workerB-broker'],
          labels: { workerB: 'corrupt frame', broker: 'attempt 4 of 4' },
          tone: 'error',
          failure: { afterStep: 1, text: 'failed on every attempt' },
          loopStep: 0,
          attempt: 4,
          lease: 'released',
          doneReceived: 0,
          counted: false,
        },
      ),
      step(
        'dead-letter',
        'Move it to the dead-letter queue',
        'After four deliveries the broker stops retrying and moves the task to the dead-letter queue. It no longer takes GPU time from tasks that can succeed.',
        {
          activeNodes: ['broker', 'dlq'],
          activeEdges: ['broker-dlq'],
          labels: { broker: 'gave up', dlq: '1 task' },
          tone: 'error',
          loopStep: 0,
          attempt: 4,
          lease: 'dead',
          doneReceived: 0,
          counted: false,
        },
      ),
      step(
        'mark-failed',
        'Mark the video failed',
        'The upload service reads the dead letter, marks the video failed with a reason, and deletes the segments already encoded. The creator sees a clear error and can upload again.',
        {
          activeNodes: ['dlq', 'service'],
          activeEdges: ['dlq-service'],
          labels: { dlq: '1 task', service: 'video failed' },
          tone: 'recovery',
          loopStep: 0,
          attempt: 4,
          lease: 'dead',
          doneReceived: 0,
          counted: false,
        },
      ),
    ],
  },
};

export const TASK_SCENARIO_ORDER: TaskScenarioId[] = [
  'happy',
  'crashEncoding',
  'crashAfterWrite',
  'crashAfterPublish',
  'brokenFile',
];
