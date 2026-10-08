import React from 'react';
import { cn } from '@/utils/cn';
import { FLOW_METER_LABEL_CLASS } from '@/features/Blog/flow/constants';
import { useFlow } from '@/features/Blog/flow/hooks/useFlow';
import { ORIGIN_SHIELD_FLOW } from '../flow';

/** More than this many requests for one file is a storm for the origin. */
const STORM_THRESHOLD = 100;

/** How many requests for segment 1 reached the origin in this step. */
const OriginRequests: React.FC = () => {
  const { step } = useFlow(ORIGIN_SHIELD_FLOW);
  const count = step.originRequests;
  const isStorm = count !== null && count > STORM_THRESHOLD;

  return (
    <div aria-live="polite">
      <div className={cn('mb-1', FLOW_METER_LABEL_CLASS)}>Requests for segment 1 reaching the origin</div>
      <div
        className={cn(
          'font-mono text-2xl font-bold tabular-nums transition-colors duration-300',
          count === null ? 'text-neutral-500' : isStorm ? 'text-red-400' : 'text-emerald-400',
        )}
      >
        {count === null ? '—' : count.toLocaleString('en-US')}
      </div>
    </div>
  );
};

export default OriginRequests;
