import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { experienceData, ExperienceItem } from './constants';
import { ExperienceMorphModal } from './components/ExperienceMorphModal';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/constant/animations';

const Experience = () => {
  const [selectedItem, setSelectedItem] = useState<{ item: ExperienceItem; index: number } | null>(null);

  return (
    <LayoutGroup id="experience-group">
      <motion.section 
        id="experience-section"
        variants={FADE_IN_UP_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative py-20 px-6 lg:px-20 border-t border-zinc-800"
      >
        <div className="relative z-20 max-w-7xl mx-auto">
          {/* Section Header matching Projects and TechStack */}
          <motion.div 
            variants={FADE_IN_UP_ITEM} 
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-zinc-800 gap-4"
          >
            <div>
              <div className="text-xs font-mono text-zinc-500 mb-1 tracking-widest uppercase">
                [ 01 // CAREER ]
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                Experience
              </h2>
            </div>
            <p className="max-w-md text-zinc-400 font-mono text-xs md:text-sm leading-relaxed">
              Chronological track record of engineering roles, production systems architecture, and technical contributions.
            </p>
          </motion.div>

          {/* Experience Table Rows */}
          <div className="divide-y divide-zinc-800/80 border-b border-zinc-800/80">
            {experienceData.map((exp, idx) => {
              const isCurrent = exp.year.toLowerCase().includes('now');

              return (
                <motion.div
                  key={idx}
                  variants={FADE_IN_UP_ITEM}
                  layoutId={`exp-card-${idx}`}
                  onClick={() => setSelectedItem({ item: exp, index: idx })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedItem({ item: exp, index: idx });
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${exp.role} at ${exp.company}`}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between py-6 px-4 md:px-6 -mx-4 md:-mx-6 rounded-2xl hover:bg-zinc-900/40 active:bg-zinc-900/60 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-red-500/50"
                >
                  {/* Left Column: Timeline & System Status Badge */}
                  <div className="flex items-center gap-3 w-full md:w-56 shrink-0 mb-3 md:mb-0">
                    {isCurrent ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/20 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400 tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        PRESENT
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-zinc-400 font-medium tracking-wide">
                        {exp.year}
                      </span>
                    )}
                  </div>

                  {/* Center Column: Role, Company & Summary */}
                  <div className="flex-1 md:pr-8">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight group-hover:text-red-500 group-hover:translate-x-1 transition-all duration-200">
                        {exp.role}
                      </h3>
                      <span className="text-sm font-mono text-zinc-400">
                        @{exp.company}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed mt-2 line-clamp-2 group-hover:text-zinc-300 transition-colors">
                      {exp.description}
                    </p>
                  </div>

                  {/* Right Column: Action Cue */}
                  <div className="flex items-center gap-3 mt-4 md:mt-0 shrink-0 self-end md:self-center">
                    <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors hidden sm:inline">
                      View Details
                    </span>
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-zinc-600 group-hover:bg-zinc-800 flex items-center justify-center transition-all duration-200 shadow-sm">
                      <ArrowUpRight 
                        size={14} 
                        className="text-zinc-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" 
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Modal Morph Detail */}
        <AnimatePresence>
          {selectedItem && (
            <ExperienceMorphModal
              item={selectedItem.item}
              index={selectedItem.index}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </AnimatePresence>
      </motion.section>
    </LayoutGroup>
  );
};

export default Experience;
export { Experience };
