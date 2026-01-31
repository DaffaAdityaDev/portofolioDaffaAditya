import React from 'react';
import { ArrowRight, Square, Circle, Triangle } from 'lucide-react';
import GridLine from './GridLine';
import BentoGrid from './BentoGrid';

const HeroContent = () => (
  <div className="flex flex-col justify-between h-full py-12 lg:py-0">
    <div className="space-y-6">
      <div className="inline-block border border-red-900/50 bg-red-900/10 px-3 py-1">
        <span className="text-red-500 text-xs font-bold font-mono tracking-widest uppercase">Software Engineer</span>
      </div>
      
      <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter uppercase mix-blend-difference">
        Daffa <br />
        Aditya <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-500 to-white">Rahman.</span>
      </h1>
      
      <p className="max-w-md text-neutral-400 text-lg leading-relaxed font-mono">
        // Functional, user-centric web solutions. 
        Creating impactful projects with technical expertise and creativity.
      </p>
    </div>

    <div className="flex items-center gap-6 mt-12 lg:mt-0">
       <button 
         onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
         className="h-14 px-8 bg-white text-black font-bold tracking-tight hover:bg-neutral-200 transition-colors flex items-center gap-3"
       >
         VIEW PROJECTS <ArrowRight size={20} />
       </button>
       <a 
         href="https://drive.google.com/file/d/16bp1lgGaVHe670IO1bR7khk01h6GaXdC/view"
         target="_blank"
         rel="noopener noreferrer"
         className="h-14 px-8 border border-neutral-700 text-white font-mono text-sm hover:border-white transition-colors flex items-center"
       >
         [ RESUME ]
       </a>
    </div>
  </div>
);

const Hero = () => (
  <section id="hero" className="relative pt-16 flex flex-col lg:flex-row min-h-screen">
    
    {/* Left Section: Content */}
    <div className="w-full lg:w-1/2 p-6 lg:p-12 xl:p-20 border-r border-neutral-800 relative flex items-center">
       <GridLine className="top-12 opacity-50" />
       <GridLine className="bottom-12 opacity-50" />
       <GridLine vertical className="left-12 opacity-50" />
       
       <HeroContent />
    </div>

    {/* Right Section: Bento Grid */}
    <div className="w-full lg:w-1/2 bg-[#050505] p-6 lg:p-12 xl:p-20 relative flex items-center justify-center">
        {/* Background Grid Texture */}
        <div className="absolute inset-0 z-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>
        
        <div className="w-full max-w-lg z-10 shadow-2xl shadow-black">
           <BentoGrid />
        </div>

        {/* Decorative Overlay Elements */}
        <div className="absolute top-6 right-6 flex gap-2">
           <Square size={12} className="text-neutral-700" />
           <Circle size={12} className="text-neutral-700" />
           <Triangle size={12} className="text-neutral-700" />
        </div>
        
        <div className="absolute bottom-6 left-6 font-mono text-[10px] text-neutral-600">
           SYS_ID: 8849-ALPHA <br />
           RENDER: VIRTUAL_DOM
        </div>
    </div>

  </section>
);

export default Hero;
