import React from 'react';
import { motion } from 'framer-motion';
import { FADE_IN_UP_ITEM } from '@/constant/animations';

interface ResumeViewerProps {
  resumeUrl: string;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ resumeUrl }) => {
  return (
    <motion.div 
      variants={FADE_IN_UP_ITEM} 
      className="lg:col-span-8 xl:col-span-9 order-1 lg:order-2"
    >
      <div className="relative group rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-neutral-800 bg-neutral-900">
        {/* Custom Toolbar */}
        <div className="bg-neutral-800/50 backdrop-blur-md px-6 py-4 border-b border-neutral-800 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-[0.2em]">Secure View Active</span>
          </div>
        </div>

        {/* PDF Frame */}
        <div className="relative bg-neutral-900 h-[700px] md:h-[1000px] w-full">
          <div className="absolute inset-0 flex items-center justify-center text-neutral-700 font-mono text-sm animate-pulse z-0">
            ACCESSING_SECURE_STORAGE...
          </div>
          <iframe 
            src={resumeUrl}
            className="w-full h-full relative z-10 border-none opacity-90 group-hover:opacity-100 transition-opacity duration-500 grayscale-[0.5] hover:grayscale-0"
            allow="autoplay"
          ></iframe>
        </div>
      </div>
    </motion.div>
  );
};

export default ResumeViewer;
