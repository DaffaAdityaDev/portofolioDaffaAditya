import React from 'react';
import Image from 'next/image';
import { Calendar, Building2, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';
import { ExperienceItem } from '../constants';
import MorphModalShell from '@/components/ui/MorphModalShell';
import Button from '@/components/ui/Button';
import { chipClasses } from '@/components/ui/chip';

interface ExperienceMorphModalProps {
  item: ExperienceItem | null;
  index: number | null;
  onClose: () => void;
}

const ExperienceMorphModal: React.FC<ExperienceMorphModalProps> = ({ item, index, onClose }) => {
  if (!item || index === null) return null;

  return (
    <MorphModalShell
      onClose={onClose}
      layoutId={`exp-card-${index}`}
      labelledBy={`exp-role-${index}`}
      closeLabel="Close experience detail"
      className="max-w-2xl"
      header={
        <div className={chipClasses({ tone: 'success', className: 'gap-2' })}>
          <Calendar size={13} />
          <span>{item.year}</span>
        </div>
      }
    >
      {/* Featured Workplace Photo Banner */}
      {item.image && (
        <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-lg overflow-hidden border border-border bg-surface-1 shrink-0 shadow-lg">
          <Image
            src={item.image}
            alt={`${item.company} workplace`}
            fill
            sizes="(min-width: 768px) 608px, calc(100vw - 82px)"
            className="object-cover object-center transition-transform duration-500 hover:scale-105"
          />
          {/* Subtle dark vignette overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-2 via-transparent to-black/20 pointer-events-none" />

          {/* Company Tag Overlay */}
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-border-strong text-2xs font-mono text-neutral-200 flex items-center gap-2">
            <Building2 size={13} className="text-muted-foreground" />
            <span className="font-semibold">{item.company}</span>
          </div>
        </div>
      )}

      {/* Role Header */}
      <div className="space-y-1.5">
        <h3
          id={`exp-role-${index}`}
          className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight"
        >
          {item.role}
        </h3>

        <div className="flex items-center gap-2 text-muted-foreground font-mono text-xs sm:text-sm">
          <span>@{item.company}</span>
        </div>
      </div>

      {/* Role Summary & Scope */}
      <div className="p-4 sm:p-5 rounded-lg bg-surface-1 border border-border space-y-2">
        <span className="text-2xs font-mono text-muted-foreground uppercase tracking-widest block font-bold">
          ROLE SUMMARY:
        </span>
        <p className="text-xs sm:text-sm text-neutral-200 font-sans leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Tailored Key Milestones */}
      <div className="space-y-3">
        <span className="text-2xs font-mono text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 font-bold">
          <Award size={13} className="text-emerald-400" />
          WHAT I DID:
        </span>

        <div className="space-y-2">
          {item.milestones?.map((milestone, mIdx) => (
            <div
              key={mIdx}
              className="flex items-start gap-3 p-3 rounded-lg bg-surface-1 border border-border font-mono text-xs text-neutral-300 leading-relaxed"
            >
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{milestone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Footer */}
      <div className="pt-4 flex items-center justify-between border-t border-border">
        {item.caseStudy ? (
          <Button href={item.caseStudy} onClick={onClose} size="sm">
            Read the case study <ArrowUpRight size={14} aria-hidden="true" />
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={onClose} variant="ghost" size="sm">
          Close
        </Button>
      </div>
    </MorphModalShell>
  );
};

export default ExperienceMorphModal;
