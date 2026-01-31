import React from 'react';
import { techStackData } from '@/data/TechStackV4';

const TechStack = () => {
  return (
    <section className="relative py-20 px-6 lg:px-20 border-t border-neutral-800">
      
      {/* Section Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-neutral-500 mb-2">[ TECHNICAL_EXPERTISE ]</div>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase">TECH STACK</h2>
        </div>
        <div className="hidden md:block w-24 h-[1px] bg-neutral-800"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-neutral-800 border border-neutral-800">
        {techStackData.map((stack, idx) => (
          <div key={idx} className="bg-[#0a0a0a] p-8 hover:bg-neutral-900 transition-colors group">
            <div className="text-neutral-500 group-hover:text-white transition-colors mb-6">
              {stack.icon}
            </div>
            <h3 className="text-xl font-bold font-mono mb-4 uppercase">{stack.label}</h3>
            <div className="space-y-2">
              {stack.techs.map((tech) => (
                <div key={tech} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-neutral-600 group-hover:bg-red-500 transition-colors"></div>
                  <span className="text-sm text-neutral-400 font-mono">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default TechStack;
