import React, { useState } from 'react';
import { Globe, ArrowUpRight, Zap, Cpu } from 'lucide-react';
import { m, AnimatePresence, LayoutGroup } from 'framer-motion';
import dynamic from 'next/dynamic';
import type { BentoModalType } from './BentoMorphModal';
import ExperienceTicker from './ExperienceTicker';
import { EXPERIENCE_LABEL } from '@/utils/experience';
import LayoutMotion from '@/components/LayoutMotion';
import { SPRING_MOBILE_OS } from '@/constant/animations';
import StatusBadge from '@/components/ui/StatusBadge';

const BentoMorphModal = dynamic(() => import('./BentoMorphModal'), { ssr: false });

const BentoGrid: React.FC = () => {
  const [activeModal, setActiveModal] = useState<BentoModalType | null>(null);

  // The cells morph into the modal (layoutId), so this subtree needs domMax; the rest of the hero does not.
  return (
    <LayoutMotion>
      <LayoutGroup id="bento-layout-group">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[1px] h-full w-full overflow-hidden shadow-2xl rounded-lg transition-colors bg-border border border-border">
        
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
            // Inset focus outline: the grid's overflow-hidden would clip the global one.
            className="p-6 lg:p-8 flex flex-col justify-between group min-h-[220px] cursor-pointer focus-inset transition-colors bg-background hover:bg-neutral-900"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-neutral-300 group-hover:text-accent-brand-hover transition-colors" />
                  <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest font-semibold">Based in</span>
                </div>
                <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight whitespace-nowrap drop-shadow-sm">Jakarta, Indonesia</h2>
              </div>
              <div className="p-1.5 rounded-lg transition-colors bg-white/0 group-hover:bg-white/5">
                <ArrowUpRight size={18} className="text-neutral-300 group-hover:text-white transition-colors" />
              </div>
            </div>

            <div>
              <div className="text-2xs font-mono text-neutral-300 uppercase tracking-[0.2em] mb-2 flex items-center gap-2 font-semibold">
                 {EXPERIENCE_LABEL}
              </div>
              <ExperienceTicker />
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
            className="p-6 lg:p-8 flex flex-col justify-between group min-h-[220px] cursor-pointer focus-inset transition-colors bg-background hover:bg-neutral-900"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-neutral-300 group-hover:text-yellow-400 transition-colors" />
                <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest font-semibold">Status</span>
              </div>
              <StatusBadge pulse />
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
            className="p-6 lg:p-8 flex flex-col justify-between group col-span-1 md:col-span-2 min-h-[160px] cursor-pointer focus-inset transition-colors bg-background hover:bg-neutral-900"
          >
             <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Cpu size={18} className="text-neutral-300 group-hover:text-accent-brand-hover transition-colors" />
                  <span className="text-xs font-mono text-neutral-300 uppercase tracking-widest font-semibold">Tech Stack</span>
                </div>
                <span className="text-2xs font-mono px-3 py-1 rounded-lg transition-colors uppercase text-muted-foreground border border-border group-hover:border-neutral-500">Curated // Inspect</span>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-3 mt-6">
                {['Next.js', 'TypeScript', 'Golang', 'AI Agent', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker'].map((tech) => (
                   <div key={tech} className="flex items-center gap-2 group/item p-2 rounded-lg transition-all">
                      <div className="w-1.5 h-1.5 bg-neutral-400 group-hover/item:bg-accent-brand rounded-full transition-colors"></div>
                      <span className="text-xs font-mono text-neutral-200 group-hover/item:text-white transition-colors tracking-tight uppercase font-medium">{tech}</span>
                   </div>
                ))}
             </div>
          </m.div>

        </div>

        {/* Shared Element Morph Modal */}
        <AnimatePresence>
          {activeModal && (
            <BentoMorphModal type={activeModal} onClose={() => setActiveModal(null)} />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </LayoutMotion>
  );
};

export default BentoGrid;

