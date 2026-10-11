import React from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SpotlightButton from '@/components/ui/SpotlightButton';
import { coverStyle } from '@/features/Projects/components/CaseStudyArt/coverStyle';
import { AVAILABILITY, BOOKING_URL, ENGAGEMENT_SPEC, HERO_COPY, PROOF_METRICS } from '../constants/content';
import StatusBadge from './StatusBadge';

// The same generative pixel field as the home hero, so the page reads as part of the site.
const DotMatrixArt = dynamic(() => import('@/components/ui/DotMatrixArt'), { ssr: false });
const HERO_ART = coverStyle({ slug: 'freelance', color: { accent: 'red' } });

export const FreelanceHero: React.FC = () => {
  return (
    <>
      <section aria-label="Freelance services" className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <DotMatrixArt
            seed="freelance"
            renderer="pixel"
            ramp={HERO_ART.ramp}
            signal={HERO_ART.signal}
            composition="hero"
            motion="idle"
          />
          {/* Same vignettes as the home hero, a little stronger on the left for a longer headline */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/85 via-[#0a0a0a]/25 to-transparent max-lg:bg-[#0a0a0a]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,#0a0a0a_96%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-20 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-7 lg:col-span-7">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-red-400">{HERO_COPY.kicker}</p>

              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-[5.25rem] font-black uppercase leading-[0.92] tracking-tighter [word-spacing:0.12em] text-white [text-wrap:balance]">
                {HERO_COPY.headline}
              </h1>

              <p className="max-w-xl text-base md:text-lg leading-relaxed text-neutral-300">{HERO_COPY.subtext}</p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <SpotlightButton as="a" href="#start" variant="primary">
                  START A PROJECT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </SpotlightButton>
                {BOOKING_URL ? (
                  <SpotlightButton as="a" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" variant="secondary">
                    BOOK A CALL <ArrowUpRight size={16} />
                  </SpotlightButton>
                ) : (
                  <SpotlightButton as="a" href="#work-section" variant="secondary">
                    SEE THE WORK
                  </SpotlightButton>
                )}
              </div>
            </div>

            {/* Terms of working together, in the case-study spec-sheet format, floating over the art like the home bento */}
            <aside aria-label="How an engagement works" className="lg:col-span-5 lg:pl-6">
              <div className="border border-neutral-800 bg-[#0a0a0a]">
                <div className="flex items-center justify-between gap-4 border-b border-neutral-800 px-5 py-3">
                  <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">Engagement spec</span>
                  <StatusBadge label={AVAILABILITY} />
                </div>
                <dl className="grid grid-cols-2">
                  {ENGAGEMENT_SPEC.map((row, i) => (
                    <div
                      key={row.label}
                      className={`border-neutral-800 px-5 py-4 ${i % 2 === 0 ? 'border-r' : ''} ${i < ENGAGEMENT_SPEC.length - 2 ? 'border-b' : ''}`}
                    >
                      <dt className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">{row.label}</dt>
                      <dd className="mt-1.5 text-sm font-medium leading-snug text-white">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Proof strip: two results from freelance clients, each detailed in Selected work below */}
      <section aria-label="Results from client projects" className="border-t border-neutral-800 px-4 sm:px-6 lg:px-20">
        <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2">
          {PROOF_METRICS.map((item, i) => (
            <div key={item.metric} className={`py-8 sm:py-10 ${i > 0 ? 'border-t border-neutral-800 sm:border-t-0 sm:border-l sm:pl-10' : ''}`}>
              <dt className="sr-only">{item.label}</dt>
              <dd className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <span className="text-5xl md:text-6xl font-black tracking-tighter text-white">{item.metric}</span>
                <span>
                  <span className="block text-sm text-neutral-300">{item.label}</span>
                  <span className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-neutral-500">{item.client}</span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
};

export default FreelanceHero;
