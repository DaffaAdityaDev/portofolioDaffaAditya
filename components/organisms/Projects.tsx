import React, { useState } from 'react';
import { projectsData } from '@/data/ProjectsV4';
import CursorPreview from '@/components/molecules/CursorPreview';
import ProjectRow from '@/components/molecules/ProjectRow';


import { AnimatePresence, motion } from 'framer-motion';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<typeof projectsData[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'side'>('work');

  // @ts-ignore
  const workProjects = projectsData.filter(p => p.nature === 'work' || !p.nature); // Default to work if undefined for robustness
  // @ts-ignore
  const sideProjects = projectsData.filter(p => p.nature === 'side');

  const displayedProjects = activeTab === 'work' ? workProjects : sideProjects;

  return (
    <>
      <CursorPreview hoveredProject={hoveredProject} />

      <section id="works" className="relative py-20 px-6 lg:px-20 border-t border-neutral-800">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-zinc-800 pb-4 gap-4">
          <div>
            <h2 className="text-sm font-mono text-zinc-500 mb-2">/// SECTION_02</h2>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Past Projects</h1>
          </div>

          <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50 backdrop-blur-sm relative">
            <button
              onClick={() => setActiveTab('work')}
              className={`relative z-10 px-4 py-2 text-xs font-mono uppercase transition-colors duration-300 cursor-pointer ${
                activeTab === 'work' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Work Projects
            </button>
            <button
              onClick={() => setActiveTab('side')}
              className={`relative z-10 px-4 py-2 text-xs font-mono uppercase transition-colors duration-300 cursor-pointer ${
                activeTab === 'side' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Side Projects
            </button>
            
            {/* Sliding Indicator */}
            <div 
              className={`absolute top-1 bottom-1 rounded-md bg-zinc-800 border border-zinc-700 transition-all duration-300 ease-out ${
                activeTab === 'work' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%+2px)] w-[calc(50%-4px)]'
              }`}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col border-t border-zinc-900 overflow-hidden min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col"
            >
              {displayedProjects.map((project) => (
                <ProjectRow 
                  key={project.id} 
                  project={project} 
                  compact={false} 
                  onHover={setHoveredProject} 
                />
              ))}
              
              {displayedProjects.length === 0 && (
                <div className="py-20 text-center text-zinc-600 font-mono text-sm uppercase">
                    No projects found in this category.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </>
  );
};

export default Projects;
