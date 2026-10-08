import React from 'react';
import { cn } from '@/utils/cn';
import type { VideoStatus } from '@/features/Blog/posts/VideoSharing/widgets/uploadFlow/types';
import {
  UPLOAD_CHUNKS_TOTAL,
  UPLOAD_SEGMENTS_TOTAL,
  VIDEO_STATUS_FLOW,
  VIDEO_STATUS_LABELS,
} from '../constants';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { useFlow } from '@/features/Blog/flow/hooks/useFlow';
import { UPLOAD_FLOW } from '../flow';

interface CellStripProps {
  label: string;
  total: number;
  filled: number;
  /** Index drawn as a failure, if any. */
  failedIndex?: number;
  /** Index where the stream stopped, drawn as a gap while the step is an error. */
  stalledIndex?: number;
}

/** A row of small cells, filled from the left. Used for chunks and segments. */
const CellStrip: React.FC<CellStripProps> = ({ label, total, filled, failedIndex, stalledIndex }) => (
  <div>
    <div className={cn('mb-1 flex justify-between', FLOW_METER_LABEL_CLASS)}>
      <span>{label}</span>
      <span>
        {filled}/{total}
      </span>
    </div>
    <div className="flex gap-1" role="img" aria-label={`${label}: ${filled} of ${total}`}>
      {Array.from({ length: total }, (_, index) => {
        const isFailed = index === failedIndex;
        const isStalled = index === stalledIndex;
        return (
          <div
            key={index}
            className={cn(
              'h-2.5 flex-1 border transition-colors duration-300',
              index < filled && !isFailed && 'border-sky-400 bg-sky-400',
              isFailed && 'border-red-500 bg-red-500/40',
              isStalled && 'border-dashed border-red-500',
              index >= filled && !isFailed && !isStalled && 'border-neutral-700 bg-transparent ',
            )}
          />
        );
      })}
    </div>
  </div>
);

const STATUS_COLOR_CLASS: Record<VideoStatus, string> = {
  uploading: 'border-sky-400 text-sky-400',
  processing: 'border-amber-400 text-amber-400',
  ready: 'border-emerald-400 text-emerald-400',
  failed: 'border-red-500 text-red-500',
  expired: 'border-neutral-400 text-neutral-300',
};

/** Statuses that end a video's life early replace the last step of the normal flow. */
const ALTERNATE_FLOWS: Partial<Record<VideoStatus, VideoStatus[]>> = {
  failed: ['uploading', 'processing', 'failed'],
  expired: ['uploading', 'expired'],
};

/** The video status that viewers and creators would see, as a small state machine. */
const StatusFlow: React.FC<{ status: VideoStatus }> = ({ status }) => {
  const flow: VideoStatus[] = ALTERNATE_FLOWS[status] ?? VIDEO_STATUS_FLOW;

  return (
    <div>
      <div className={cn('mb-1', FLOW_METER_LABEL_CLASS)}>Video status</div>
      <div className="flex flex-wrap items-center gap-1.5" role="status" aria-label={`Video status: ${status}`}>
        {flow.map((item, index) => (
          <React.Fragment key={item}>
            {index > 0 && <span className="text-neutral-700" aria-hidden="true">&rarr;</span>}
            <span
              className={cn(
                'border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors duration-300',
                item === status ? STATUS_COLOR_CLASS[item] : 'border-neutral-800 text-neutral-400 ',
              )}
            >
              {VIDEO_STATUS_LABELS[item]}
            </span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/** Chunk and segment progress plus the video status for the current step. */
const UploadFlowProgress: React.FC = () => {
  const { step } = useFlow(UPLOAD_FLOW);
  const isError = step.tone === 'error';
  const chunksStalled = isError && step.chunksReceived < UPLOAD_CHUNKS_TOTAL ? step.chunksReceived : undefined;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <CellStrip
        label="Upload chunks"
        total={UPLOAD_CHUNKS_TOTAL}
        filled={step.chunksReceived}
        stalledIndex={chunksStalled}
      />
      <CellStrip
        label="Transcode segments"
        total={UPLOAD_SEGMENTS_TOTAL}
        filled={step.segmentsDone}
        failedIndex={step.failedSegment}
      />
      <div className="sm:col-span-2">
        <StatusFlow status={step.status} />
      </div>
    </div>
  );
};

export default UploadFlowProgress;
