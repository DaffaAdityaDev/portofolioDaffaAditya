import React, { useState, useEffect } from 'react';
import { Globe, ArrowUpRight, Zap, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateDuration } from '@/utils/date';

// Virtual Start Date: Accumulated duration of real experience (Internships + Current Role)
const VIRTUAL_START_DATE = new Date('2023-03-01T00:00:00');

// Initial State Constant
const INITIAL_EXPERIENCE = { y: '00', m: '00', d: '00', hh: '00', mm: '00', ss: '00' };

/**
 * Subtle Digit Component: Handles the opacity and motion transition 
 * for individual digits in the timer/counter.
 */
const SubtleDigit = ({ char }: { char: string }) => {
  return (
    <span className="inline-block w-[0.52em] text-center tabular-nums">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={char}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

const BentoGrid = () => {
  const [experience, setExperience] = useState(INITIAL_EXPERIENCE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updateExperience = () => {
      setExperience(calculateDuration(VIRTUAL_START_DATE));
    };

    updateExperience();
    const timer = setInterval(updateExperience, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[1px] bg-neutral-800 border border-neutral-800 h-full w-full overflow-hidden shadow-2xl">
      
      {/* Cell 1: Location & Experience Counter */}
      <div className="bg-[#0a0a0a] p-6 lg:p-8 flex flex-col justify-between group hover:bg-neutral-900 transition-colors min-h-[220px]">
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-neutral-500 group-hover:text-red-500 transition-colors" />
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Based in</span>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-white tracking-tight whitespace-nowrap">Jakarta, Indonesia</h3>
          </div>
          <ArrowUpRight size={18} className="text-neutral-700 group-hover:text-white transition-colors" />
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
      </div>

      {/* Cell 2: Status */}
      <div className="bg-[#0a0a0a] p-6 lg:p-8 flex flex-col justify-between group hover:bg-neutral-900 transition-colors min-h-[220px]">
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
          <p className="text-neutral-500 text-sm mt-2 font-mono tracking-tighter italic">// Available for new projects</p>
        </div>
      </div>

      {/* Cell 3: Tech Stack */}
      <div className="bg-[#0a0a0a] p-6 lg:p-8 flex flex-col justify-between group hover:bg-neutral-900 transition-colors col-span-1 md:col-span-2 min-h-[160px]">
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-neutral-500 group-hover:text-blue-500 transition-colors" />
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Tech Stack</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-600 border border-neutral-800 px-3 py-1 rounded-full group-hover:border-neutral-500 transition-colors uppercase">Curated</span>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 mt-8">
            {['Next.js', 'TypeScript', 'Golang', 'AI Agent', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker'].map((tech) => (
               <div key={tech} className="flex items-center gap-2 group/item">
                  <div className="w-1.5 h-1.5 bg-neutral-800 group-hover/item:bg-red-500 transition-colors"></div>
                  <span className="text-sm font-mono text-neutral-400 group-hover/item:text-neutral-100 transition-colors tracking-tight uppercase">{tech}</span>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default BentoGrid;
