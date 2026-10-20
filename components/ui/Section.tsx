import React from 'react';
import { cn } from '@/utils/cn';
import Container from './Container';

/**
 * Page section shell: top hairline, vertical rhythm, site gutters and width.
 * <Section id="faq" labelledBy="faq-title"><SectionHeader … />…</Section>
 */
const Section = ({
  id,
  labelledBy,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  labelledBy?: string;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    aria-labelledby={labelledBy}
    className={cn('relative scroll-mt-20 border-t border-border py-12 md:py-20', className)}
  >
    <Container className={cn('relative z-10', containerClassName)}>{children}</Container>
  </section>
);

export default Section;
