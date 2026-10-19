import React from 'react';
import { cn } from '@/utils/cn';
import type { ResultTileProps } from '@/types/blog';
import AnimatedNumber from './AnimatedNumber';

/** One computed number in an estimator widget, counting toward its value, with a short hint below. */
const ResultTile: React.FC<ResultTileProps> = ({ label, value, format, hint, accent }) => (
  <div className="border border-neutral-800 bg-[#0a0a0a] p-3">
    <div className="font-mono text-[11px] uppercase tracking-wider text-neutral-500">{label}</div>
    <AnimatedNumber
      value={value}
      format={format}
      className={cn('block text-2xl font-black tabular-nums', accent ? 'text-red-500' : 'text-white')}
    />
    <div className="mt-1 text-xs leading-snug text-neutral-500">{hint}</div>
  </div>
);

export default ResultTile;
