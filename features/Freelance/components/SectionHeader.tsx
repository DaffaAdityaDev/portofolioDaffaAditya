import React from 'react';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  description?: string;
  id?: string;
}

/** Same header as the home page sections: bracketed mono index, uppercase black title, hairline rule. */
export const SectionHeader: React.FC<SectionHeaderProps> = ({ index, label, title, description, id }) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-4 mb-10 md:mb-14">
    <div>
      <div className="text-xs font-mono text-neutral-500 mb-1 tracking-widest uppercase">
        [ {index} // {label} ]
      </div>
      <h2 id={id} className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight [word-spacing:0.12em]">
        {title}
      </h2>
    </div>
    {description && <p className="max-w-sm text-sm text-neutral-400 leading-relaxed md:text-right">{description}</p>}
  </div>
);

/** Shared section shell so every block has the same gutters, width and rule. */
export const Section: React.FC<{
  id?: string;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ id, labelledBy, className = '', children }) => (
  <section
    id={id}
    aria-labelledby={labelledBy}
    className={`relative border-t border-neutral-800 px-4 sm:px-6 lg:px-20 py-16 md:py-24 scroll-mt-20 ${className}`}
  >
    <div className="relative z-10 mx-auto w-full max-w-7xl">{children}</div>
  </section>
);

export default SectionHeader;
