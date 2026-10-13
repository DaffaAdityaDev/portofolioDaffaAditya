import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FAQS } from '../constants/content';
import { Section, SectionHeader } from './SectionHeader';

export const FaqSection: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="faq-section" labelledBy="faq-heading">
      <SectionHeader id="faq-heading" index="05" label="FAQ" title="Before We Start" description="The questions clients usually ask on the first call." />

      <ul className="divide-y divide-neutral-800 border-y border-neutral-800">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <li key={faq.q}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group grid w-full cursor-pointer grid-cols-[1fr_auto] items-start gap-3 py-6 text-left sm:grid-cols-[3rem_1fr_auto]"
              >
                <span className="hidden pt-1 font-mono text-xs text-neutral-600 sm:block">0{i + 1}</span>
                <span className="text-lg md:text-xl font-semibold tracking-[-0.02em] text-white transition-colors group-hover:text-red-400">
                  {faq.q}
                </span>
                <Plus
                  size={18}
                  aria-hidden
                  className={`mt-1 shrink-0 text-neutral-500 transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'rotate-45 text-red-400' : ''}`}
                />
              </button>
              {/* Animates height by moving the row from 0fr to 1fr, so the answer needs no measured height */}
              <div
                id={`faq-answer-${i}`}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p
                    className={`max-w-3xl pb-6 pr-8 text-base leading-relaxed text-neutral-400 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:pl-[3.75rem] ${
                      isOpen ? 'translate-y-0' : '-translate-y-2'
                    }`}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default FaqSection;
