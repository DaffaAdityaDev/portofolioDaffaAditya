import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m, useSpring, useMotionValue } from 'framer-motion';
import { TimelineNode } from '../constants';
import { useFreelanceStore } from '@/store/useFreelanceStore';
import Image from 'next/image';

export interface TimelineCursorPreviewProps {
  hoveredNode?: TimelineNode | null;
}

export const TimelineCursorPreview: React.FC<TimelineCursorPreviewProps> = (props) => {
  const storeHoveredNode = useFreelanceStore((state) => state.hoveredNode);
  const hoveredNode = props.hoveredNode !== undefined ? props.hoveredNode : storeHoveredNode;
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
    if (!hoveredNode) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [hoveredNode, cursorX, cursorY]);

  if (!isMounted) return null;

  return createPortal(
    <m.div 
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
            <Image 
              src={activeNode.image} 
              alt={activeNode.title}
              fill
              sizes="320px"
              style={{ objectFit: 'cover' }}
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

            {/* Fluid top specular edge, above the image and scrims so it is not painted over */}
            <div className="absolute inset-0 pointer-events-none"></div>
          </>
        )}
      </div>
    </m.div>,
    document.body
  );
};

export default TimelineCursorPreview;
