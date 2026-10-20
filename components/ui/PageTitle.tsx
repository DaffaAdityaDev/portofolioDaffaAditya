import React from 'react';
import { cn } from '@/utils/cn';

const SIZES = {
  xl: 'text-5xl md:text-7xl lg:text-8xl leading-[0.95]',
  lg: 'text-4xl md:text-6xl lg:text-7xl leading-[1]',
} as const;

/**
 * Page-level h1: Inter black uppercase. `xl` for the home hero, `lg` (default) for other pages.
 * Case studies keep their own editorial titles and do not use this.
 */
const PageTitle = ({
  size = 'lg',
  as: Tag = 'h1',
  id,
  className,
  children,
}: {
  size?: keyof typeof SIZES;
  as?: React.ElementType;
  id?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <Tag id={id} className={cn('font-sans font-black uppercase tracking-tight text-white', SIZES[size], className)}>
    {children}
  </Tag>
);

export default PageTitle;
