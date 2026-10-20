import React from 'react';
import { experienceData } from '@/features/Experience/constants';
import { SUMMARY } from '../constants';
import ResumeHeading from './ResumeHeading';


const ResumeExperience = () => {
  return (
    <div className="space-y-14">
      <section className="space-y-6" aria-labelledby="resume-summary">
        <ResumeHeading id="resume-summary">Summary</ResumeHeading>
        <p className="text-base md:text-lg text-neutral-300 leading-relaxed max-w-3xl">{SUMMARY}</p>
      </section>

      <section className="space-y-8" aria-labelledby="resume-experience">
        <ResumeHeading id="resume-experience">Experience</ResumeHeading>
        <ol className="relative border-l border-border ml-1 space-y-12">
          {experienceData.map((item) => (
            <li key={`${item.company}-${item.year}`} className="relative pl-8">
              <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-accent-brand" aria-hidden="true" />
              <p className="text-2xs md:text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                {item.year}
              </p>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">
                {item.role}
              </h3>
              <p className="text-sm md:text-base font-medium text-muted-foreground mt-1">{item.company}</p>
              {item.description && (
                <p className="text-sm md:text-base text-neutral-300 leading-relaxed mt-4 max-w-3xl">
                  {item.description}
                </p>
              )}
              {item.milestones?.length > 0 && (
                <ul className="mt-4 space-y-2 max-w-3xl">
                  {item.milestones.map((milestone) => (
                    <li key={milestone} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-2 w-1 h-1 bg-neutral-600 shrink-0" aria-hidden="true" />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default ResumeExperience;
