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
                  className={`mt-1 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-45 text-red-400' : ''}`}
                />
              </button>
              <p
                id={`faq-answer-${i}`}
                hidden={!isOpen}
                className="-mt-2 max-w-3xl pb-6 pr-8 text-base leading-relaxed text-neutral-400 sm:pl-[3.75rem]"
              >
                {faq.a}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default FaqSection;
