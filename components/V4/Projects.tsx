import React from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { projectsData } from '@/data/ProjectsV4';

const Projects = () => {
  return (
    <section id="works" className="relative py-20 px-6 lg:px-20 border-t border-neutral-800">
      
      {/* Section Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-neutral-500 mb-2">[ SELECTED_PROJECTS ]</div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">RECENT WORKS</h2>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-500">VIEW_ALL</span>
          <ArrowUpRight size={16} className="text-neutral-500" />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="space-y-[1px] bg-neutral-800">
        {projectsData.map((project, idx) => (
          <div key={idx} className="bg-[#0a0a0a] hover:bg-neutral-900 transition-colors group">
            <div className="p-8 lg:p-12 grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left: Title & Info */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-neutral-600 border border-neutral-800 px-2 py-1">{project.year}</span>
                  <span className="text-xs font-mono text-neutral-600">{project.category}</span>
                </div>
                
                <h3 className="text-3xl font-black tracking-tighter uppercase group-hover:text-red-500 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-neutral-400 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Middle: Tech Stack */}
              <div className="lg:col-span-4 space-y-2">
                <div className="text-xs font-mono text-neutral-600 mb-3">STACK:</div>
                {project.tech.map((tech) => (
                  <div key={tech} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-neutral-600"></div>
                    <span className="text-sm font-mono text-neutral-400">{tech}</span>
                  </div>
                ))}
              </div>

              {/* Right: Metrics & CTA */}
              <div className="lg:col-span-3 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-xl font-bold font-mono">{value}</div>
                      <div className="text-xs text-neutral-600 uppercase">{key}</div>
                    </div>
                  ))}
                </div>
                
                <button className="mt-6 h-12 w-full border border-neutral-800 hover:border-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 font-mono text-sm">
                  VIEW <ExternalLink size={14} />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Projects;
