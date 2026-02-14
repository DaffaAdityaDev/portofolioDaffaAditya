import React, { useState } from 'react';
import { projectsData } from '@/data/ProjectsV4';
import CursorPreview from '@/components/molecules/CursorPreview';
import ProjectRow from '@/components/molecules/ProjectRow';
import { Maximize2, Minimize2 } from 'lucide-react';

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState<typeof projectsData[0] | null>(null);
  const [view, setView] = useState<'home'>('home');
  const [filter, setFilter] = useState('ALL');
  const [compactMode, setCompactMode] = useState(false);

  // --- DERIVED DATA ---;

  // Grouping for Archive View
  const groupedProjects = projectsData.reduce((acc, project) => {
    // @ts-ignore
    if (!acc[project.year]) acc[project.year] = [];
    // @ts-ignore
    acc[project.year].push(project);
    return acc;
  }, {} as Record<string, typeof projectsData>);

  const sortedYears = Object.keys(groupedProjects).sort((a, b) => Number(b) - Number(a));
  const categories = ['ALL', 'WEB_APP', 'WEBSITE', 'MOBILE', 'DASHBOARD'];

  // const handleViewAll = () => setView('archive');

  return (
    <>
      <CursorPreview hoveredProject={hoveredProject} />

 
        <section id="works" className="relative py-20 px-6 lg:px-20 border-t border-neutral-800">
           <div className="flex items-end justify-between mb-8 border-b border-zinc-800 pb-4">
              <div>
                 <h2 className="text-sm font-mono text-zinc-500 mb-2">/// SECTION_02</h2>
                 <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Past Projects</h1>
              </div>
           </div>
          
          <div className="flex flex-col border-t border-zinc-900">
            {projectsData.map((project) => (
              <ProjectRow 
                key={project.id} 
                project={project} 
                compact={false} 
                onHover={setHoveredProject} 
              />
            ))}
          </div>
          
           {/* Pagination / End Marker */}
           {/* <div className="mt-12 flex justify-center">
              <button 
                onClick={handleViewAll} 
                className="flex items-center gap-2 px-4 py-2 border border-zinc-800 bg-zinc-900/50 text-[10px] font-mono text-zinc-500 uppercase hover:text-white hover:border-zinc-600 transition-colors"
              >
                 <span>View_Full_Log</span>
                 <div className="w-1 h-4 bg-zinc-700 animate-pulse"></div>
              </button>
           </div> */}
        </section>
     
    </>
  );
};

export default Projects;
