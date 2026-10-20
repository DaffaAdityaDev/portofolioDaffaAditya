import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { m } from 'framer-motion';
import { Project, CASE_STUDIES_META } from '../constants';
import { SPRING_MOBILE_OS } from '@/constant/animations';
import { chipClasses } from '@/components/ui/chip';

interface ProjectRowProps {
  project: Project;
  compact: boolean;
  onHover: (project: Project | null) => void;
  onSelect: (project: Project) => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, onHover, onSelect }) => {
  const meta = CASE_STUDIES_META[project.slug];

  return (
    <m.div
      layoutId={`project-card-${project.id}`}
      transition={SPRING_MOBILE_OS}
      onClick={() => onSelect(project)}
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
      role="button"
      tabIndex={0}
      data-cursor="merge"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
      className="group block rounded-lg md:rounded-none bg-surface-1/85 md:bg-transparent border border-border md:border-none md:border-b md:border-border my-2 md:my-0 p-4 md:p-6 hover:bg-neutral-900/40 transition-all duration-200 cursor-pointer focus-visible:bg-neutral-900/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] md:shadow-none active:scale-[0.99] md:active:scale-100"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-3 md:gap-6">
        {/* Col 1: Project Title & Mobile Metric Badge */}
        <div className="md:col-span-4 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-1.5 transition-transform duration-300">
                {project.title.replace(/_/g, ' ')}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xs text-muted-foreground font-mono uppercase tracking-widest">
                  {'//'} TYPE: {project.type}
                </span>
                {project.year && (
                  <span className="text-2xs text-muted-foreground font-mono">
                    · {project.year}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile metric badge (none when the project has no meta) */}
            {meta?.metric && (
              <div className={chipClasses({ tone: 'success', className: 'md:hidden gap-1.5 px-2.5 text-2xs shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.15)]' })}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{meta.metric}</span>
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Data Table / Description */}
        <div className="md:col-span-6 bg-white/[0.02] md:bg-transparent border border-white/[0.06] md:border-none rounded-lg md:rounded-none p-3.5 md:p-0">
          <div className="grid grid-cols-1 gap-2.5 font-mono text-xs text-muted-foreground">
            {/* Description Row */}
            <div className="flex flex-col md:flex-row gap-1.5 md:gap-8 border-b border-white/[0.06] pb-2.5 md:border-none md:pb-0">
              <span className="text-muted-foreground md:text-white uppercase text-2xs md:text-xs font-bold w-24 shrink-0 font-mono">
                Log/Desc:
              </span>
              <p className="leading-relaxed text-neutral-300 text-xs font-sans md:font-mono line-clamp-3 md:line-clamp-none max-w-xl">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Row */}
            <div className="flex flex-col md:flex-row gap-1.5 md:gap-8">
              <span className="text-muted-foreground md:text-white uppercase text-2xs md:text-xs font-bold w-24 shrink-0 font-mono">
                Tech Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className={chipClasses({ tone: 'success', className: 'px-2 py-0.5 md:py-1 text-2xs group-hover:border-emerald-500/40 transition-colors' })}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Action Endpoint */}
        <div className="md:col-span-2 flex justify-between md:justify-end items-center h-full pt-2 md:pt-0 border-t border-white/[0.04] md:border-none">
          <span className="text-2xs font-mono text-muted-foreground uppercase md:hidden">
            Client: {project.client}
          </span>
          <div
            className="flex items-center gap-1.5 text-white group-hover:text-white transition-colors border border-dashed border-border-strong/60 md:border-border px-3 py-1.5 group-hover:border-neutral-400 rounded-lg bg-neutral-900/60 md:bg-neutral-950/40 group-hover:bg-neutral-800/60 ml-auto md:ml-0 shadow-sm"
          >
            <span className="font-mono text-2xs uppercase tracking-widest">Inspect</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </m.div>
  );
};

export default ProjectRow;

