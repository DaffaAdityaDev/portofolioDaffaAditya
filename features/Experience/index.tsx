import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { m, AnimatePresence, LayoutGroup } from 'framer-motion';
import { experienceData, ExperienceItem } from './constants';
import dynamic from 'next/dynamic';
import Section from '@/components/ui/Section';
import SectionHeader from '@/components/ui/SectionHeader';
import StatusBadge from '@/components/ui/StatusBadge';

// Only needed once a row is opened, so its code loads on demand.
const loadExperienceMorphModal = () => import('./components/ExperienceMorphModal');
const ExperienceMorphModal = dynamic(loadExperienceMorphModal, { ssr: false });

const Experience = () => {
  const [selectedItem, setSelectedItem] = useState<{ item: ExperienceItem; index: number } | null>(null);

  return (
    <LayoutGroup id="experience-group">
      <Section id="experience-section" labelledBy="experience-title" containerClassName="z-20">
        {/* Scroll reveals are CSS (globals.css .reveal): visible by default, so the static HTML never hides. */}
        <div className="reveal">
          <SectionHeader
            id="experience-title"
            index="02"
            label="CAREER"
            title="Experience"
            description="Where I have worked, newest first. Open a row for details, or read the case study."
          />
        </div>

        {/* Experience Table Rows */}
        <div className="divide-y divide-border border-b border-border">
          {experienceData.map((exp, idx) => {
            const isCurrent = exp.year.toLowerCase().includes('now');

            return (
              // The reveal sits on a wrapper so its animation never touches the morphing row's styles.
              <div key={idx} className="reveal">
                <m.div
                  layoutId={`exp-card-${idx}`}
                  // Warm the modal chunk before the click so the first open still morphs straight away.
                  onPointerEnter={() => void loadExperienceMorphModal()}
                  onFocus={() => void loadExperienceMorphModal()}
                  onClick={() => setSelectedItem({ item: exp, index: idx })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedItem({ item: exp, index: idx });
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${exp.role} at ${exp.company}`}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between py-6 px-4 md:px-6 -mx-4 md:-mx-6 rounded-lg hover:bg-neutral-900/40 active:bg-neutral-900/60 transition-colors duration-300 cursor-pointer"
                >
                  {/* Left Column: Timeline & System Status Badge */}
                  <div className="flex items-center gap-3 w-full md:w-56 shrink-0 mb-3 md:mb-0">
                    {isCurrent ? (
                      <StatusBadge label="Present" className="font-bold" />
                    ) : (
                      <span className="text-xs font-mono text-muted-foreground font-medium tracking-wide">
                        {exp.year}
                      </span>
                    )}
                  </div>

                  {/* Center Column: Role, Company & Summary */}
                  <div className="flex-1 md:pr-8">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight group-hover:text-accent-brand group-hover:translate-x-1 transition-all duration-200">
                        {exp.role}
                      </h3>
                      <span className="text-sm font-mono text-muted-foreground">
                        @{exp.company}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed mt-2 line-clamp-2 group-hover:text-neutral-300 transition-colors">
                      {exp.description}
                    </p>

                    {exp.caseStudy && (
                      <Link
                        href={exp.caseStudy}
                        // The row opens the detail modal; the link goes to the page instead.
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 mt-2 text-xs font-mono text-muted-foreground hover:text-accent-brand-hover underline-offset-4 hover:underline transition-colors"
                      >
                        Case study <ArrowUpRight size={12} aria-hidden="true" />
                      </Link>
                    )}
                  </div>

                  {/* Right Column: Action Cue */}
                  <div className="flex items-center gap-3 mt-4 md:mt-0 shrink-0 self-end md:self-center">
                    <span className="text-xs font-mono text-neutral-500 group-hover:text-neutral-300 transition-colors hidden sm:inline">
                      View Details
                    </span>
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-border group-hover:border-neutral-600 group-hover:bg-neutral-800 flex items-center justify-center transition-all duration-200 shadow-sm">
                      <ArrowUpRight 
                        size={14} 
                        className="text-muted-foreground group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" 
                      />
                    </div>
                  </div>
                </m.div>
              </div>
            );
          })}
        </div>

        {/* Modal Morph Detail */}
        <AnimatePresence>
          {selectedItem && (
            <ExperienceMorphModal
              item={selectedItem.item}
              index={selectedItem.index}
              onClose={() => setSelectedItem(null)}
            />
          )}
        </AnimatePresence>
      </Section>
    </LayoutGroup>
  );
};

export default Experience;
