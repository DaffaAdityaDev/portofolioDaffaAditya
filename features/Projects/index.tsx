import React, { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { projectsData, Project } from './constants';
import dynamic from 'next/dynamic';
import ProjectRow from './components/ProjectRow';
import { AnimatePresence, m, LayoutGroup } from 'framer-motion';
import { DURATION, EASE_OUT_EXPO, SPRING_SNAPPY } from '@/constant/animations';
import Section from '@/components/ui/Section';
import SectionHeader from '@/components/ui/SectionHeader';

// Both only matter after an interaction, so their code loads on demand instead of with the section.
const loadProjectMorphModal = () => import('./components/ProjectMorphModal');
const ProjectMorphModal = dynamic(loadProjectMorphModal, { ssr: false });
const CursorPreview = dynamic(() => import('./components/CursorPreview'), { ssr: false });

// The cursor preview follows a mouse; touch-only devices never mount it (or fetch its chunk).
const HOVER_QUERY = '(hover: hover)';

const WORK_PROJECTS = projectsData.filter(p => !p.nature || p.nature === 'work');
const FREELANCE_PROJECTS = projectsData.filter(p => p.nature === 'freelance');
const SIDE_PROJECTS = projectsData.filter(p => p.nature === 'side');

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'freelance' | 'side'>('work');
  const canHover = useMediaQuery(HOVER_QUERY, false);

  const displayedProjects = activeTab === 'work' ? WORK_PROJECTS : activeTab === 'freelance' ? FREELANCE_PROJECTS : SIDE_PROJECTS;

  const tabs: Array<{ id: 'work' | 'freelance' | 'side'; label: string }> = [
    { id: 'work', label: 'Work' },
    { id: 'freelance', label: 'Freelance' },
    { id: 'side', label: 'Side' },
  ];

  return (
    <LayoutGroup id="projects-layout-group">
      {canHover && <CursorPreview hoveredProject={hoveredProject} />}

      <Section id="works" labelledBy="projects-title" containerClassName="z-20">
        {/* Scroll reveals are CSS (globals.css .reveal): visible by default, so the static HTML never hides. */}
        <SectionHeader
          index="03"
          label="PROJECTS"
          title="Featured Projects"
          id="projects-title"
          className="reveal mb-5 md:mb-8"
          aside={
            // Fluid Segmented Tab Control
            <div className="grid grid-cols-3 gap-1 bg-neutral-900/50 p-1 rounded-lg border border-border/50 backdrop-blur-sm relative w-full md:min-w-[360px]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-pressed={isActive}
                    className={`relative z-10 px-4 py-2 text-xs font-mono uppercase rounded-lg transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-white font-bold' : 'text-neutral-500 hover:text-neutral-300'
                    }`}
                  >
                    {isActive && (
                      <m.div
                        layoutId="project-tab-active-pill"
                        transition={SPRING_SNAPPY}
                        className="absolute inset-0 rounded-lg bg-neutral-800 border border-border-strong shadow-sm -z-10"
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          }
        />

        <div className="reveal flex flex-col border-t border-neutral-900 overflow-hidden min-h-[300px]">
          {/* initial={false}: the first list renders in place (the static HTML too); only tab switches slide. */}
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: DURATION.fast, ease: EASE_OUT_EXPO }}
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
                <div className="py-20 text-center text-neutral-500 font-mono text-sm uppercase">
                  No projects found in this category.
                </div>
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </Section>

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

