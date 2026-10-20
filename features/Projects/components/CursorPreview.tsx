import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { m, useMotionValue, useSpring } from 'framer-motion';
import { Project } from '../constants';
import { useHydrated } from '@/hooks/useHydrated';
import Image from 'next/image';

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

  // The last hovered project, kept while the preview fades out after the pointer leaves.
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  if (hoveredProject && hoveredProject !== activeProject) setActiveProject(hoveredProject);
  const isMounted = useHydrated();

  useEffect(() => {
    if (!hoveredProject) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', moveCursor, { passive: true });
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [hoveredProject, cursorX, cursorY]);

  const content = (
    <m.div 
      className="fixed pointer-events-none z-[100] w-[300px] h-[200px] rounded-lg overflow-hidden hidden lg:block border border-border shadow-2xl bg-neutral-900"
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
      <div className="relative w-full h-full pointer-events-none select-none">
        {activeProject ? (
          <>
            <Image 
              src={activeProject.image} 
              alt={activeProject.title}
              fill
              sizes="300px"
              style={{ objectFit: 'cover' }}
              className="pointer-events-none select-none"
            />
            
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
              <span className="text-white text-2xs font-mono tracking-widest uppercase pointer-events-none">
                {activeProject.title}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </m.div>
  );

  if (!isMounted) return null;

  return createPortal(content, document.body);
};

export default CursorPreview;
