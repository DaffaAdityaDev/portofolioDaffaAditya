import React from 'react';
import { ArrowRight, Square, Circle, Triangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import GridLine from '@/components/ui/GridLine';
import BentoGrid from './components/BentoGrid';
import { FADE_IN_SCALE, FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/constant/animations';

const Hero = () => {
  const router = useRouter();

  return (
    <section id="hero" className="relative pt-16 flex flex-col lg:flex-row min-h-screen overflow-hidden">
      
      {/* Left Section: Content */}
      <div className="w-full lg:w-1/2 p-6 md:p-12 border-r border-neutral-800 relative flex items-center">
         <GridLine className="top-12 opacity-50" />
         <GridLine className="bottom-12 opacity-50" />
         <GridLine vertical className="left-6 md:left-12 opacity-50" />
         
         <motion.div 
            variants={FADE_IN_UP_CONTAINER}
            initial="hidden"
            animate="visible"
            className="flex flex-col justify-between h-full py-12 lg:py-0 w-full"
          >
            <div className="space-y-6">
              <motion.div variants={FADE_IN_UP_ITEM} className="inline-block border border-red-900/50 bg-red-900/10 px-3 py-1">
                <span className="text-red-500 text-xs font-bold font-mono tracking-widest uppercase">Software Engineer</span>
              </motion.div>
              
              <motion.h1 
                variants={FADE_IN_UP_ITEM}
                className="lg:text-8xl text-5xl font-black text-white leading-[0.9] tracking-tighter uppercase mix-blend-difference"
              >
                Daffa <br />
                Aditya <br />
              </motion.h1>
              
              <motion.p 
                variants={FADE_IN_UP_ITEM}
                className="max-w-md text-neutral-400 text-base md:text-lg leading-relaxed font-mono"
              >
                // Functional, user-centric web solutions. 
                Creating impactful projects with technical expertise and creativity.
              </motion.p>
            </div>

            <motion.div variants={FADE_IN_UP_ITEM} className="flex flex-wrap items-center gap-4 mt-12 lg:mt-0">
               <button 
                 onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
                 className="group h-14 px-6 md:px-8 bg-white text-black font-bold tracking-tight hover:bg-neutral-200 transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap"
               >
                 VIEW PROJECTS <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </button>
               <button 
                 onClick={() => router.push('/resume')}
                 className="h-14 px-6 md:px-8 border border-neutral-700 text-white font-mono text-sm hover:border-white hover:bg-white/5 transition-all flex items-center active:scale-95 whitespace-nowrap"
               >
                 [ RESUME ]
               </button>
            </motion.div>
          </motion.div>
      </div>

      {/* Right Section: Bento Grid */}
      <motion.div 
        variants={FADE_IN_SCALE}
        initial="hidden"
        animate="visible"
        className="w-full lg:w-1/2 bg-[#050505] p-6 lg:p-12 xl:p-20 relative flex items-center justify-center"
      >
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
      </motion.div>

    </section>
  );
};

export default Hero;
export { Hero as HeroComponent };
