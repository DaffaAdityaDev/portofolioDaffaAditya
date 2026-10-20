import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { TIME_CONVERTER_URL } from '../constants/content';

/** A `<dd>` under a WIB time, linking to a converter that shows it in the visitor's own time zone. */
const LocalTimeLink: React.FC<{ className?: string }> = ({ className = '' }) => (
  <dd className={className}>
    <a
      href={TIME_CONVERTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-white"
    >
      In your time <ArrowUpRight size={12} />
    </a>
  </dd>
);

export default LocalTimeLink;
