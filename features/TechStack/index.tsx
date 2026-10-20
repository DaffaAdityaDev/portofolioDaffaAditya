import React, { useState } from 'react';
import { diagnosticStack, Module } from './constants';
import dynamic from 'next/dynamic';
import DiagnosticCard from './components/DiagnosticCard';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import Section from '@/components/ui/Section';
import SectionHeader from '@/components/ui/SectionHeader';

const DiagnosticMorphModal = dynamic(() => import('./components/DiagnosticMorphModal'), { ssr: false });

const TechStack = () => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  return (
    <LayoutGroup id="tech-stack-layout-group">
      <Section id="tech-stack" labelledBy="tech-stack-title" className="mb-12 md:mb-32" containerClassName="z-20">
        {/* Scroll reveals are CSS (globals.css .reveal): visible by default, so the static HTML never hides.
            The grid reveals as one block: the cards carry the modal layoutIds, so they stay untouched. */}
        <div className="reveal">
          <SectionHeader
            index="04"
            label="TECH STACK"
            title="Tech Stack & Specs"
            id="tech-stack-title"
            description={<span className="uppercase tracking-widest">Core Capabilities</span>}
            // Desktop-only aside: hide the whole description <p> on mobile so it adds no gap.
            className="mb-6 md:mb-16 max-md:[&>p]:hidden"
          />
        </div>

        <div className="reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {diagnosticStack.map((module) => (
            <DiagnosticCard
              key={module.id}
              module={module}
              onSelect={setSelectedModule}
            />
          ))}
        </div>
      </Section>

      {/* Shared Element Morph Modal */}
      <AnimatePresence>
        {selectedModule && (
          <DiagnosticMorphModal
            module={selectedModule}
            onClose={() => setSelectedModule(null)}
          />
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
};

export default TechStack;
export { TechStack };

