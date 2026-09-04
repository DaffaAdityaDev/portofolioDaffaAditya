import React, { useState } from 'react';
import { projectsData, Project } from './constants';
import CursorPreview from './components/CursorPreview';
import dynamic from 'next/dynamic';
import ProjectRow from './components/ProjectRow';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { ProjectMorphModal } from './components/ProjectMorphModal';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM, SPRING_SNAPPY } from '@/constant/animations';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'freelance' | 'side'>('work');

  // Filter projects by nature
  const workProjects = projectsData.filter(p => !p.nature || p.nature === 'work');
  const freelanceProjects = projectsData.filter(p => p.nature === 'freelance');
  const sideProjects = projectsData.filter(p => p.nature === 'side');

  const displayedProjects = activeTab === 'work' ? workProjects : activeTab === 'freelance' ? freelanceProjects : sideProjects;

  const tabs: Array<{ id: 'work' | 'freelance' | 'side'; label: string }> = [
    { id: 'work', label: 'Work' },
    { id: 'freelance', label: 'Freelance' },
    { id: 'side', label: 'Side' },
  ];

  return (
    <LayoutGroup id="projects-layout-group">
      <CursorPreview hoveredProject={hoveredProject} />

      <motion.section 
        id="works" 
        variants={FADE_IN_UP_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative py-20 px-6 lg:px-20 border-t border-neutral-800 pr-12 md:pr-24"
      >
        {/* Markers for the parent SVG */}
        <div id="projects-timeline-start" className="absolute right-[15px] md:right-[31px] top-0 w-1 h-1 pointer-events-none" />
        <div id="projects-timeline-end" className="absolute right-[15px] md:right-[31px] bottom-0 w-1 h-1 pointer-events-none" />

        <div className="relative z-20">
          <motion.div variants={FADE_IN_UP_ITEM} className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-zinc-800 pb-4 gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Featured Projects</h1>
            </div>

            {/* Fluid Segmented Tab Control */}
            <div className="grid grid-cols-3 gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50 backdrop-blur-sm relative w-full md:min-w-[360px]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative z-10 px-4 py-2 text-xs font-mono uppercase transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="project-tab-active-pill"
                        transition={SPRING_SNAPPY}
                        className="absolute inset-0 rounded-md bg-zinc-800 border border-zinc-700 shadow-sm -z-10"
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
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
                    onSelect={setSelectedProject}
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
        </div>
      </motion.section>

      {/* Shared Element Morph Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectMorphModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};

export default Projects;
export { Projects };

