import React, { useState, useEffect } from 'react';
import { Globe, ArrowUpRight, Zap, Cpu } from 'lucide-react';

const BentoGrid = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    setTime(new Date().toLocaleTimeString());
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-[1px] bg-neutral-800 border border-neutral-800 h-full w-full">
      
      {/* Cell 1: Location & Time */}
      <div className="bg-[#0a0a0a] p-6 flex flex-col justify-between group hover:bg-neutral-900 transition-colors min-h-[200px]">
        <div className="flex justify-between items-start">
          <Globe size={24} className="text-neutral-500 group-hover:text-white transition-colors" />
          <ArrowUpRight size={20} className="text-neutral-700 group-hover:text-red-500 transition-colors" />
        </div>
        <div>
          <div className="text-neutral-500 text-xs font-mono mb-1">LOCAL_TIME</div>
          <div className="text-2xl font-bold text-white font-mono">{time}</div>
          <div className="text-neutral-500 text-xs font-mono mt-1">SAN FRANCISCO, US</div>
        </div>
      </div>

      {/* Cell 2: Current Status */}
      <div className="bg-[#0a0a0a] p-6 flex flex-col justify-between group hover:bg-neutral-900 transition-colors min-h-[200px]">
        <div className="flex justify-between items-start">
          <Zap size={24} className="text-neutral-500 group-hover:text-yellow-400 transition-colors" />
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div>
          <div className="text-neutral-500 text-xs font-mono mb-1">STATUS</div>
          <div className="text-xl font-bold text-white leading-tight">AVAILABLE FOR WORK</div>
        </div>
      </div>

      {/* Cell 3: Tech Stack */}
      <div className="bg-[#0a0a0a] p-6 flex flex-col justify-between group hover:bg-neutral-900 transition-colors col-span-1 md:col-span-2 min-h-[200px]">
         <div className="flex justify-between items-start">
            <Cpu size={24} className="text-neutral-500 group-hover:text-blue-500 transition-colors" />
            <span className="text-xs font-mono text-neutral-600 border border-neutral-800 px-2 py-1 rounded-full">STACK.json</span>
         </div>
         <div className="grid grid-cols-4 gap-4 mt-4">
            {['React', 'TypeScript', 'Next.js', 'Tailwind', 'Node.js', 'GraphQL', 'PostgreSQL', 'Docker'].map(tech => (
               <div key={tech} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-neutral-600"></div>
                  <span className="text-sm font-mono text-neutral-300">{tech}</span>
               </div>
            ))}
         </div>
      </div>

    </div>
  );
};

export default BentoGrid;
