import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { TIMELINE_NODES, TimelineNode } from '../constants';

interface ProjectsTimelineProps {
  showAllProjects: boolean;
  setShowAllProjects: (val: boolean) => void;
  setHoveredNode: (node: TimelineNode | null) => void;
}

export const ProjectsTimeline: React.FC<ProjectsTimelineProps> = ({
  showAllProjects,
  setShowAllProjects,
  setHoveredNode,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={scrollContainerRef} className="w-full bg-[#0a0a0c] px-6 sm:px-12 md:px-16 lg:px-24 py-16 md:py-24 border-b border-zinc-800 relative">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">// SOLUTIONS_ROADMAP</span>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mt-2">What I Offer & Tech Stack</h2>
          </div>
          <p className="text-xs font-mono text-zinc-500 tracking-wider md:max-w-xs text-left md:text-right">
            // SCROLL TO TRACE ENGINE ALIGNMENT
          </p>
        </div>

        <div className="relative pl-8 md:pl-16 space-y-16">
          <div className="absolute left-[9px] md:left-[17px] top-4 bottom-4 w-[2px]">
            <div className="absolute inset-0 bg-zinc-800" />
            <motion.div 
              style={{ scaleY: scaleY, originY: 0 }}
              className="absolute inset-0 bg-gradient-to-b from-red-600 via-red-500 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.7)]"
            />
          </div>

          {(showAllProjects ? TIMELINE_NODES : TIMELINE_NODES.slice(0, 3)).map((node) => {
            return (
              <div 
                key={node.id} 
                className="relative flex flex-col md:flex-row gap-6 md:gap-12 group cursor-crosshair"
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 z-10 flex items-center justify-center">
                  <div className="w-[16px] h-[16px] md:w-[20px] h-[20px] rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center transition-all duration-300 group-hover:border-red-500 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    <div className="w-[6px] h-[6px] md:w-[8px] h-[8px] rounded-full bg-zinc-600 transition-colors duration-300 group-hover:bg-red-500" />
                  </div>
                </div>

                <div className="w-full md:w-1/3 shrink-0">
                  <span className="text-xs font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">
                    {node.id}: {node.category}
                  </span>
                  <div className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors duration-300">
                    {node.title}
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {node.techs.map(tech => (
                      <span key={tech} className="bg-zinc-900/50 border border-zinc-800 px-2 py-1 text-zinc-300 font-mono text-[10px] rounded hover:border-zinc-700 hover:text-white transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 border border-zinc-800 bg-zinc-900/20 rounded-xl group-hover:border-zinc-700 group-hover:bg-zinc-900/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-950/10 transition-colors" />

                  <p className="text-zinc-300 font-mono text-sm leading-relaxed mb-6">
                    {node.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {node.points.map(pt => (
                      <div key={pt} className="flex items-start gap-2 text-xs font-mono text-zinc-400">
                        <span className="text-red-500 mt-0.5 shrink-0">✔</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-xs font-mono text-zinc-400">
                    <span>SYSTEM PARAMETER</span>
                    <span className="text-red-500 font-bold uppercase tracking-wider">{node.metric}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {TIMELINE_NODES.length > 3 && (
          <div className="mt-12 flex justify-center relative z-20">
            <button

              onClick={() => setShowAllProjects(!showAllProjects)}
              className="group px-6 py-3 border border-zinc-800 bg-[#0f0f13] text-zinc-300 font-mono text-xs uppercase tracking-widest hover:border-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] transition-all duration-300 rounded-lg flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{showAllProjects ? 'Collapse Projects [-]' : 'Expand Full Roadmap [+]'}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsTimeline;
