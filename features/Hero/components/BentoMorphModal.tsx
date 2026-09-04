import React from 'react';
import { motion } from 'framer-motion';
import { X, Globe, Zap, Cpu, Clock, CheckCircle2, ArrowRight, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { SPRING_MOBILE_OS, BACKDROP_VARIANTS } from '@/constant/animations';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import Portal from '@/components/ui/Portal';

export type BentoModalType = 'location' | 'status' | 'tech' | null;

interface BentoMorphModalProps {
  type: BentoModalType;
  onClose: () => void;
  experienceString?: string;
}

export const BentoMorphModal: React.FC<BentoMorphModalProps> = ({ type, onClose, experienceString }) => {
  useModalDismiss(!!type, onClose);

  if (!type) return null;

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

        {/* Shared FLIP Morph Container */}
        <motion.div
          layoutId={`bento-cell-${type}`}
          transition={SPRING_MOBILE_OS}
          className="relative w-full max-w-xl max-h-[90vh] bg-[#0d0d10] border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-neutral-100 focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bento-modal-title"
          tabIndex={-1}
        >
        {/* iOS sheet handle */}
        <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Modal Top Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#131318]/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-neutral-400">
            {type === 'location' && (
              <>
                <Globe size={15} className="text-red-400" />
                <span>LOCATION & CHRONOMETRY SPEC</span>
              </>
            )}
            {type === 'status' && (
              <>
                <Zap size={15} className="text-yellow-400" />
                <span>AVAILABILITY & ENGAGEMENT</span>
              </>
            )}
            {type === 'tech' && (
              <>
                <Cpu size={15} className="text-blue-400" />
                <span>CORE ENGINEERING CLUSTER</span>
              </>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
            aria-label="Close modal"
          >
            <span className="hidden sm:inline text-[10px] text-neutral-400 px-1 font-mono">ESC</span>
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          {/* CONTENT FOR TYPE === LOCATION */}
          {type === 'location' && (
            <>
              <div className="space-y-2">
                <h3 id="bento-modal-title" className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Jakarta, Indonesia
                </h3>
                <p className="text-neutral-400 text-sm font-mono flex items-center gap-2">
                  <Clock size={14} className="text-red-400" />
                  TIMEZONE: GMT+7 (WIB) &bull; REMOTE READY WORLDWIDE
                </p>
              </div>

              {experienceString && (
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                    TOTAL ACCUMULATED EXPERIENCE
                  </span>
                  <div className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight">
                    {experienceString}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  COLLABORATION CAPABILITIES:
                </span>
                <div className="space-y-2 font-mono text-xs text-zinc-300">
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Seamless overlap with APAC, EMEA, and US East/West working hours.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Fluent in English and Indonesian; asynchronous communication champion.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Equipped with enterprise fiber redundancy & dedicated workstation.</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CONTENT FOR TYPE === STATUS */}
          {type === 'status' && (
            <>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>ACCEPTING NEW CONTRACTS & ROLES</span>
                </div>
                <h3 id="bento-modal-title" className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Open to Work & Freelance
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase">ENGAGEMENT</span>
                  <div className="text-white font-bold text-sm">Full-Time / B2B</div>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <span className="text-zinc-500 text-[10px] uppercase">RESPONSE TIME</span>
                  <div className="text-emerald-400 font-bold text-sm">&lt; 2 Hours</div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  SERVICES & DOMAINS:
                </span>
                <div className="space-y-2 font-mono text-xs text-zinc-300">
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                    <span>Modern frontend architecture (React 19, Next.js, TypeScript).</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                    <span>Enterprise design systems & modular component packages.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                    <span>AI agent integration, workflow automation, and backend APIs.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="mailto:daffaaditya.me@gmail.com"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white text-black font-extrabold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg shadow-white/10"
                >
                  <Mail size={15} />
                  <span>Direct Project Inquiry</span>
                </a>
              </div>
            </>
          )}

          {/* CONTENT FOR TYPE === TECH */}
          {type === 'tech' && (
            <>
              <div className="space-y-2">
                <h3 id="bento-modal-title" className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Curated Engineering Stack
                </h3>
                <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                  Carefully chosen tools, architectural patterns, and production-tested libraries utilized daily across production environments.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {[
                  { name: 'Next.js', role: 'Fullstack / SSR / Turbopack' },
                  { name: 'TypeScript', role: 'Type Safety / Zero Any' },
                  { name: 'Golang', role: 'High Throughput Backend' },
                  { name: 'AI Agent / LangGraph', role: 'Autonomous Workflows' },
                  { name: 'Node.js', role: 'Microservices & APIs' },
                  { name: 'GraphQL', role: 'Federated Data Graph' },
                  { name: 'PostgreSQL', role: 'Relational Database' },
                  { name: 'Docker', role: 'Container Orchestration' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800 flex flex-col gap-1">
                    <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                      <Sparkles size={11} className="text-red-400" />
                      {item.name}
                    </span>
                    <span className="text-[10px] text-zinc-500">{item.role}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      const el = document.getElementById('tech-stack') || document.getElementById('tech-stack-layout-group');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }, 120);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-zinc-900 border border-white/15 text-white font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <span>Explore Full Specs & Diagnostics</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}

          {/* Footer Close */}
          <div className="pt-2 flex justify-end border-t border-white/5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Close Spec
            </button>
          </div>
        </div>
      </motion.div>
    </div>
    </Portal>
  );
};

export default BentoMorphModal;
