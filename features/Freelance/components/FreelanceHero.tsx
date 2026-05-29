import React from 'react';
import { ArrowRight } from 'lucide-react';

export const FreelanceHero = () => {
  return (
    <section aria-label="Hero Introduction" className="w-full bg-[#0a0a0c] p-6 sm:p-12 md:p-16 lg:p-24 border-b border-zinc-800 relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 min-h-[460px]">
      <div className="absolute top-0 bottom-0 left-[33.3%] w-[1px] bg-zinc-800/40 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-[66.6%] w-[1px] bg-zinc-800/40 pointer-events-none" />
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <div className="space-y-6 max-w-5xl relative z-10">
        <div className="inline-flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <span className="text-red-500 text-xs font-bold font-mono tracking-widest uppercase">
            PRODUCTION SYSTEMS ENGINE ACTIVE
          </span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl md:text-8xl xl:text-9xl font-black text-white uppercase tracking-tighter leading-[0.82] mix-blend-difference">
          autonomous engineer <br />
          <span className="text-zinc-500">shaping performance</span> <br />
          from figma to scale.
        </h1>
        
        <p className="text-sm md:text-base text-zinc-400 font-mono leading-relaxed max-w-3xl">
          I design and engineer high-performance, conversion-optimized web applications, custom API backend systems, and autonomous AI workflows using Next.js, Go, and Node.js. Optimized for speed, reliability, and clean developer handoffs.
        </p>
      </div>

      <div className="shrink-0 relative z-10 mt-8 lg:mt-0">
        <a href="#contact-scoping" className="group flex h-16 px-10 bg-white text-black font-bold tracking-tight hover:bg-neutral-200 transition-all items-center gap-3 active:scale-95 text-sm uppercase">
          DISCUSS PROJECT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      
      <div className="absolute bottom-4 right-6 font-mono text-xs text-zinc-500 hidden md:block">
        MODEL: FREELANCE_GRID_V4.0 <br />
        SYS_REF: 4K_SUPPORTED_SCALE
      </div>
    </section>
  );
};

export default FreelanceHero;
