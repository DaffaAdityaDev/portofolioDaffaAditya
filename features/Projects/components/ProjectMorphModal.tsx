import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { m } from 'framer-motion';
import { X, ExternalLink, Activity, CheckCircle2, Award, ArrowUpRight } from 'lucide-react';
import { Project, CASE_STUDIES_META, PROJECT_VIDEOS } from '../constants';
import { SPRING_MOBILE_OS, BACKDROP_VARIANTS } from '@/constant/animations';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import Portal from '@/components/ui/Portal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface ProjectMorphModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectMorphModal: React.FC<ProjectMorphModalProps> = ({ project, onClose }) => {
  useModalDismiss(!!project, onClose);
  const reducedMotion = usePrefersReducedMotion();

  if (!project) return null;

  const meta = CASE_STUDIES_META[project.slug];
  const video = PROJECT_VIDEOS[project.slug];

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
        {/* Backdrop with modern OS blur */}
        <m.div
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md -z-10"
          aria-hidden="true"
        />

        {/* Fluid Morphing Container (Shared layoutId with triggering row) */}
        <m.div
          layoutId={`project-card-${project.id}`}
          transition={SPRING_MOBILE_OS}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0c0e]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-neutral-100 focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-title-${project.id}`}
          tabIndex={-1}
        >
          {/* Smooth Inner Content Transition (prevents content distortion during outer container morph) */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 overflow-hidden w-full"
          >
            {/* iOS style Sheet drag indicator for mobile */}
            <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing sm:hidden">
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
            </div>

            {/* Modal App Bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#121216]/60 backdrop-blur-md shrink-0">
          <span className="text-[0.65rem] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            // {project.type} &bull; {project.client} &bull; {project.year}
          </span>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-mono"
            aria-label="Close project modal"
          >
            <span className="hidden sm:inline text-[10px] text-neutral-400 px-1 font-mono">ESC</span>
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Visual Showcase / Image Preview */}
          {project.image && (
            <div className="relative w-full aspect-16/9 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/60 shadow-inner">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80 pointer-events-none" />
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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(16,185,129,0.15)]">
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
            <div className="space-y-3 pt-2 border-t border-white/5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <Award size={13} className="text-emerald-400" />
                WHAT I DID:
              </span>

              <div className="space-y-2">
                {project.achievements.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/70 font-mono text-xs text-neutral-300 leading-relaxed"
                  >
                    <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack Specs */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
              TECH STACK:
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-mono font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md uppercase tracking-wider hover:bg-emerald-500/20 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-white/5">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="merge"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-extrabold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all active:scale-95 shadow-lg shadow-white/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Visit Site</span>
                <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

            {project.link && (
              <Link
                href={project.link}
                data-cursor="merge"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 text-white font-mono text-xs uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                Case study <ArrowUpRight size={13} />
              </Link>
            )}

            <button
              onClick={onClose}
              data-cursor="merge"
              className="ml-auto px-4 py-2.5 text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </m.div>
    </m.div>
  </div>
  </Portal>
  );
};

export default ProjectMorphModal;
