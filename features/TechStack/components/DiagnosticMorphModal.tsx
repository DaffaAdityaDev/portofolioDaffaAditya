import React from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Code2 } from 'lucide-react';
import { Module } from '../constants';
import { SPRING_MOBILE_OS, BACKDROP_VARIANTS } from '@/constant/animations';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import Portal from '@/components/ui/Portal';

interface DiagnosticMorphModalProps {
  module: Module | null;
  onClose: () => void;
}

export const DiagnosticMorphModal: React.FC<DiagnosticMorphModalProps> = ({ module, onClose }) => {
  useModalDismiss(!!module, onClose);

  if (!module) return null;

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
          layoutId={`diagnostic-module-${module.id}`}
          transition={SPRING_MOBILE_OS}
          className="relative w-full max-w-2xl max-h-[90vh] bg-[#0d0d10] border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-neutral-100 focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`diag-title-${module.id}`}
          tabIndex={-1}
        >
          {/* iOS sheet handle for mobile */}
          <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing sm:hidden">
            <div className="w-12 h-1.5 rounded-full bg-white/20" />
          </div>

          {/* Modal Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#131318]/60 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="text-red-400 p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                {module.icon}
              </div>
              <div>
                <h3
                  id={`diag-title-${module.id}`}
                  className="font-mono text-base font-black text-white tracking-widest uppercase"
                >
                  {module.name}
                </h3>
                <div className="font-mono text-[10px] text-zinc-500 uppercase">
                  ARCHITECTURAL BLUEPRINT // ID: {module.id}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/30 border border-emerald-500/30 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  {module.status}
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
                aria-label="Close diagnostic inspector"
              >
                <span className="hidden sm:inline text-[10px] text-neutral-400 px-1 font-mono">ESC</span>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Overview & Philosophy */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Code2 size={12} />
                ENGINEERING PHILOSOPHY & SCOPE
              </span>
              <h4 className="text-lg font-black text-white uppercase tracking-tight">
                {module.headline}
              </h4>
              <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                {module.description}
              </p>
            </div>

            {/* Architectural Pillars (Real engineering standards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl">
              {module.pillars.map((pillar, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r last:border-none border-zinc-800/80 pb-2 sm:pb-0 sm:pr-3">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    {pillar.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-white leading-snug">
                    {pillar.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Core Capabilities & Tool Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} className="text-red-400" />
                  CORE CAPABILITIES & RUNTIMES
                </span>
                <span className="text-[10px] font-mono text-zinc-600">
                  TOTAL: {module.processes.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {module.processes.map((proc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700/60 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono tracking-tight">
                          {proc.name}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {proc.roleLabel}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {proc.role}
                    </p>

                    {proc.patterns && proc.patterns.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proc.patterns.map((tag, pIdx) => (
                          <span
                            key={pIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/40"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Close */}
            <div className="pt-2 flex justify-end border-t border-white/5">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer"
              >
                Close Blueprint
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </Portal>
  );
};

export default DiagnosticMorphModal;
