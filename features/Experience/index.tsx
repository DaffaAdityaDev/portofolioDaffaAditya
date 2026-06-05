import React from 'react';
import { Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { experienceData } from './constants';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/constant/animations';

const Experience = () => {
  return (
    <motion.section 
      id="experience-section"
      variants={FADE_IN_UP_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative py-20 px-6 lg:px-20 border-t border-neutral-800"
    >
      
      <div className="grid lg:grid-cols-2 gap-16 relative z-20">
        
        {/* Left: Section Header */}
        <motion.div variants={FADE_IN_UP_ITEM} className="flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono text-neutral-500 mb-2">[ CAREER ]</div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-6">EXPERIENCE</h2>
            
            <p className="max-w-md text-neutral-400 font-mono text-sm leading-relaxed">
              /// SYSTEM_LOG: Career trajectory.<br /><br />
              Bridging the gap between ambitious design and complex technical constraints. A chronological record of roles, responsibilities, and impact across the industry.
            </p>
          </div>
          
          <div className="hidden lg:block mt-auto pb-8">
            <div className="w-16 h-px bg-white/20 mb-4"></div>
            <p className="text-xs font-mono text-neutral-500 uppercase">
              ENV: PRODUCTION<br/>
              AVAILABLE FOR HIRE: TRUE
            </p>
          </div>
        </motion.div>

        {/* Right: Timeline */}
        <div className="flex flex-col">
          <div className="text-xs font-mono text-neutral-500 mb-2">[ EXPERIENCE ]</div>
          <h3 className="text-2xl font-bold font-mono mb-8 uppercase">TIMELINE</h3>
          
          <div className="relative pl-8 md:pl-16 space-y-12">
            {/* Timeline markers for parent SVG */}
            <div id="experience-timeline-start" className="absolute left-[9px] md:left-[17px] top-0 w-1 h-1 pointer-events-none" />
            <div id="experience-timeline-end" className="absolute left-[9px] md:left-[17px] bottom-0 w-1 h-1 pointer-events-none" />

            {experienceData.map((exp, idx) => (
              <div key={idx} className="relative flex flex-col md:flex-row gap-6 md:gap-12 group cursor-crosshair">
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 z-10 flex items-center justify-center w-[16px] h-[16px] md:w-[20px] h-[20px] shrink-0">
                  <div className="w-full h-full rounded-full bg-[#0a0a0a] border-2 border-zinc-700 flex items-center justify-center transition-all duration-300 group-hover:border-red-500 group-hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] shrink-0">
                    <div className="w-[6px] h-[6px] md:w-[8px] h-[8px] rounded-full bg-zinc-600 transition-colors duration-300 group-hover:bg-red-500 shrink-0" />
                  </div>
                </div>

                <div className="flex-1 p-6 md:p-8 border border-zinc-800 bg-zinc-900/20 rounded-xl group-hover:border-zinc-700 group-hover:bg-zinc-900/40 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-950/5 rounded-full blur-2xl pointer-events-none group-hover:bg-red-950/10 transition-colors" />

                  <span className="text-xs font-mono text-red-500 uppercase tracking-wider block font-bold mb-1">
                    {exp.year}
                  </span>
                  <div className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors duration-300 mb-2">
                    {exp.role}
                  </div>
                  <div className="text-sm text-neutral-500 font-mono mb-4">{exp.company}</div>

                  <p className="text-zinc-300 font-mono text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.section>
  );
};

export default Experience;
export { Experience };
