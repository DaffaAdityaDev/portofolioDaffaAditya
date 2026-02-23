import React from 'react';
import { Briefcase } from 'lucide-react';
import { experienceData } from '@/data/ExperienceV4';

const Experience = () => {
  return (
    <section className="relative py-20 px-6 lg:px-20 border-t border-neutral-800">
      
      <div className="grid lg:grid-cols-2 gap-16">
        
        {/* Left: Section Header */}
        <div className="flex flex-col justify-between">
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
        </div>

        {/* Right: Timeline */}
        <div>
          <div className="text-xs font-mono text-neutral-500 mb-2">[ EXPERIENCE ]</div>
          <h3 className="text-2xl font-bold font-mono mb-8 uppercase">TIMELINE</h3>
          
          <div className="space-y-[1px] bg-neutral-800 border border-neutral-800">
            {experienceData.map((exp, idx) => (
              <div key={idx} className="bg-[#0a0a0a] p-6 hover:bg-neutral-900 transition-colors group">
                <div className="flex items-start gap-4 mb-3">
                  <Briefcase size={20} className="text-neutral-600 group-hover:text-white transition-colors mt-1" />
                  <div className="flex-1">
                    <div className="text-xs font-mono text-neutral-600 mb-2">{exp.year}</div>
                    <h4 className="text-lg font-bold mb-1">{exp.role}</h4>
                    <div className="text-sm text-neutral-500 font-mono mb-2">{exp.company}</div>
                    <p className="text-sm text-neutral-400">{exp.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};

export default Experience;
