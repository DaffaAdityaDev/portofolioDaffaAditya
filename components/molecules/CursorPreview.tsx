import React, { useEffect, useState } from 'react';
import { projectsData } from '@/data/ProjectsV4';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// Define the shape of a project based on your data
type Project = typeof projectsData[0];

interface CursorPreviewProps {
  hoveredProject: Project | null;
}

const CursorPreview: React.FC<CursorPreviewProps> = ({ hoveredProject }) => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  // Smooth spring configuration
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    if (hoveredProject) {
      setActiveProject(hoveredProject);
    }
  }, [hoveredProject]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div 
      className="fixed pointer-events-none z-[100] w-[300px] h-[200px] rounded-lg overflow-hidden hidden lg:block border border-zinc-800 shadow-2xl bg-zinc-900"
      style={{ 
        x, 
        y,
        translateX: 20, // Offset
        translateY: 20,
        left: 0,
        top: 0
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: hoveredProject ? 1 : 0,
        scale: hoveredProject ? 1 : 0.8
      }}
      transition={{
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
    >
      <div className="relative w-full h-full">
        {activeProject ? (
          <>
            <img 
              src={activeProject.image} 
              alt={activeProject.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
              <span className="text-white text-[10px] font-mono tracking-widest uppercase">
                {activeProject.title}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </motion.div>
  );
};

export default CursorPreview;
