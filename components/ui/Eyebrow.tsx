import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Mono uppercase kicker above titles: <Eyebrow>[ 01 // ABOUT ]</Eyebrow>, tone="accent" for red.
 * Other attributes (id, htmlFor with as="label") go to the element.
 */
const Eyebrow = ({
  tone = 'muted',
  as: Tag = 'div',
  className,
  children,
  ...rest
}: {
  tone?: 'muted' | 'accent';
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
} & Omit<React.AllHTMLAttributes<HTMLElement>, 'as'>) => (
  <Tag
    className={cn(
      'font-mono text-xs uppercase tracking-widest',
      tone === 'accent' ? 'text-accent-brand' : 'text-muted-foreground',
      className,
    )}
    {...rest}
  >
    {children}
  </Tag>
);

export default Eyebrow;
