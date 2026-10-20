import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useFreelanceStore } from '../store';
import Container from '@/components/ui/Container';
import { monoLinkClass } from './styles';

/** One-line prompt after Selected work, for visitors who recognise their own project in it. */
const WorkCtaStrip: React.FC = () => {
  const setStartMode = useFreelanceStore((s) => s.setStartMode);
  return (
    <aside aria-label="Start a similar project" className="border-t border-border">
      <Container className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base text-neutral-300">
          <span className="font-bold text-white">Have a similar project?</span> Send a brief and get a fixed-price proposal.
        </p>
        <a href="#start" onClick={() => setStartMode('brief')} className={`group shrink-0 ${monoLinkClass} text-white hover:text-accent-brand-hover`}>
          Start a project <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </a>
      </Container>
    </aside>
  );
};

export default WorkCtaStrip;
