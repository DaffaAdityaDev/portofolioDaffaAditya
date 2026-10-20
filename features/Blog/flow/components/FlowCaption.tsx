import React from 'react';
import { cn } from '@/utils/cn';
import type { FlowConfig, FlowStep, StepTone } from '@/features/Blog/flow/types';
import { useFlow } from '../hooks/useFlow';

const TONE_BADGE: Record<StepTone, { text: string; className: string } | null> = {
  normal: null,
  error: { text: 'Something goes wrong', className: 'text-red-500' },
  recovery: { text: 'How the system copes', className: 'text-emerald-400' },
};

const TONE_BORDER: Record<StepTone, string> = {
  normal: 'border-border',
  error: 'border-red-500/60',
  recovery: 'border-emerald-400/60',
};

/** What is happening in the current step, and why the design does it that way. */
const FlowCaption = <TStep extends FlowStep>({ flow }: { flow: FlowConfig<TStep> }) => {
  const { step, stepIndex, totalSteps } = useFlow(flow);
  const tone = step.tone ?? 'normal';
  const badge = TONE_BADGE[tone];

  return (
    <div
      className={cn('rounded-lg border bg-background p-3 transition-colors duration-300', TONE_BORDER[tone])}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-2 font-mono text-2xs uppercase tracking-wider">
        <span className="text-neutral-500">
          Step {stepIndex + 1} of {totalSteps}
        </span>
        {badge && <span className={badge.className}>{badge.text}</span>}
      </div>
      <div className="mt-1 font-bold text-white">{step.title}</div>
      <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.detail}</div>
    </div>
  );
};

export default FlowCaption;
