import React, { useState } from 'react';
import { Globe, ArrowUpRight, Zap, Cpu } from 'lucide-react';
import { m, AnimatePresence, LayoutGroup } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { BentoModalType } from './BentoMorphModal';
import ExperienceTicker, { EXPERIENCE_LABEL, formatExperience, useExperience } from './ExperienceTicker';
import { SPRING_MOBILE_OS } from '@/constant/animations';

const BentoMorphModal = dynamic(() => import('./BentoMorphModal'), { ssr: false });

/** The modal with the experience string, read when it opens. */
const LiveBentoMorphModal = ({ type, onClose }: { type: Exclude<BentoModalType, null>; onClose: () => void }) => {
  const experience = useExperience();
  return <BentoMorphModal type={type} onClose={onClose} experienceString={formatExperience(experience)} />;
};

export interface BentoGridProps {
  glassBg?: boolean;
}

const BentoGrid: React.FC<BentoGridProps> = ({ glassBg = false }) => {
  const [activeModal, setActiveModal] = useState<BentoModalType>(null);

  return (
    <LayoutGroup id="bento-layout-group">
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[1px] h-full w-full overflow-hidden shadow-2xl rounded-2xl transition-colors ${
        glassBg 
          ? "bg-neutral-800/60 border border-neutral-800/80" 
          : "bg-neutral-800 border border-neutral-800"
      }`}>
        
        {/* Cell 1: Location & Experience Counter */}
        <m.div
          layoutId="bento-cell-location"
          transition={SPRING_MOBILE_OS}
          onClick={() => setActiveModal('location')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveModal('location');
            }
          }}
          className={`p-6 lg:p-8 flex flex-col justify-between group min-h-[220px] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50 transition-colors ${
            glassBg
              ? "bg-[#0a0a0a]/50 hover:bg-[#0a0a0a]/30"
              : "bg-[#0a0a0a] hover:bg-neutral-900"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-neutral-300 group-hover:text-red-400 transition-colors" />
                <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest font-semibold">Based in</span>
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight whitespace-nowrap drop-shadow-sm">Jakarta, Indonesia</h2>
            </div>
            <div className={`p-1.5 rounded-xl transition-colors ${
              glassBg ? "bg-neutral-800/40 group-hover:bg-neutral-700/60 border border-neutral-700/50" : "bg-white/0 group-hover:bg-white/5"
            }`}>
              <ArrowUpRight size={18} className="text-neutral-300 group-hover:text-white transition-colors" />
            </div>
          </div>

          <div>
            <div className="text-[9px] font-mono text-neutral-300 uppercase tracking-[0.2em] mb-2 flex items-center gap-2 font-semibold">
               {EXPERIENCE_LABEL}
            </div>
            <ExperienceTicker glassBg={glassBg} />
          </div>
        </m.div>

        {/* Cell 2: Status */}
        <m.div
          layoutId="bento-cell-status"
          transition={SPRING_MOBILE_OS}
          onClick={() => setActiveModal('status')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveModal('status');
            }
          }}
          className={`p-6 lg:p-8 flex flex-col justify-between group min-h-[220px] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50 transition-colors ${
            glassBg
              ? "bg-[#0a0a0a]/50 hover:bg-[#0a0a0a]/30"
              : "bg-[#0a0a0a] hover:bg-neutral-900"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-neutral-300 group-hover:text-yellow-400 transition-colors" />
              <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest font-semibold">Status</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
            </div>
          </div>

          <div>
            <div className="text-xl lg:text-2xl font-bold text-white leading-tight tracking-tight uppercase drop-shadow-sm">
              Open to work <br />
              & Freelance
            </div>
            <p className="text-neutral-300 text-xs mt-2 font-mono tracking-wider font-medium">Available for new opportunities &bull; Tap to view</p>
          </div>
        </m.div>

        {/* Cell 3: Tech Stack */}
        <m.div
          layoutId="bento-cell-tech"
          transition={SPRING_MOBILE_OS}
          onClick={() => setActiveModal('tech')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActiveModal('tech');
            }
          }}
          className={`p-6 lg:p-8 flex flex-col justify-between group col-span-1 md:col-span-2 min-h-[160px] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50 transition-colors ${
            glassBg
              ? "bg-[#0a0a0a]/50 hover:bg-[#0a0a0a]/30"
              : "bg-[#0a0a0a] hover:bg-neutral-900"
          }`}
        >
           <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-neutral-300 group-hover:text-red-400 transition-colors" />
                <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest font-semibold">Tech Stack</span>
              </div>
              <span className={`text-[10px] font-mono px-3 py-1 rounded-full transition-colors uppercase ${
                glassBg 
                  ? "text-neutral-300 border border-neutral-800 bg-neutral-900/60 group-hover:border-neutral-700" 
                  : "text-neutral-400 border border-neutral-800 group-hover:border-neutral-500"
              }`}>Curated // Inspect</span>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-3 mt-6">
              {['Next.js', 'TypeScript', 'Golang', 'AI Agent', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker'].map((tech) => (
                 <div key={tech} className={`flex items-center gap-2 group/item p-2 rounded-xl transition-all ${
                   glassBg 
                     ? "border border-neutral-800/60 bg-[#0a0a0a]/60 hover:bg-[#0a0a0a]/90 hover:border-red-500/40" 
                     : ""
                 }`}>
                    <div className="w-1.5 h-1.5 bg-neutral-400 group-hover/item:bg-red-500 rounded-full transition-colors"></div>
                    <span className="text-xs font-mono text-neutral-200 group-hover/item:text-white transition-colors tracking-tight uppercase font-medium">{tech}</span>
                 </div>
              ))}
           </div>
        </m.div>

      </div>

      {/* Shared Element Morph Modal */}
      <AnimatePresence>
        {activeModal && (
          <LiveBentoMorphModal type={activeModal} onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};

export default BentoGrid;
export { BentoGrid as BentoGridComponent };

