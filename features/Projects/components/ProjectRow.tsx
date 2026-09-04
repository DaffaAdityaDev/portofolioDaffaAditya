import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Project } from '../constants';
import { SPRING_MOBILE_OS } from '@/constant/animations';

interface ProjectRowProps {
  project: Project;
  compact: boolean;
  onHover: (project: Project | null) => void;
  onSelect: (project: Project) => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, onHover, onSelect }) => {
  return (
    <motion.div
      layoutId={`project-card-${project.id}`}
      transition={SPRING_MOBILE_OS}
      onClick={() => onSelect(project)}
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
      className="group block border-b border-zinc-800 hover:bg-zinc-900/40 transition-colors cursor-pointer focus:outline-none focus-visible:bg-zinc-900/60 focus-visible:ring-1 focus-visible:ring-red-500/50"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 p-6 items-start gap-6">
        {/* Col 1: Project Title */}
        <div className="md:col-span-4 flex flex-col justify-center">
          <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
            {project.title.replace(/_/g, ' ')}
          </h3>
          <span className="text-[0.625rem] text-neutral-400 font-mono mt-1 uppercase tracking-widest">
            // TYPE: {project.type}
          </span>
        </div>

        {/* Col 2: Data Table / Description */}
        <div className="md:col-span-6 bg-zinc-900/20 md:bg-transparent border border-zinc-800/50 md:border-none rounded md:rounded-none p-4 md:p-0">
          <div className="grid grid-cols-1 gap-2 font-mono text-[0.75rem] text-zinc-400">
            {/* Description Row */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 border-b border-zinc-900/50 pb-2 mb-2 md:border-none md:pb-0 md:mb-0">
              <span className="text-white uppercase w-24 shrink-0">Log/Desc:</span>
              <p className="leading-relaxed text-zinc-300 max-w-xl">
                {project.description}
              </p>
            </div>

            {/* Tech Stack Row */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-8">
              <span className="text-white uppercase w-24 shrink-0">Tech Stack:</span>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-[0.625rem] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-sm uppercase tracking-wider group-hover:border-emerald-500/40 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Col 3: Action Endpoint */}
        <div className="md:col-span-2 flex md:justify-end items-start md:items-center h-full">
          <div
            data-cursor="merge"
            className="flex items-center gap-2 text-white group-hover:text-white transition-colors border border-dashed border-zinc-800 px-3 py-1.5 group-hover:border-zinc-400 rounded-md bg-zinc-950/40 group-hover:bg-zinc-800/60"
          >
            <span className="font-mono text-[0.625rem] uppercase tracking-widest">Inspect</span>
            <ArrowUpRight className="w-[0.875rem] h-[0.875rem] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(ProjectRow);

