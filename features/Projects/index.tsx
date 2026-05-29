import React, { useState } from 'react';
import { projectsData } from './constants';
import CursorPreview from './components/CursorPreview';
import ProjectRow from './components/ProjectRow';
import { AnimatePresence, motion } from 'framer-motion';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/constant/animations';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<typeof projectsData[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'freelance' | 'side'>('work');

  // @ts-ignore
  const workProjects = projectsData.filter(p => !p.nature || p.nature === 'work');
  // @ts-ignore
  const freelanceProjects = projectsData.filter(p => p.nature === 'freelance');
  // @ts-ignore
  const sideProjects = projectsData.filter(p => p.nature === 'side');

  const displayedProjects = activeTab === 'work' ? workProjects : activeTab === 'freelance' ? freelanceProjects : sideProjects;

  return (
    <>
      <CursorPreview hoveredProject={hoveredProject} />

      <motion.section 
        id="works" 
        variants={FADE_IN_UP_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative py-20 px-6 lg:px-20 border-t border-neutral-800"
      >
        <motion.div variants={FADE_IN_UP_ITEM} className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-zinc-800 pb-4 gap-4">
          <div>
            <h2 className="text-sm font-mono text-zinc-500 mb-2">/// SECTION_02</h2>
            <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Past Projects</h1>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50 backdrop-blur-sm relative w-full md:min-w-[360px]">
            <button
              onClick={() => setActiveTab('work')}
              className={`relative z-10 px-4 py-2 text-xs font-mono uppercase transition-colors duration-300 cursor-pointer ${
                activeTab === 'work' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Work
            </button>
            <button
              onClick={() => setActiveTab('freelance')}
              className={`relative z-10 px-4 py-2 text-xs font-mono uppercase transition-colors duration-300 cursor-pointer ${
                activeTab === 'freelance' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Freelance
            </button>
            <button
              onClick={() => setActiveTab('side')}
              className={`relative z-10 px-4 py-2 text-xs font-mono uppercase transition-colors duration-300 cursor-pointer ${
                activeTab === 'side' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Side
            </button>
            
            {/* Sliding Indicator */}
            <div 
              className={`absolute top-1 bottom-1 rounded-md bg-zinc-800 border border-zinc-700 transition-all duration-300 ease-out ${
                activeTab === 'work' ? 'left-1 w-[calc(33.33%-5px)]' : 
                activeTab === 'freelance' ? 'left-[calc(33.33%+3px)] w-[calc(33.33%-5px)]' : 
                'left-[calc(66.66%+1px)] w-[calc(33.33%-5px)]'
              }`}
            ></div>
          </div>
        </motion.div>
        
        <motion.div variants={FADE_IN_UP_ITEM} className="flex flex-col border-t border-zinc-900 overflow-hidden min-h-[300px]">
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
        </motion.div>
      </motion.section>
    </>
  );
};

export default Projects;
export { Projects };
