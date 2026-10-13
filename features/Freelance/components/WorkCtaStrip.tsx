import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useFreelanceStore } from '@/store/useFreelanceStore';
import { monoLinkClass } from './styles';

/** One-line prompt after Selected work, for visitors who recognise their own project in it. */
export const WorkCtaStrip: React.FC = () => {
  const setStartMode = useFreelanceStore((s) => s.setStartMode);
  return (
    <aside aria-label="Start a similar project" className="border-t border-neutral-800 px-4 sm:px-6 lg:px-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base text-neutral-300">
          <span className="font-bold text-white">Have a similar project?</span> Send a brief and get a fixed-price proposal.
        </p>
        <a href="#start" onClick={() => setStartMode('brief')} className={`group shrink-0 ${monoLinkClass} text-white hover:text-red-400`}>
          Start a project <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </aside>
  );
};

export default WorkCtaStrip;
