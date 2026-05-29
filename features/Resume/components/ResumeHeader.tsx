import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';
import { FADE_IN_UP_ITEM } from '@/constant/animations';

interface ResumeHeaderProps {
  downloadUrl: string;
  onBackToHome: () => void;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ downloadUrl, onBackToHome }) => {
  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
      <motion.div variants={FADE_IN_UP_ITEM} className="lg:col-span-8">
        <button 
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-mono text-neutral-500 hover:text-white transition-colors mb-8 uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={14} /> Return to Home
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
          <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-2">
            RESUME<span className="text-red-500">.</span>
          </h1>
          <div className="flex flex-col border-l border-neutral-800 pl-6 py-1">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">Status</span>
              <span className="text-sm md:text-base font-bold text-neutral-200 uppercase tracking-tight">
                Open to work <br />
                & Freelance
              </span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={FADE_IN_UP_ITEM} className="lg:col-span-4 flex justify-start lg:justify-end">
        <a 
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-4 bg-white text-black px-10 py-5 font-black text-sm hover:bg-neutral-200 transition-all active:scale-95 uppercase tracking-widest overflow-hidden"
        >
          <div className="absolute inset-0 bg-red-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <Download size={18} className="relative z-10 group-hover:text-white transition-colors" /> 
          <span className="relative z-10 group-hover:text-white transition-colors">Capture Copy</span>
        </a>
      </motion.div>
    </div>
  );
};

export default ResumeHeader;
