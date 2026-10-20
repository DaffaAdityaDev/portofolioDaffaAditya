import React from 'react';
import { cn } from '@/utils/cn';
import type { ResultTileProps } from '@/types/blog';
import AnimatedNumber from './AnimatedNumber';

type TileProps = Pick<ResultTileProps, 'label' | 'accent'> & {
  hint?: string;
  /** Extra classes for the number, e.g. a smaller size. */
  className?: string;
} & (
    | Pick<ResultTileProps, 'value' | 'format'> & { children?: never }
    /** Custom content in place of the counting number, styled like it. */
    | { children: React.ReactNode; value?: never; format?: never }
  );

/** One computed number in an estimator widget, counting toward its value, with a short hint below. */
const ResultTile: React.FC<TileProps> = ({ label, value, format, hint, accent, className, children }) => {
  const valueClass = cn('block text-2xl font-black tabular-nums', accent ? 'text-accent-brand' : 'text-white', className);
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="font-mono text-2xs uppercase tracking-wider text-neutral-500">{label}</div>
      {value !== undefined && format ? (
        <AnimatedNumber value={value} format={format} className={valueClass} />
      ) : (
        <div className={valueClass}>{children}</div>
      )}
      {hint && <div className="mt-1 text-xs leading-snug text-neutral-500">{hint}</div>}
    </div>
  );
};

export default ResultTile;
