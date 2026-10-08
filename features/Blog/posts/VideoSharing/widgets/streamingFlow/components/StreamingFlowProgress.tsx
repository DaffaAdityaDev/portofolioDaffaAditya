import React from 'react';
import { cn } from '@/utils/cn';
import type { CdnResult } from '@/features/Blog/posts/VideoSharing/widgets/streamingFlow/types';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { useFlow } from '@/features/Blog/flow/hooks/useFlow';
import {
  CDN_RESULT_LABELS,
  STREAM_BUFFER_LOW_SECONDS,
  STREAM_BUFFER_MAX_SECONDS,
  STREAM_NO_QUALITY,
  STREAM_QUALITIES,
} from '../constants';
import { STREAM_FLOW } from '../flow';

const METER_LABEL_CLASS = cn('mb-1', FLOW_METER_LABEL_CLASS);

const CDN_RESULT_CLASS: Record<CdnResult, string> = {
  hit: 'border-emerald-400 text-emerald-400',
  miss: 'border-amber-400 text-amber-400',
  collapsed: 'border-sky-400 text-sky-400',
};

/** The resolution the player is on, as rungs of a ladder. */
const QualityLadder: React.FC<{ quality: number }> = ({ quality }) => (
  <div>
    <div className={METER_LABEL_CLASS}>Resolution</div>
    <div
      className="flex gap-1"
      role="img"
      aria-label={quality === STREAM_NO_QUALITY ? 'Resolution: not started' : `Resolution: ${STREAM_QUALITIES[quality]}`}
    >
      {STREAM_QUALITIES.map((label, index) => (
        <div
          key={label}
          className={cn(
            'flex-1 border py-0.5 text-center font-mono text-[10px] transition-colors duration-300',
            index === quality ? 'border-sky-400 bg-sky-400/15 text-sky-300' : 'border-neutral-800 text-neutral-400 ',
          )}
        >
          {label}
        </div>
      ))}
    </div>
  </div>
);

/** Seconds of video the player holds ahead of the playhead. Red when close to stalling. */
const BufferMeter: React.FC<{ seconds: number }> = ({ seconds }) => {
  const isLow = seconds > 0 && seconds < STREAM_BUFFER_LOW_SECONDS;
  const percent = Math.min(seconds / STREAM_BUFFER_MAX_SECONDS, 1) * 100;

  return (
    <div>
      <div className={cn(METER_LABEL_CLASS, 'flex justify-between')}>
        <span>Buffer</span>
        <span className={isLow ? 'text-red-500' : undefined}>{seconds}s ahead</span>
      </div>
      <div
        className="h-5 border border-neutral-800"
        role="img"
        aria-label={`Buffer: ${seconds} seconds ahead${isLow ? ', almost empty' : ''}`}
      >
        <div
          className={cn('h-full transition-all duration-500', isLow ? 'bg-red-500' : 'bg-sky-400')}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const CdnBadge: React.FC<{ result?: CdnResult }> = ({ result }) => (
  <div>
    <div className={METER_LABEL_CLASS}>CDN answer</div>
    <span
      className={cn(
        'inline-block border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors duration-300',
        result ? CDN_RESULT_CLASS[result] : 'border-neutral-800 text-neutral-400 ',
      )}
    >
      {result ? CDN_RESULT_LABELS[result] : 'None yet'}
    </span>
  </div>
);

/** Resolution, buffer and CDN answer for the current step. */
const StreamingFlowProgress: React.FC = () => {
  const { step } = useFlow(STREAM_FLOW);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <QualityLadder quality={step.quality} />
      <BufferMeter seconds={step.bufferSeconds} />
      <CdnBadge result={step.cdn} />
    </div>
  );
};

export default StreamingFlowProgress;
