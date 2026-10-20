import React from 'react';
import { Mail, MapPin, Briefcase, Github, Linkedin } from 'lucide-react';
import { siteConfig } from '@/config/metadata.config';
import {
  IDENTIFICATION,
  CORE_COMPETENCIES,
  SKILL_GROUPS,
} from '../constants';
import ResumeHeading from './ResumeHeading';

const ROW = 'flex items-center gap-4 text-neutral-300';
const LINK = 'text-sm md:text-base font-medium underline underline-offset-4 decoration-neutral-700 hover:text-white hover:decoration-neutral-400 transition-colors break-all';

const ResumeSidebar = () => {
  // Grid placement lives on the lazyOnView wrapper in pages/resume.tsx. CSS scroll reveal
  // (globals.css .reveal): visible by default, so the static HTML never hides.
  return (
    <aside className="reveal space-y-12" aria-label="Contact and skills">
      {/* Contact */}
      <section className="space-y-6">
        <ResumeHeading>Contact</ResumeHeading>
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
        <ResumeHeading>Core Competencies</ResumeHeading>
        <ul className="space-y-4">
          {CORE_COMPETENCIES.map(comp => (
            <li key={comp} className="flex items-center gap-3 text-neutral-300">
              <div className="w-1.5 h-1.5 bg-accent-brand shrink-0" aria-hidden="true"></div>
              <span className="text-sm md:text-base font-medium">{comp}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills: same groups as the PDF (cv-src/cv/skills.tex) */}
      <section className="space-y-6">
        <ResumeHeading>Skills</ResumeHeading>
        <dl className="space-y-5">
          {SKILL_GROUPS.map(group => (
            <div key={group.category} className="space-y-2">
              <dt className="text-2xs md:text-xs font-mono text-muted-foreground uppercase tracking-widest font-medium">
                {group.category}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {group.skills.map(skill => (
                    <li key={skill} className="px-2.5 py-1 rounded-lg bg-surface-1 border border-border text-2xs md:text-xs font-mono text-muted-foreground hover:border-border-strong transition-colors">
                      {skill}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </aside>
  );
};

export default ResumeSidebar;
