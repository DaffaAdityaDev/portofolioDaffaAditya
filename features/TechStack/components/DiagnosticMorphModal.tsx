import React from 'react';
import { Sparkles, Code2 } from 'lucide-react';
import { Module, TECH_USAGE_LABELS, TechUsage } from '../constants';
import MorphModalShell from '@/components/ui/MorphModalShell';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

const USAGE_ORDER: TechUsage[] = ['project', 'familiar'];

interface DiagnosticMorphModalProps {
  module: Module | null;
  onClose: () => void;
}

export const DiagnosticMorphModal: React.FC<DiagnosticMorphModalProps> = ({ module, onClose }) => {
  if (!module) return null;

  return (
    <MorphModalShell
      onClose={onClose}
      layoutId={`diagnostic-module-${module.id}`}
      labelledBy={`diag-title-${module.id}`}
      closeLabel="Close tech stack details"
      header={
        <div className="flex items-center gap-3">
          <div className="text-accent-brand-hover p-2 rounded-lg bg-accent-brand/10 border border-accent-brand/20">
            {module.icon}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3
                id={`diag-title-${module.id}`}
                className="font-mono text-base font-black text-white tracking-widest uppercase"
              >
                {module.name}
              </h3>
              <StatusBadge label={module.status} />
            </div>
            <div className="font-mono text-2xs text-muted-foreground uppercase">{module.headline}</div>
          </div>
        </div>
      }
    >
      {/* Overview & Philosophy */}
      <div className="space-y-2">
        <span className="text-2xs font-mono text-accent-brand-hover font-bold uppercase tracking-widest flex items-center gap-1.5">
          <Code2 size={12} />
          SCOPE
        </span>
        <p className="text-sm text-neutral-300 font-sans leading-relaxed">
          {module.description}
        </p>
      </div>

      {/* Summary pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-surface-1 border border-border rounded-lg">
        {module.pillars.map((pillar, idx) => (
          <div key={idx} className="flex flex-col gap-1 border-b sm:border-b-0 sm:border-r last:border-none border-border pb-2 sm:pb-0 sm:pr-3">
            <span className="text-2xs font-mono text-muted-foreground uppercase tracking-wider">
              {pillar.label}
            </span>
            <span className="text-xs font-mono font-bold text-white leading-snug">
              {pillar.value}
            </span>
          </div>
        ))}
      </div>

      {/* Tools, grouped: used in my projects, then also worked with */}
      {USAGE_ORDER.map((usage) => {
        const items = module.processes.filter((proc) => proc.usage === usage);
        if (items.length === 0) return null;
        return (
          <div key={usage} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={12} className="text-accent-brand-hover" />
                {TECH_USAGE_LABELS[usage]}
              </span>
              <span className="text-2xs font-mono text-muted-foreground">{items.length}</span>
            </div>

            <div className="space-y-2.5">
              {items.map((proc) => (
                <div
                  key={proc.name}
                  className="p-3.5 rounded-lg bg-surface-1 border border-border hover:border-border-strong transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-bold text-white font-mono tracking-tight">
                      {proc.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg text-2xs font-mono font-bold bg-neutral-800 text-neutral-300 border border-border-strong">
                      {proc.roleLabel}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    {proc.role}
                  </p>

                  {proc.patterns.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proc.patterns.map((tag) => (
                        <span
                          key={tag}
                          className="text-2xs font-mono px-2 py-0.5 rounded-lg bg-neutral-800/60 text-muted-foreground border border-border-strong/40"
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
        );
      })}

      {/* Footer Close */}
      <div className="pt-4 flex justify-end border-t border-border">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </MorphModalShell>
  );
};

export default DiagnosticMorphModal;
