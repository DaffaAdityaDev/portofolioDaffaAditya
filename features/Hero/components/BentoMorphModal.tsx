import React from 'react';
import { m } from 'framer-motion';
import { X, Globe, Zap, Cpu, Clock, CheckCircle2, ArrowRight, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import { SPRING_MOBILE_OS, BACKDROP_VARIANTS } from '@/constant/animations';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import Portal from '@/components/ui/Portal';
import { siteConfig } from '@/config/metadata.config';
import { EXPERIENCE_LABEL } from './ExperienceTicker';

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
        <m.div
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl -z-10"
          aria-hidden="true"
        />

        {/* Shared FLIP Morph Container */}
        <m.div
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
                <span>LOCATION & EXPERIENCE</span>
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
                <span>TECH STACK</span>
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
                  TIMEZONE: GMT+7 (WIB) &bull; OPEN TO REMOTE WORK
                </p>
              </div>

              {experienceString && (
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                    {EXPERIENCE_LABEL}
                  </span>
                  <div className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight">
                    {experienceString}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                  WORKING STYLE:
                </span>
                <div className="space-y-2 font-mono text-xs text-zinc-300">
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Based in Jakarta (GMT+7); comfortable working with remote teams across time zones.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Works in English and Indonesian, in writing and on calls.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                    <span>Reviews code and mentors interns day to day at Run System.</span>
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
                  <span>OPEN TO NEW ROLES & FREELANCE</span>
                </div>
                <h3 id="bento-modal-title" className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Open to Work & Freelance
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase">ENGAGEMENT</span>
                  <div className="text-white font-bold text-sm">Full-time / Freelance</div>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1">
                  <span className="text-zinc-400 text-[10px] uppercase">LOCATION</span>
                  <div className="text-white font-bold text-sm">Jakarta / Remote</div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                  SERVICES & DOMAINS:
                </span>
                <div className="space-y-2 font-mono text-xs text-zinc-300">
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                    <span>Web apps with React, Next.js and TypeScript.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                    <span>Third-party integrations, such as payments, for business systems.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-800/80 flex items-center gap-3">
                    <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                    <span>Backend APIs and AI agent workflows.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white text-black font-extrabold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer shadow-lg shadow-white/10"
                >
                  <Mail size={15} />
                  <span>Email me</span>
                </a>
              </div>
            </>
          )}

          {/* CONTENT FOR TYPE === TECH */}
          {type === 'tech' && (
            <>
              <div className="space-y-2">
                <h3 id="bento-modal-title" className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  Tech Stack
                </h3>
                <p className="text-sm text-neutral-300 font-sans leading-relaxed">
                  Tools I have used in real work. The full list, by area, is in the Tech Stack section.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {[
                  { name: 'Next.js', role: 'Full-stack React / SSR' },
                  { name: 'TypeScript', role: 'Typed frontend & backend' },
                  { name: 'Golang', role: 'Backend services' },
                  { name: 'AI Agent / LangGraph', role: 'LLM agent workflows' },
                  { name: 'Node.js', role: 'APIs & services' },
                  { name: 'GraphQL', role: 'API layer' },
                  { name: 'PostgreSQL', role: 'Relational Database' },
                  { name: 'Docker', role: 'Containers' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-zinc-900/30 border border-zinc-800 flex flex-col gap-1">
                    <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                      <Sparkles size={11} className="text-red-400" />
                      {item.name}
                    </span>
                    <span className="text-[10px] text-zinc-400">{item.role}</span>
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
                  <span>See the full tech stack</span>
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
              Close
            </button>
          </div>
        </div>
      </m.div>
    </div>
    </Portal>
  );
};

export default BentoMorphModal;
