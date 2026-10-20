import React from 'react';
import { PROCESS_STEPS } from '../constants/content';
import Section from '@/components/ui/Section';
import SectionHeader from '@/components/ui/SectionHeader';

const Process: React.FC = () => {
  return (
    <Section id="process-section" labelledBy="process-heading">
      <SectionHeader
        id="process-heading"
        index="03"
        label="Process"
        title="How We Work Together"
        description="From first call to launch in four steps."
      />

      <ol className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step, i) => (
          <li key={step.title} className="flex flex-col bg-background p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-4xl font-black tracking-tighter text-neutral-700">0{i + 1}</span>
              <span className="font-mono text-2xs uppercase tracking-widest text-neutral-500">{step.duration}</span>
            </div>
            <h3 className="mt-8 text-xl font-bold tracking-[-0.02em] text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
};

export default Process;
