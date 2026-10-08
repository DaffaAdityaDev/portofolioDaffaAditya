import React from 'react';
import { ExternalLink } from 'lucide-react';
import type { EngagementLink } from '@/types/project';
import { MONO_LABEL } from './constants';

interface LinksFooterProps {
  links: EngagementLink[];
}

/** Closing block with the public links. */
const LinksFooter: React.FC<LinksFooterProps> = ({ links }) => (
  <div className="mt-10 flex flex-col gap-4 border-t border-[#1f1f23] pt-4 md:mt-12 md:flex-row md:items-center md:justify-between">
    <div className="text-left">
      <span className={`${MONO_LABEL} block text-zinc-400`}>Live links</span>
      <p className="mt-2 text-[15px] text-zinc-300">The public sites for this work.</p>
    </div>
    <ul className="flex flex-wrap gap-3">
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center gap-2.5 border border-white/15 px-5 font-mono text-xs uppercase tracking-[0.12em] text-zinc-100 transition-colors duration-200 hover:border-[var(--cs-accent)] hover:bg-[var(--cs-accent)] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
          >
            {link.label}
            <span className="sr-only"> (opens in a new tab)</span>
            <ExternalLink size={16} aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default LinksFooter;
