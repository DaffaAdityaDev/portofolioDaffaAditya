import React from 'react';
import { Globe, Zap, Cpu, Clock, CheckCircle2, ArrowRight, ShieldCheck, Mail, Sparkles } from 'lucide-react';
import MorphModalShell from '@/components/ui/MorphModalShell';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { siteConfig } from '@/config/metadata.config';
import { EXPERIENCE_LABEL, formatExperience } from '@/utils/experience';
import { useExperience } from '@/hooks/useExperience';

export type BentoModalType = 'location' | 'status' | 'tech';

interface BentoMorphModalProps {
  type: BentoModalType;
  onClose: () => void;
}

const BentoMorphModal: React.FC<BentoMorphModalProps> = ({ type, onClose }) => {
  // Read when the modal opens, so it is current even if the page has been open since yesterday.
  const experienceString = formatExperience(useExperience());

  return (
    <MorphModalShell
      onClose={onClose}
      layoutId={`bento-cell-${type}`}
      labelledBy="bento-modal-title"
      closeLabel="Close modal"
      className="max-w-xl"
      header={
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-muted-foreground">
          {type === 'location' && (
            <>
              <Globe size={15} className="text-accent-brand-hover" />
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
      }
    >
      {/* CONTENT FOR TYPE === LOCATION */}
      {type === 'location' && (
        <>
          <div className="space-y-2">
            <h3 id="bento-modal-title" className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Jakarta, Indonesia
            </h3>
            <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
              <Clock size={14} className="text-accent-brand-hover" />
              TIMEZONE: GMT+7 (WIB) &bull; OPEN TO REMOTE WORK
            </p>
          </div>

          <div className="p-4 rounded-lg bg-surface-1 border border-border space-y-1">
            <span className="text-2xs font-mono text-muted-foreground uppercase tracking-widest block">
              {EXPERIENCE_LABEL}
            </span>
            <div className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight">
              {experienceString}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-2xs font-mono text-muted-foreground uppercase tracking-widest block">
              WORKING STYLE:
            </span>
            <div className="space-y-2 font-mono text-xs text-neutral-300">
              <div className="p-3 rounded-lg bg-surface-1 border border-border flex items-center gap-3">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Based in Jakarta (GMT+7); comfortable working with remote teams across time zones.</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-1 border border-border flex items-center gap-3">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Works in English and Indonesian, in writing and on calls.</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-1 border border-border flex items-center gap-3">
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
            <StatusBadge label="Open to new roles & freelance" />
            <h3 id="bento-modal-title" className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Open to Work & Freelance
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="p-4 rounded-lg bg-surface-1 border border-border space-y-1">
              <span className="text-muted-foreground text-2xs uppercase">ENGAGEMENT</span>
              <div className="text-white font-bold text-sm">Full-time / Freelance</div>
            </div>
            <div className="p-4 rounded-lg bg-surface-1 border border-border space-y-1">
              <span className="text-muted-foreground text-2xs uppercase">LOCATION</span>
              <div className="text-white font-bold text-sm">Jakarta / Remote</div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-2xs font-mono text-muted-foreground uppercase tracking-widest block">
              SERVICES & DOMAINS:
            </span>
            <div className="space-y-2 font-mono text-xs text-neutral-300">
              <div className="p-3 rounded-lg bg-surface-1 border border-border flex items-center gap-3">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                <span>Web apps with React, Next.js and TypeScript.</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-1 border border-border flex items-center gap-3">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                <span>Third-party integrations, such as payments, for business systems.</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-1 border border-border flex items-center gap-3">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                <span>Backend APIs and AI agent workflows.</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button href={`mailto:${siteConfig.links.email}`} size="sm" className="w-full">
              <Mail size={15} />
              <span>Email me</span>
            </Button>
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
              <div key={idx} className="p-3 rounded-lg bg-surface-1 border border-border flex flex-col gap-1">
                <span className="font-bold text-white uppercase text-xs flex items-center gap-1.5">
                  <Sparkles size={11} className="text-accent-brand-hover" />
                  {item.name}
                </span>
                <span className="text-2xs text-muted-foreground">{item.role}</span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => {
                onClose();
                setTimeout(() => {
                  const el = document.getElementById('tech-stack') || document.getElementById('tech-stack-layout-group');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 120);
              }}
            >
              <span>See the full tech stack</span>
              <ArrowRight size={14} />
            </Button>
          </div>
        </>
      )}

      {/* Footer Close */}
      <div className="pt-2 flex justify-end border-t border-border">
        <Button onClick={onClose} variant="ghost" size="sm">
          Close
        </Button>
      </div>
    </MorphModalShell>
  );
};

export default BentoMorphModal;
