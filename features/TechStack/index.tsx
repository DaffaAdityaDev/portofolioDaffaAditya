import React, { useState } from 'react';
import { diagnosticStack, Module } from './constants';
import dynamic from 'next/dynamic';
import DiagnosticCard from './components/DiagnosticCard';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

const DiagnosticMorphModal = dynamic(() => import('./components/DiagnosticMorphModal'), { ssr: false });
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/constant/animations';

const TechStack = () => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  return (
    <LayoutGroup id="tech-stack-layout-group">
      <motion.section 
        id="tech-stack"
        variants={FADE_IN_UP_CONTAINER}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative py-10 md:py-20 px-4 sm:px-6 lg:px-20 border-t border-neutral-800 scroll-mt-20 mb-12 md:mb-32"
      >
        <div className="relative z-20 max-w-7xl mx-auto w-full">
          <motion.div variants={FADE_IN_UP_ITEM} className="flex justify-between items-end mb-6 md:mb-16 border-b border-zinc-800 pb-3 md:pb-4 gap-4">
            <div>
              <div className="text-xs font-mono text-zinc-500 mb-1 tracking-widest uppercase">
                [ 04 // TECH STACK ]
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                Tech Stack & Specs
              </h2>
            </div>
            <span className="hidden md:block text-zinc-500 font-mono text-xs uppercase tracking-widest">Core Capabilities</span>
          </motion.div>

          <motion.div variants={FADE_IN_UP_ITEM} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagnosticStack.map((module) => (
              <DiagnosticCard
                key={module.id}
                module={module}
                onSelect={setSelectedModule}
              />
            ))}
          </motion.div>
        </div>
      </motion.section>

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

