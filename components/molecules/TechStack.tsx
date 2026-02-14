import React from 'react';
import { diagnosticStack } from '@/data/DiagnosticStack';
import DiagnosticCard from '@/components/molecules/DiagnosticCard';

const TechStack = () => {
  return (
    <section className="mx-auto px-6 mb-32 border-t border-neutral-800 pt-20">
      <div className="flex justify-between items-end mb-16">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
          <span className="w-8 h-[2px] bg-white"></span>
          Specs & Stack
        </h2>
        <span className="hidden md:block text-zinc-600 font-mono text-xs">SYSTEM_CAPABILITIES v2.4</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {diagnosticStack.map((module) => (
          <DiagnosticCard key={module.id} module={module} />
        ))}
      </div>
    </section>
  );
};

export default TechStack;
