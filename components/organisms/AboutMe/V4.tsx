import React from 'react';
import Image from 'next/image';

const AboutMeV4 = () => {
  return (
    <section id="about" className="relative py-20 px-6 lg:px-20 border-t border-neutral-800 bg-transparent">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h2 className="text-sm font-mono text-zinc-500 mb-2">/// SECTION_01</h2>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">About Me</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start relative">
            <div className="w-full max-w-sm aspect-3/4 relative border border-neutral-800 p-2 bg-neutral-900/20">
              <div className="absolute inset-0 bg-neutral-800/10 z-10 opacity-50 mix-blend-overlay"></div>
              <div className="relative w-full h-full grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden">
                <Image 
                  src="/image/Profile.jpg"
                  alt="Daffa Aditya Rahman"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50 -translate-x-1 -translate-y-1"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50 translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50 -translate-x-1 translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50 translate-x-1 translate-y-1"></div>
            </div>
            
            <div className="mt-6 w-full font-mono text-xs text-neutral-500 uppercase flex justify-between border-t border-neutral-800 pt-3">
               <span>STATUS: ACTIVE</span>
               <span>LOC: JAKARTA_ID</span>
            </div>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-center space-y-8">
          <div>
             <h3 className="text-2xl font-black text-white uppercase mb-2">The Journey</h3>
             <div className="h-px w-12 bg-white/50 mb-6"></div>
             
             <p className="text-neutral-400 text-base lg:text-lg leading-relaxed font-mono mb-6">
                My journey into programming began in 2019, sparked by a friend's recommendation to take Harvard's CS50 course. What started as self-taught curiosity quickly evolved into a dedicated career. I formalized this passion by pursuing a Software Engineering degree, consistently pushing myself to learn beyond the classroom.
             </p>
             <p className="text-neutral-400 text-base lg:text-lg leading-relaxed font-mono mb-6">
                Since then, I've had the privilege of training under Google's Bangkit Academy, building government application systems, and developing SaaS platforms for IT companies. Today, as a Software Engineer, my focus is on delivering cutting-edge technologies while maintaining high maintainability and scalability.
             </p>
             <p className="text-neutral-400 text-base lg:text-lg leading-relaxed font-mono">
                Outside of my core work, I actively take on freelance projects and continuously learn and experiment with new technologies.
             </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-neutral-800/50">
             <div className="p-4 bg-neutral-900/30 border border-neutral-800 flex flex-col items-center justify-center text-center">
               <span className="block text-3xl font-black text-white mb-1">2+</span>
               <span className="text-xs font-mono text-neutral-500 uppercase">Years Exp</span>
             </div>
             <div className="p-4 bg-neutral-900/30 border border-neutral-800 flex flex-col items-center justify-center text-center">
               <span className="block text-3xl font-black text-white mb-1">6+</span>
               <span className="text-xs font-mono text-neutral-500 uppercase">Projects</span>
             </div>
             <div className="p-4 bg-neutral-900/30 border border-neutral-800 flex flex-col items-center justify-center text-center">
               <span className="block text-3xl font-black text-white mb-1">10+</span>
               <span className="text-xs font-mono text-neutral-500 uppercase">Tech Stacks</span>
             </div>
             <div className="p-4 bg-neutral-900/30 border border-neutral-800 flex flex-col items-center justify-center text-center">
               <span className="block text-3xl font-black text-white mb-1">4</span>
               <span className="text-xs font-mono text-neutral-500 uppercase">Certifications</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeV4;
