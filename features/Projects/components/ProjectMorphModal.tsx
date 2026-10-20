import React from 'react';
import Image from 'next/image';
import { ExternalLink, Activity, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';
import { Project, CASE_STUDIES_META, PROJECT_VIDEOS } from '../constants';
import MorphModalShell from '@/components/ui/MorphModalShell';
import Button from '@/components/ui/Button';
import { chipClasses } from '@/components/ui/chip';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface ProjectMorphModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectMorphModal: React.FC<ProjectMorphModalProps> = ({ project, onClose }) => {
  const reducedMotion = usePrefersReducedMotion();

  if (!project) return null;

  const meta = CASE_STUDIES_META[project.slug];
  const video = PROJECT_VIDEOS[project.slug];

  return (
    <MorphModalShell
      onClose={onClose}
      layoutId={`project-card-${project.id}`}
      labelledBy={`project-title-${project.id}`}
      closeLabel="Close project modal"
      className="max-w-3xl"
      header={
        <span className="text-[0.65rem] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          {'//'} {project.type} &bull; {project.client} &bull; {project.year}
        </span>
      }
    >
      {/* Visual Showcase / Image Preview */}
      {project.image && (
        <div className="relative w-full aspect-16/9 rounded-lg overflow-hidden border border-border bg-neutral-900/60 shadow-inner">
          {video ? (
            // Muted and inline so browsers allow autoplay; reduced motion gets controls instead.
            <video
              className="absolute inset-0 w-full h-full object-cover object-top"
              poster={project.image}
              autoPlay={!reducedMotion}
              controls={reducedMotion}
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={project.title}
            >
              <source src={video.webm} type="video/webm" />
              <source src={video.mp4} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-2 via-transparent to-transparent opacity-80 pointer-events-none" />
        </div>
      )}

      {/* Title and High-Level Scope */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2
            id={`project-title-${project.id}`}
            className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight"
          >
            {project.title.replace(/_/g, ' ')}
          </h2>

          {/* Metric pill (none when the project has no meta) */}
          {meta?.metric && (
            <div className={chipClasses({ tone: 'success', className: 'gap-2 py-1.5 shadow-[0_0_12px_rgba(16,185,129,0.15)]' })}>
              <Activity size={14} className="animate-pulse text-emerald-400" />
              <span>{meta.metric}</span>
            </div>
          )}
        </div>

        <p className="text-sm md:text-base text-neutral-300 font-sans leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* What I did */}
      {project.achievements && project.achievements.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-border">
          <span className="text-2xs font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Award size={13} className="text-emerald-400" />
            WHAT I DID:
          </span>

          <div className="space-y-2">
            {project.achievements.map((milestone, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-neutral-900/30 border border-border/70 font-mono text-xs text-neutral-300 leading-relaxed"
              >
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{milestone}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack Specs */}
      <div className="space-y-2 pt-2 border-t border-border">
        <span className="text-2xs font-mono text-neutral-400 uppercase tracking-widest block">
          TECH STACK:
        </span>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech, idx) => (
            <span
              key={idx}
              className={chipClasses({ tone: 'success', className: 'font-semibold hover:bg-emerald-500/20 transition-colors' })}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Action CTAs */}
      <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-border">
        {project.liveLink && (
          <Button
            href={project.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="merge"
            size="sm"
            className="group font-extrabold shadow-lg shadow-white/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Visit Site</span>
            <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        )}

        {project.link && (
          <Button href={project.link} data-cursor="merge" variant="secondary" size="sm">
            Case study <ArrowUpRight size={13} />
          </Button>
        )}

        <button
          type="button"
          onClick={onClose}
          data-cursor="merge"
          className="ml-auto px-4 py-2.5 text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </MorphModalShell>
  );
};

export default ProjectMorphModal;
