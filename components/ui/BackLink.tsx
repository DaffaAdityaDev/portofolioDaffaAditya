import React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

/** Mono "← back" link for the top of sub-pages: <BackLink href="/blog">All posts</BackLink> */
const BackLink = ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
  <Link
    href={href}
    className={cn(
      'group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-white',
      className,
    )}
  >
    <span aria-hidden className="transition-transform motion-safe:group-hover:-translate-x-0.5">
      &larr;
    </span>
    {children}
  </Link>
);

export default BackLink;
