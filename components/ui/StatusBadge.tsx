import React from 'react';
import { cn } from '@/utils/cn';

/**
 * The single availability style: an emerald dot and mono label. <StatusBadge label="Available" />
 * `pulse` adds a ping ring (live status), `boxed` the tinted pill; without a label it is just the dot.
 */
const StatusBadge = ({
  label,
  pulse = false,
  boxed = false,
  className,
}: {
  label?: string;
  pulse?: boolean;
  boxed?: boolean;
  className?: string;
}) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg font-mono text-2xs uppercase tracking-widest text-emerald-400',
      boxed && 'border border-emerald-500/25 bg-emerald-950/40 px-2 py-0.5 font-bold',
      className,
    )}
  >
    <span aria-hidden className="relative flex h-1.5 w-1.5 shrink-0">
      {pulse && <span className="absolute inset-0 rounded-full bg-emerald-400/50 motion-safe:animate-ping" />}
      <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
    </span>
    {label}
  </span>
);

export default StatusBadge;
