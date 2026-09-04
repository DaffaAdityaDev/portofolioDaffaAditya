import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, ExternalLink, Activity } from 'lucide-react';
import { Project, CASE_STUDIES_META, DEFAULT_META } from '../constants';
import { SPRING_MOBILE_OS, BACKDROP_VARIANTS } from '@/constant/animations';
import { useModalDismiss } from '@/hooks/useModalDismiss';
import Portal from '@/components/ui/Portal';

interface ProjectMorphModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectMorphModal: React.FC<ProjectMorphModalProps> = ({ project, onClose }) => {
  useModalDismiss(!!project, onClose);

  if (!project) return null;

  const meta = CASE_STUDIES_META[project.slug] || DEFAULT_META;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
        {/* Backdrop with modern OS blur */}
        <motion.div
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md -z-10"
          aria-hidden="true"
        />

        {/* Fluid Morphing Container (Shared layoutId with triggering row) */}
        <motion.div
          layoutId={`project-card-${project.id}`}
          transition={SPRING_MOBILE_OS}
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c0c0e]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-neutral-100 focus:outline-none"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-title-${project.id}`}
          tabIndex={-1}
        >
          {/* Smooth Inner Content Transition (prevents content distortion during outer container morph) */}
          <motion.div
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
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent opacity-80" />
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

              {/* Audited Metric Pill */}
              {meta?.metric && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono font-bold tracking-wider uppercase">
                  <Activity size={14} className="animate-pulse" />
                  <span>{meta.metric}</span>
                </div>
              )}
            </div>

            <p className="text-sm md:text-base text-neutral-300 font-sans leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack Specs */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
              SYSTEM ARCHITECTURE & TECH SPEC:
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-extrabold font-mono text-xs uppercase tracking-wider hover:bg-neutral-200 transition-transform active:scale-95 shadow-lg shadow-white/10"
              >
                <span>Launch Live System</span>
                <ExternalLink size={14} />
              </a>
            )}

            <button
              onClick={onClose}
              className="ml-auto px-4 py-2.5 text-xs font-mono text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  </div>
  </Portal>
  );
};

export default ProjectMorphModal;
