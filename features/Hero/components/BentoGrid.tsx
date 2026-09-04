import React, { useState, useEffect, useMemo } from 'react';
import { Globe, ArrowUpRight, Zap, Cpu } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { calculateDuration } from '@/utils/date';
import dynamic from 'next/dynamic';
import type { BentoModalType } from './BentoMorphModal';
import { SPRING_MOBILE_OS } from '@/constant/animations';

const BentoMorphModal = dynamic(() => import('./BentoMorphModal'), { ssr: false });

// Virtual Start Date: Accumulated duration of real experience (Internships + Current Role)
const VIRTUAL_START_DATE = new Date('2023-03-01T00:00:00');

// Initial State Constant
const INITIAL_EXPERIENCE = { y: '00', m: '00', d: '00', hh: '00', mm: '00', ss: '00' };

const SubtleDigit = React.memo(({ char }: { char: string }) => {
  return (
    <span className="relative inline-block w-[0.55em] text-center tabular-nums">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={char}
          className="inline-block w-full"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});
SubtleDigit.displayName = 'SubtleDigit';

const BentoGrid = () => {
  const [experience, setExperience] = useState(INITIAL_EXPERIENCE);
  const [mounted, setMounted] = useState(false);
  const [activeModal, setActiveModal] = useState<BentoModalType>(null);

  useEffect(() => {
    setMounted(true);
    
    const updateExperience = () => {
      setExperience(calculateDuration(VIRTUAL_START_DATE));
    };

    updateExperience();
    const timer = setInterval(updateExperience, 1000);
    return () => clearInterval(timer);
  }, []);

  const experienceString = useMemo(() => {
    return `${experience.y} Years, ${experience.m} Months, ${experience.d} Days (${experience.hh}:${experience.mm}:${experience.ss})`;
  }, [experience]);

  if (!mounted) return null;

  return (
    <LayoutGroup id="bento-layout-group">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[1px] bg-neutral-800 border border-neutral-800 h-full w-full overflow-hidden shadow-2xl rounded-2xl">
        
        {/* Cell 1: Location & Experience Counter */}
        <motion.div
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
          className="bg-[#0a0a0a] p-6 lg:p-8 flex flex-col justify-between group hover:bg-neutral-900 transition-colors min-h-[220px] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-neutral-500 group-hover:text-red-500 transition-colors" />
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Based in</span>
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-white tracking-tight whitespace-nowrap">Jakarta, Indonesia</h3>
            </div>
            <div className="p-1 rounded bg-white/0 group-hover:bg-white/5 transition-colors">
              <ArrowUpRight size={18} className="text-neutral-700 group-hover:text-white transition-colors" />
            </div>
          </div>

          <div>
            <div className="text-[9px] font-mono text-neutral-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
               Experience
            </div>
            <div className="flex items-baseline font-mono text-white tracking-tighter whitespace-nowrap overflow-hidden">
              <span className="text-neutral-800 mr-1 text-sm md:text-base font-light">[</span>
              
              <div className="flex items-baseline text-sm md:text-base font-medium">
                <span className="text-white">
                  <SubtleDigit char={experience.y[0]} /><SubtleDigit char={experience.y[1]} />
                </span>
                <span className="text-[8px] text-neutral-400 ml-0.5 mr-0.5 font-bold">Y</span>
                
                <span className="text-white">
                  <SubtleDigit char={experience.m[0]} /><SubtleDigit char={experience.m[1]} />
                </span>
                <span className="text-[8px] text-neutral-400 ml-0.5 mr-0.5 font-bold">M</span>
                
                <span className="text-white">
                  <SubtleDigit char={experience.d[0]} /><SubtleDigit char={experience.d[1]} />
                </span>
                <span className="text-[8px] text-neutral-400 ml-0.5 font-bold">D</span>
              </div>
              
              <span className="text-neutral-800 mx-1 font-light text-sm md:text-base">|</span>

              <div className="text-sm md:text-base font-medium text-red-500">
                <SubtleDigit char={experience.hh[0]} /><SubtleDigit char={experience.hh[1]} />
                <span className="mx-0.5 opacity-30">:</span>
                <SubtleDigit char={experience.mm[0]} /><SubtleDigit char={experience.mm[1]} />
                <span className="mx-0.5 opacity-30">:</span>
                <SubtleDigit char={experience.ss[0]} /><SubtleDigit char={experience.ss[1]} />
              </div>

              <span className="text-neutral-800 ml-1 text-sm md:text-base font-light">]</span>
            </div>
          </div>
        </motion.div>

        {/* Cell 2: Status */}
        <motion.div
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
          className="bg-[#0a0a0a] p-6 lg:p-8 flex flex-col justify-between group hover:bg-neutral-900 transition-colors min-h-[220px] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-neutral-500 group-hover:text-yellow-400 transition-colors" />
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Status</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
            </div>
          </div>

          <div>
            <div className="text-xl lg:text-2xl font-bold text-neutral-200 leading-tight tracking-tight uppercase group-hover:text-white transition-colors">
              Open to work <br />
              & Freelance
            </div>
            <p className="text-neutral-400 text-xs mt-2 font-mono tracking-wider">Available for new opportunities &bull; Tap to view</p>
          </div>
        </motion.div>

        {/* Cell 3: Tech Stack */}
        <motion.div
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
          className="bg-[#0a0a0a] p-6 lg:p-8 flex flex-col justify-between group hover:bg-neutral-900 transition-colors col-span-1 md:col-span-2 min-h-[160px] cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
        >
           <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-neutral-500 group-hover:text-blue-500 transition-colors" />
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Tech Stack</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-600 border border-neutral-800 px-3 py-1 rounded-full group-hover:border-neutral-500 transition-colors uppercase">Curated // Inspect</span>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 mt-8">
              {['Next.js', 'TypeScript', 'Golang', 'AI Agent', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker'].map((tech) => (
                 <div key={tech} className="flex items-center gap-2 group/item">
                    <div className="w-1.5 h-1.5 bg-neutral-800 group-hover/item:bg-red-500 transition-colors"></div>
                    <span className="text-sm font-mono text-neutral-400 group-hover/item:text-neutral-100 transition-colors tracking-tight uppercase">{tech}</span>
                 </div>
              ))}
           </div>
        </motion.div>

      </div>

      {/* Shared Element Morph Modal */}
      <AnimatePresence>
        {activeModal && (
          <BentoMorphModal
            type={activeModal}
            onClose={() => setActiveModal(null)}
            experienceString={experienceString}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};

export default BentoGrid;
export { BentoGrid as BentoGridComponent };

