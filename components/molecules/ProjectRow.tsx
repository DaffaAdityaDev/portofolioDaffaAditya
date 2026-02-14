import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { projectsData } from '@/data/ProjectsV4';

type Project = typeof projectsData[0];

interface ProjectRowProps {
  project: Project;
  compact: boolean; // Kept for interface compatibility, though unused in new design
  onHover: (project: Project | null) => void;
}

const ProjectRow: React.FC<ProjectRowProps> = ({ project, onHover }) => (
  <a 
    href={project.link}
    target="_blank"
    rel="noopener noreferrer"
    onMouseEnter={() => onHover(project)}
    onMouseLeave={() => onHover(null)}
    className="block group border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors"
  >
    <div className="grid grid-cols-1 md:grid-cols-12 p-6 items-start gap-6">
      
      {/* Col 1: Project Title (Fixed Width or Scaled) */}
      <div className="md:col-span-4 flex flex-col justify-center">
        <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
          {project.title.replace(/_/g, ' ')}
        </h3>
        <span className="text-[0.625rem] text-white font-mono mt-1 uppercase tracking-widest">
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
                        className="px-2 py-1 text-[0.625rem] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-sm uppercase tracking-wider hover:bg-emerald-500/20 transition-colors"
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
         <div className="flex items-center gap-2 text-white group-hover:text-white transition-colors border border-dashed border-zinc-800 px-3 py-1 group-hover:border-zinc-500">
            <span className="font-mono text-[0.625rem] uppercase tracking-widest">View</span>
            <ArrowUpRight className="w-[0.875rem] h-[0.875rem]" />
         </div>
      </div>

    </div>
  </a>
);

export default ProjectRow;
