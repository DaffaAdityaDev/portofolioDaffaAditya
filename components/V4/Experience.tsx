import React from 'react';
import { Briefcase } from 'lucide-react';
import { experienceData } from '@/data/ExperienceV4';

const Experience = () => {
  return (
    <section className="relative py-20 px-6 lg:px-20 border-t border-neutral-800">
      
      <div className="grid lg:grid-cols-2 gap-16">
        
        {/* Left: About */}
        <div>
          <div className="text-xs font-mono text-neutral-500 mb-2">[ ABOUT ]</div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-8">BACKGROUND</h2>
          
          <div className="space-y-4 text-neutral-400 leading-relaxed">
            <p>
              I'm a well-rounded Software Engineer with a passion for solving complex and ambiguous problems. 
              With experience across the full software development life cycle—from design to deployment—I 
              thrive in environments that challenge me to think critically and innovate.
            </p>
            
            <p>
              My expertise spans a wide range of technologies, allowing me to adapt and tackle projects 
              of varying complexity with precision and efficiency. Currently based in Jakarta, Indonesia.
            </p>
            
            <p>
              Whether it's optimizing code performance or building user-friendly applications, I am 
              dedicated to delivering high-quality solutions that meet and exceed expectations.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="border border-neutral-800 p-4">
              <div className="text-2xl font-bold font-mono">15+</div>
              <div className="text-xs text-neutral-600 font-mono">PROJECTS</div>
            </div>
            <div className="border border-neutral-800 p-4">
              <div className="text-2xl font-bold font-mono">3+</div>
              <div className="text-xs text-neutral-600 font-mono">YEARS_EXP</div>
            </div>
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
