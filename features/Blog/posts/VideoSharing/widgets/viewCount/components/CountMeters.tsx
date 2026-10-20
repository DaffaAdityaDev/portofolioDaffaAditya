import React from 'react';
import { cn } from '@/utils/cn';
import { WIDGET_LABEL_CLASS } from '@/features/Blog/components/widgetStyles';
import { useFlow } from '@/features/Blog/flow/hooks/useFlow';
import { VIEW_COUNT_FLOW } from '../flow';

const Meter: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div>
    <div className={cn('mb-1', WIDGET_LABEL_CLASS)}>{label}</div>
    <div className="font-mono text-lg font-bold tabular-nums text-neutral-100">{value.toLocaleString('en-US')}</div>
  </div>
);

/** Events in, what the public count gained, and what it cost the database. */
const CountMeters: React.FC = () => {
  const { step } = useFlow(VIEW_COUNT_FLOW);

  return (
    <div className="grid grid-cols-3 gap-4" aria-live="polite">
      <Meter label="Events in" value={step.events} />
      <Meter label="Counted" value={step.counted} />
      <Meter label="Database writes" value={step.dbWrites} />
    </div>
  );
};

export default CountMeters;
