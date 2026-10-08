import React, { useState, useSyncExternalStore } from 'react';
import { projectsData, Project } from './constants';
import dynamic from 'next/dynamic';
import ProjectRow from './components/ProjectRow';
import { AnimatePresence, m, LayoutGroup } from 'framer-motion';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM, SPRING_SNAPPY } from '@/constant/animations';

// Both only matter after an interaction, so their code loads on demand instead of with the section.
const loadProjectMorphModal = () => import('./components/ProjectMorphModal');
const ProjectMorphModal = dynamic(loadProjectMorphModal, { ssr: false });
const CursorPreview = dynamic(() => import('./components/CursorPreview'), { ssr: false });

// The cursor preview follows a mouse; touch-only devices never mount it (or fetch its chunk).
const HOVER_QUERY = '(hover: hover)';
const subscribeHover = (onChange: () => void) => {
  const query = window.matchMedia(HOVER_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
const getHoverSnapshot = () => window.matchMedia(HOVER_QUERY).matches;
const getHoverServerSnapshot = () => false;

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'freelance' | 'side'>('work');
  const canHover = useSyncExternalStore(subscribeHover, getHoverSnapshot, getHoverServerSnapshot);

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
      {canHover && <CursorPreview hoveredProject={hoveredProject} />}

      <m.section 
        id="works" 
        variants={FADE_IN_UP_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative py-10 md:py-20 px-4 sm:px-6 lg:px-20 border-t border-neutral-800 scroll-mt-20"
      >
        {/* Markers for the parent SVG */}
        <div id="projects-timeline-start" className="absolute right-[15px] md:right-[31px] top-0 w-1 h-1 pointer-events-none" />
        <div id="projects-timeline-end" className="absolute right-[15px] md:right-[31px] bottom-0 w-1 h-1 pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto w-full">
          <m.div variants={FADE_IN_UP_ITEM} className="flex flex-col md:flex-row md:items-end justify-between mb-5 md:mb-8 border-b border-zinc-800 pb-3 md:pb-4 gap-4">
            <div>
              <div className="text-xs font-mono text-zinc-500 mb-1 tracking-widest uppercase">
                [ 03 // PROJECTS ]
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Featured Projects</h2>
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
                      <m.div
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
          </m.div>
          
          <m.div variants={FADE_IN_UP_ITEM} className="flex flex-col border-t border-zinc-900 overflow-hidden min-h-[300px]">
            <AnimatePresence mode="wait">
              <m.div
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
                    onHover={(hovered) => {
                      // Warm the modal chunk on hover so the first open still morphs straight away.
                      if (hovered) void loadProjectMorphModal();
                      setHoveredProject(hovered);
                    }}
                    onSelect={setSelectedProject}
                  />
                ))}
                
                {displayedProjects.length === 0 && (
                  <div className="py-20 text-center text-zinc-500 font-mono text-sm uppercase">
                    No projects found in this category.
                  </div>
                )}
              </m.div>
            </AnimatePresence>
          </m.div>
        </div>
      </m.section>

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

