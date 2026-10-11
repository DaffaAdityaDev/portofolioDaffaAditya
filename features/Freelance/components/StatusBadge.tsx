import React from 'react';

/** The page's single availability style: a static emerald dot and mono label. */
export const StatusBadge: React.FC<{ label: string; className?: string }> = ({ label, className = '' }) => (
  <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-emerald-400 ${className}`}>
    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
    {label}
  </span>
);

export default StatusBadge;
