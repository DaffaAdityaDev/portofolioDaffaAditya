import React from 'react';
import { cn } from '@/utils/cn';
import type { LeaseState, TaskFailure } from '@/features/Blog/posts/VideoSharing/widgets/transcodeTask/types';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { useFlow } from '@/features/Blog/flow/hooks/useFlow';
import { LEASE_LABELS, TASK_LOOP_STEPS, TASK_MAX_ATTEMPTS } from '../constants';
import { TRANSCODE_TASK_FLOW } from '../flow';

const METER_LABEL_CLASS = cn('mb-1', FLOW_METER_LABEL_CLASS);

const LEASE_CLASS: Record<LeaseState, string> = {
  held: 'border-sky-400 text-sky-400',
  expired: 'border-amber-400 text-amber-400',
  released: 'border-amber-400 text-amber-400',
  deleted: 'border-emerald-400 text-emerald-400',
  dead: 'border-red-500 text-red-500',
};

/** The five lines of the worker loop: done, running, or not reached, plus where it broke. */
const WorkerLoop: React.FC<{ loopStep: number; failure?: TaskFailure }> = ({ loopStep, failure }) => {
  const finished = failure ? failure.afterStep : loopStep - 1;

  return (
    <div>
      <div className={METER_LABEL_CLASS}>Worker loop</div>
      <ol className="flex flex-col gap-0.5 font-mono text-[11px]">
        {TASK_LOOP_STEPS.map((text, index) => {
          const number = index + 1;
          const isRunning = !failure && number === loopStep;
          const isDone = number <= finished;
          return (
            <React.Fragment key={text}>
              <li
                className={cn(
                  'flex gap-2 border-l-2 px-2 py-0.5 transition-colors duration-300',
                  isRunning && 'border-sky-400 bg-sky-400/10 text-sky-300',
                  isDone && !isRunning && 'border-neutral-600 text-neutral-400',
                  !isDone && !isRunning && 'border-neutral-800 text-neutral-500',
                )}
                aria-current={isRunning ? 'step' : undefined}
              >
                <span>{number}</span>
                <span>{text}</span>
              </li>
              {failure?.afterStep === number && (
                <li className="border-l-2 border-red-500 bg-red-500/10 px-2 py-0.5 text-red-400" role="status">
                  &#x2715; {failure.text}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </div>
  );
};

/** Delivery count as cells, so the retry budget is visible. */
const Attempts: React.FC<{ attempt: number }> = ({ attempt }) => (
  <div>
    <div className={cn(METER_LABEL_CLASS, 'flex justify-between')}>
      <span>Delivery</span>
      <span>
        {attempt}/{TASK_MAX_ATTEMPTS}
      </span>
    </div>
    <div className="flex gap-1" role="img" aria-label={`Delivery ${attempt} of ${TASK_MAX_ATTEMPTS}`}>
      {Array.from({ length: TASK_MAX_ATTEMPTS }, (_, index) => (
        <div
          key={index}
          className={cn(
            'h-2.5 flex-1 border transition-colors duration-300',
            index < attempt ? 'border-sky-400 bg-sky-400' : 'border-neutral-700 ',
          )}
        />
      ))}
    </div>
  </div>
);

const Lease: React.FC<{ lease: LeaseState }> = ({ lease }) => (
  <div>
    <div className={METER_LABEL_CLASS}>Task in the broker</div>
    <span
      className={cn(
        'inline-block border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors duration-300',
        LEASE_CLASS[lease],
      )}
    >
      {LEASE_LABELS[lease]}
    </span>
  </div>
);

/** How many done events arrived against how many times the task was counted. */
const DoneCount: React.FC<{ received: number; counted: boolean }> = ({ received, counted }) => (
  <div>
    <div className={METER_LABEL_CLASS}>Upload service</div>
    <div className="font-mono text-[11px] text-neutral-400" role="status">
      <span className={cn(received > 1 && 'text-amber-400')}>{received} done received</span>
      <span className="text-neutral-700"> / </span>
      <span className={cn(counted && 'text-emerald-400')}>{counted ? 1 : 0} counted</span>
    </div>
  </div>
);

/** The worker loop next to the broker's and the upload service's view of the same task. */
const TranscodeTaskProgress: React.FC = () => {
  const { step } = useFlow(TRANSCODE_TASK_FLOW);

  return (
    <div className="grid gap-4 sm:grid-cols-[3fr_2fr]">
      <WorkerLoop loopStep={step.loopStep} failure={step.failure} />
      <div className="flex flex-col gap-4">
        <Lease lease={step.lease} />
        <Attempts attempt={step.attempt} />
        <DoneCount received={step.doneReceived} counted={step.counted} />
      </div>
    </div>
  );
};

export default TranscodeTaskProgress;
