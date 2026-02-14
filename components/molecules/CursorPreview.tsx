import React from 'react';
import useMousePosition from '@/hooks/useMousePosition';
import { projectsData } from '@/data/ProjectsV4';

// Define the shape of a project based on your data
type Project = typeof projectsData[0];

interface CursorPreviewProps {
  hoveredProject: Project | null;
}

const CursorPreview: React.FC<CursorPreviewProps> = ({ hoveredProject }) => {
  const { x, y } = useMousePosition();
  
  if (!hoveredProject) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[100] w-[300px] h-[200px] rounded-lg overflow-hidden hidden lg:block border border-zinc-800 shadow-2xl transition-all duration-300 ease-out transform"
      style={{ 
        left: x + 24, 
        top: y + 24,
        opacity: hoveredProject ? 1 : 0,
        transform: hoveredProject ? 'scale(1)' : 'scale(0.9)'
      }}
    >
      <div className="relative w-full h-full bg-zinc-900">
        <img 
          src={hoveredProject.image} 
          alt={hoveredProject.title}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-black/30"></div>

         <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
           <span className="text-white text-[10px] font-mono tracking-widest uppercase">
             {hoveredProject.title}
           </span>
         </div>
      </div>
    </div>
  );
};

export default CursorPreview;
