import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Briefcase } from 'lucide-react';
import { FADE_IN_UP_ITEM } from '@/constant/animations';
import {
  IDENTIFICATION,
  CORE_COMPETENCIES,
  TECHNICAL_SKILLS,
  EXTENDED_STACK,
} from '../constants';

const ResumeSidebar = () => {
  return (
    <motion.div variants={FADE_IN_UP_ITEM} className="lg:col-span-4 xl:col-span-3 space-y-12 order-2 lg:order-1">
      {/* Identification */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold">Identification</h3>
        <div className="space-y-5">
          <div className="flex items-center gap-4 text-neutral-300">
            <Briefcase size={18} className="text-neutral-600 shrink-0" />
            <span className="text-sm md:text-base font-medium">{IDENTIFICATION.role}</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <MapPin size={18} className="text-neutral-600 shrink-0" />
            <span className="text-sm md:text-base font-medium">{IDENTIFICATION.location}</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <Mail size={18} className="text-neutral-600 shrink-0" />
            <span className="text-sm md:text-base font-medium underline underline-offset-4 decoration-neutral-700">
              {IDENTIFICATION.email}
            </span>
          </div>
        </div>
      </div>

      {/* Core Competencies */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold">Core Competencies</h3>
        <div className="space-y-4">
          {CORE_COMPETENCIES.map(comp => (
            <div key={comp} className="flex items-center gap-3 text-neutral-300">
              <div className="w-1.5 h-1.5 bg-red-500"></div>
              <span className="text-sm md:text-base font-medium">{comp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Skills */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold">Technical Skills</h3>
        <div className="flex flex-wrap gap-2">
          {TECHNICAL_SKILLS.map(skill => (
            <span key={skill} className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-[11px] md:text-xs font-mono text-neutral-400 uppercase tracking-tight hover:border-neutral-600 transition-colors">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Extended Stack */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono text-neutral-600 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold">Extended Stack</h3>
        <div className="space-y-5">
          {EXTENDED_STACK.map(item => (
            <div key={item.category} className="space-y-2">
              <span className="text-[10px] md:text-xs font-mono text-neutral-500 uppercase tracking-widest font-medium">
                {item.category}
              </span>
              <p className="text-sm text-neutral-400 font-medium leading-relaxed">{item.tech}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Note */}
      <div className="p-6 bg-neutral-900/50 border border-neutral-800 border-dashed rounded-lg">
        <p className="text-xs font-mono text-neutral-500 leading-relaxed uppercase tracking-tight">
          // Note: Document integrity verified. For physical copy, use the 'Capture Copy' button above.
        </p>
      </div>
    </motion.div>
  );
};

export default ResumeSidebar;
