import React from 'react';
import { ExternalLink } from 'lucide-react';
import { buttonClasses } from '@/components/ui/Button';
import type { EngagementLink } from '@/types/project';
import { MONO_LABEL } from './constants';

interface LinksFooterProps {
  links: EngagementLink[];
}

/** Closing block with the public links. */
const LinksFooter: React.FC<LinksFooterProps> = ({ links }) => (
  <div className="mt-10 flex flex-col gap-4 border-t border-border pt-4 md:mt-12 md:flex-row md:items-center md:justify-between">
    <div className="text-left">
      <span className={`${MONO_LABEL} block text-muted-foreground`}>Live links</span>
      <p className="mt-2 text-[15px] text-neutral-300">The public sites for this work.</p>
    </div>
    <ul className="flex flex-wrap gap-3">
      {links.map((link) => (
        <li key={link.href}>
          {/* External, so a plain <a> styled as the site button rather than <Button> (a Next Link). */}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses({ variant: 'secondary', size: 'sm' })}
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
