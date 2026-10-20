import React from 'react';
import { cn } from '@/utils/cn';
import Eyebrow from './Eyebrow';

/**
 * The section header used site-wide: `[ 0N // LABEL ]` eyebrow, black uppercase h2, optional mono
 * description, hairline rule. <SectionHeader index="01" label="About" title="About Me" id="about-title" />
 * `aside` fills the right column with anything else (a tab control).
 */
const SectionHeader = ({
  index,
  label,
  title,
  description,
  aside,
  id,
  className,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-column content, after the description. */
  aside?: React.ReactNode;
  /** Put on the h2, for the section's aria-labelledby. */
  id?: string;
  className?: string;
}) => (
  <div
    className={cn(
      'mb-8 flex flex-col justify-between gap-4 border-b border-border pb-3 md:mb-12 md:flex-row md:items-end md:pb-4',
      className,
    )}
  >
    <div>
      <Eyebrow className="mb-1">
        [ {index} {'//'} {label} ]
      </Eyebrow>
      <h2 id={id} className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
        {title}
      </h2>
    </div>
    {description && (
      <p className="max-w-md font-mono text-xs leading-relaxed text-muted-foreground md:text-right">{description}</p>
    )}
    {aside}
  </div>
);

export default SectionHeader;
