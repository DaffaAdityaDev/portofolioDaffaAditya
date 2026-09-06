import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project, CASE_STUDIES_META, DEFAULT_META } from '../constants';
import { SPRING_MOBILE_OS } from '@/constant/animations';

interface ProjectRowProps {
  project: Project;
  compact: boolean;
  onHover: (project: Project | null) => void;
  onSelect: (project: Project) => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, onHover, onSelect }) => {
  const meta = CASE_STUDIES_META[project.slug] || DEFAULT_META;

  return (
    <motion.div
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
      className="group block rounded-xl md:rounded-none bg-[#0a0a0c]/85 md:bg-transparent border border-white/[0.08] md:border-none md:border-b md:border-zinc-800 my-2 md:my-0 p-4 md:p-6 hover:bg-zinc-900/40 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:bg-zinc-900/60 focus-visible:ring-1 focus-visible:ring-emerald-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] md:shadow-none active:scale-[0.99] md:active:scale-100"
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
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                  // TYPE: {project.type}
                </span>
                {project.year && (
                  <span className="text-[10px] text-neutral-500 font-mono">
                    · {project.year}
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Audited Metric Badge */}
            {meta?.metric && (
              <div className="md:hidden inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[9px] font-mono font-bold tracking-wider uppercase shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{meta.metric}</span>
              </div>
            )}
          </div>
        </div>

        {/* Col 2: Data Table / Description */}
        <div className="md:col-span-6 bg-white/[0.02] md:bg-transparent border border-white/[0.06] md:border-none rounded-xl md:rounded-none p-3.5 md:p-0">
          <div className="grid grid-cols-1 gap-2.5 font-mono text-[0.75rem] text-zinc-400">
            {/* Description Row */}
            <div className="flex flex-col md:flex-row gap-1.5 md:gap-8 border-b border-white/[0.06] pb-2.5 md:border-none md:pb-0">
              <span className="text-neutral-400 md:text-white uppercase text-[10px] md:text-xs font-bold w-24 shrink-0 font-mono">
                Log/Desc:
              </span>
              <p className="leading-relaxed text-zinc-300 text-xs md:text-xs font-sans md:font-mono line-clamp-3 md:line-clamp-none max-w-xl">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Row */}
            <div className="flex flex-col md:flex-row gap-1.5 md:gap-8">
              <span className="text-neutral-400 md:text-white uppercase text-[10px] md:text-xs font-bold w-24 shrink-0 font-mono">
                Tech Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 md:py-1 text-[10px] md:text-[0.625rem] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md uppercase tracking-wider group-hover:border-emerald-500/40 transition-colors font-mono"
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
          <span className="text-[10px] font-mono text-neutral-500 uppercase md:hidden">
            Client: {project.client}
          </span>
          <div
            className="flex items-center gap-1.5 text-white group-hover:text-white transition-colors border border-dashed border-zinc-700/60 md:border-zinc-800 px-3 py-1.5 group-hover:border-zinc-400 rounded-md bg-zinc-900/60 md:bg-zinc-950/40 group-hover:bg-zinc-800/60 ml-auto md:ml-0 shadow-sm"
          >
            <span className="font-mono text-[10px] md:text-[0.625rem] uppercase tracking-widest">Inspect</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ProjectRow);

