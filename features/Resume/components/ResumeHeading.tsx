import React from 'react';
import Eyebrow from '@/components/ui/Eyebrow';

/** Resume section heading: the muted Eyebrow as an h2, over a hairline rule. */
const ResumeHeading = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <Eyebrow as="h2" id={id} className="border-b border-border pb-2">
    {children}
  </Eyebrow>
);

export default ResumeHeading;
