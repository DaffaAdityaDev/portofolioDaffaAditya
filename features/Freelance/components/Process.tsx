import React from 'react';
import { PROCESS_STEPS } from '../constants/content';
import { Section, SectionHeader } from './SectionHeader';

export const Process: React.FC = () => {
  return (
    <Section id="process-section" labelledBy="process-heading">
      <SectionHeader
        id="process-heading"
        index="03"
        label="Process"
        title="How We Work Together"
        description="From first call to launch in four steps."
      />

      <ol className="grid grid-cols-1 gap-px overflow-hidden border border-neutral-800 bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col bg-[#0a0a0a] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-black tracking-tighter text-neutral-700">0{i + 1}</span>
              <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">{step.duration}</span>
            </div>
            <h3 className="mt-8 text-xl font-bold tracking-[-0.02em] text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default Process;
