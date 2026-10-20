import React from 'react';
import { cn } from '@/utils/cn';

/**
 * Page-width wrapper with the site gutters: <Container>…</Container>, or <Container as="section">.
 * `wide` is the case-study measure (1320px, tighter lg gutter).
 */
const Container = ({
  as: Tag = 'div',
  wide = false,
  className,
  children,
  ...props
}: {
  as?: React.ElementType;
  wide?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) => (
  <Tag
    className={cn(
      'mx-auto w-full px-4 sm:px-6',
      wide ? 'max-w-[1320px] lg:px-10' : 'max-w-7xl lg:px-20',
      className,
    )}
    {...props}
  >
    {children}
  </Tag>
);

export default Container;
