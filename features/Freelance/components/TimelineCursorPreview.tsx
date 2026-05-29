import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { TimelineNode } from '../constants';

interface TimelineCursorPreviewProps {
  hoveredNode: TimelineNode | null;
}

export const TimelineCursorPreview: React.FC<TimelineCursorPreviewProps> = ({ hoveredNode }) => {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 250, mass: 0.6 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const [activeNode, setActiveNode] = useState<TimelineNode | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (hoveredNode) {
      setActiveNode(hoveredNode);
    }
  }, [hoveredNode]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  if (!isMounted) return null;

  return createPortal(
    <motion.div 
      className="fixed pointer-events-none z-[100] w-[320px] h-[200px] rounded-xl overflow-hidden hidden lg:block border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)] bg-zinc-950"
      style={{ 
        x, 
        y,
        translateX: 25,
        translateY: 25,
        left: 0,
        top: 0
      }}
      initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
      animate={{ 
        opacity: hoveredNode ? 1 : 0,
        scale: hoveredNode ? 1 : 0.8,
        rotate: hoveredNode ? 0 : -2
      }}
      transition={{
        opacity: { duration: 0.25, ease: "easeOut" },
        scale: { duration: 0.25, ease: "easeOut" },
        rotate: { duration: 0.25, ease: "easeOut" }
      }}
    >
      <div className="relative w-full h-full">
        {activeNode && (
          <>
            <img 
              src={activeNode.image} 
              alt={activeNode.title}
              className="w-full h-full object-cover"
            />
            
            {/* Dark & Red Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-transparent to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-900/50 bg-zinc-950/80 backdrop-blur-sm">
              <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest block font-bold mb-0.5">
                {activeNode.category}
              </span>
              <span className="text-white text-xs font-black uppercase tracking-tight block truncate">
                {activeNode.title}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>,
    document.body
  );
};

export default TimelineCursorPreview;
