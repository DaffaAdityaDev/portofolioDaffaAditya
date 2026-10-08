import React from 'react';
import { m } from 'framer-motion';
import { Mail, MapPin, Briefcase, Github, Linkedin } from 'lucide-react';
import { FADE_IN_UP_ITEM } from '@/constant/animations';
import { siteConfig } from '@/config/metadata.config';
import {
  IDENTIFICATION,
  CORE_COMPETENCIES,
  TECHNICAL_SKILLS,
  EXTENDED_STACK,
} from '../constants';

const HEADING = 'text-xs font-mono text-neutral-500 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold';
const ROW = 'flex items-center gap-4 text-neutral-300';
const LINK = 'text-sm md:text-base font-medium underline underline-offset-4 decoration-neutral-700 hover:text-white hover:decoration-neutral-400 transition-colors break-all';

const ResumeSidebar = () => {
  return (
    <m.aside variants={FADE_IN_UP_ITEM} className="lg:col-span-4 xl:col-span-3 space-y-12" aria-label="Contact and skills">
      {/* Contact */}
      <section className="space-y-6">
        <h2 className={HEADING}>Contact</h2>
        <ul className="space-y-5">
          <li className={ROW}>
            <Briefcase size={18} className="text-neutral-600 shrink-0" aria-hidden="true" />
            <span className="text-sm md:text-base font-medium">{IDENTIFICATION.role}</span>
          </li>
          <li className={ROW}>
            <MapPin size={18} className="text-neutral-600 shrink-0" aria-hidden="true" />
            <span className="text-sm md:text-base font-medium">{IDENTIFICATION.location}</span>
          </li>
          <li className={ROW}>
            <Mail size={18} className="text-neutral-600 shrink-0" aria-hidden="true" />
            <a href={`mailto:${IDENTIFICATION.email}`} className={LINK}>
              {IDENTIFICATION.email}
            </a>
          </li>
          <li className={ROW}>
            <Linkedin size={18} className="text-neutral-600 shrink-0" aria-hidden="true" />
            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
              LinkedIn
            </a>
          </li>
          <li className={ROW}>
            <Github size={18} className="text-neutral-600 shrink-0" aria-hidden="true" />
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className={LINK}>
              GitHub
            </a>
          </li>
        </ul>
      </section>

      {/* Core Competencies */}
      <section className="space-y-6">
        <h2 className={HEADING}>Core Competencies</h2>
        <ul className="space-y-4">
          {CORE_COMPETENCIES.map(comp => (
            <li key={comp} className="flex items-center gap-3 text-neutral-300">
              <div className="w-1.5 h-1.5 bg-red-500 shrink-0" aria-hidden="true"></div>
              <span className="text-sm md:text-base font-medium">{comp}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Technical Skills */}
      <section className="space-y-6">
        <h2 className={HEADING}>Technical Skills</h2>
        <ul className="flex flex-wrap gap-2">
          {TECHNICAL_SKILLS.map(skill => (
            <li key={skill} className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-[11px] md:text-xs font-mono text-neutral-400 uppercase tracking-tight hover:border-neutral-600 transition-colors">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {/* Extended Stack */}
      <section className="space-y-6">
        <h2 className={HEADING}>Extended Stack</h2>
        <dl className="space-y-5">
          {EXTENDED_STACK.map(item => (
            <div key={item.category} className="space-y-2">
              <dt className="text-[10px] md:text-xs font-mono text-neutral-400 uppercase tracking-widest font-medium">
                {item.category}
              </dt>
              <dd className="text-sm text-neutral-400 font-medium leading-relaxed">{item.tech}</dd>
            </div>
          ))}
        </dl>
      </section>
    </m.aside>
  );
};

export default ResumeSidebar;
