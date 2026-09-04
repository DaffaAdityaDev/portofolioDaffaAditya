import React from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Calendar, Building2, CheckCircle2, Award } from 'lucide-react';
import { ExperienceItem } from '../constants';
import { SPRING_MOBILE_OS, BACKDROP_VARIANTS } from '@/constant/animations';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import Portal from '@/components/ui/Portal';

interface ExperienceMorphModalProps {
  item: ExperienceItem | null;
  index: number | null;
  onClose: () => void;
}

export const ExperienceMorphModal: React.FC<ExperienceMorphModalProps> = ({ item, index, onClose }) => {
  useModalDismiss(!!item, onClose);

  if (!item || index === null) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
        {/* Backdrop */}
        <motion.div
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl -z-10"
          aria-hidden="true"
        />

        {/* Fluid Morphing Container */}
        <motion.div
          layoutId={`exp-card-${index}`}
          transition={SPRING_MOBILE_OS}
          className="relative w-full max-w-2xl max-h-[90vh] bg-[#0d0d10] border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-neutral-100 focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`exp-role-${index}`}
          tabIndex={-1}
        >
        {/* iOS sheet handle */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Modal Top Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#131318]/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Calendar size={13} />
            <span>{item.year}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
            aria-label="Close experience detail"
          >
            <span className="hidden sm:inline text-[10px] text-neutral-400 px-1 font-mono">ESC</span>
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h3
              id={`exp-role-${index}`}
              className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
            >
              {item.role}
            </h3>

            <div className="flex items-center gap-2 text-neutral-300 font-mono text-sm">
              <Building2 size={15} className="text-zinc-500" />
              <span>{item.company}</span>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800 space-y-2">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              ROLE SUMMARY & IMPACT:
            </span>
            <p className="text-sm md:text-base text-zinc-200 font-sans leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Award size={13} className="text-red-400" />
              KEY MILESTONES & CORE RESPONSIBILITIES:
            </span>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/60 font-mono text-xs text-zinc-300">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Production system architecture and clean, modular component implementation.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/60 font-mono text-xs text-zinc-300">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Cross-functional pair programming, performance profiling, and code review standards.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/60 font-mono text-xs text-zinc-300">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>High reliability and responsive design compliance across multi-device ecosystems.</span>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-4 flex items-center justify-between border-t border-white/5">
            <span className="text-[10px] font-mono text-zinc-600 uppercase">
              STATUS: RECORD AUDITED
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
    </Portal>
  );
};

export default ExperienceMorphModal;
