import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SpotlightButton from '@/components/ui/SpotlightButton';
import { coverStyle } from '@/features/Projects/components/CaseStudyArt/coverStyle';
import { ABOUT_ME_DATA, AVAILABILITY, CAL_LINK, ENGAGEMENT_SPEC, HERO_COPY, PROOF_POINTS, REPLY_WINDOW } from '../constants/content';
import LocalTimeLink from './LocalTimeLink';
import StatusBadge from './StatusBadge';
import { useFreelanceStore } from '@/store/useFreelanceStore';

// The same generative pixel field as the home hero, so the page reads as part of the site.
const DotMatrixArt = dynamic(() => import('@/components/ui/DotMatrixArt'), { ssr: false });
const HERO_ART = coverStyle({ slug: 'freelance', color: { accent: 'red' } });

export const FreelanceHero: React.FC = () => {
  const setStartMode = useFreelanceStore((s) => s.setStartMode);
  return (
    <>
      <section id="freelance-hero" aria-label="Freelance services" className="relative overflow-hidden">
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

        <div className="relative z-10 px-4 sm:px-6 lg:px-20 pt-8 pb-20 md:pt-12 md:pb-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-7 lg:col-span-7">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-red-400">{HERO_COPY.kicker}</p>

              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-[5.25rem] font-black uppercase leading-[0.92] tracking-tighter [word-spacing:0.12em] text-white [text-wrap:balance]">
                {HERO_COPY.headline}
              </h1>

              <p className="max-w-xl text-base md:text-lg leading-relaxed text-neutral-300">{HERO_COPY.subtext}</p>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1">
                <SpotlightButton as="a" href="#start" onClick={() => setStartMode('brief')} variant="primary">
                  START A PROJECT <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </SpotlightButton>
                {CAL_LINK ? (
                  <SpotlightButton as="a" href="#start" onClick={() => setStartMode('call')} variant="secondary">
                    BOOK A CALL <ArrowRight size={16} />
                  </SpotlightButton>
                ) : (
                  <SpotlightButton as="a" href="#work-section" variant="secondary">
                    SEE THE WORK
                  </SpotlightButton>
                )}
              </div>

              {/* Who the visitor would hire, visible before they scroll */}
              <a href="#about-section" className="group flex max-w-md items-center gap-3 border-t border-neutral-800 pt-6">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900">
                  <Image src={ABOUT_ME_DATA.image} alt="" fill sizes="44px" className="object-cover" loading="eager" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white transition-colors group-hover:text-red-400">{ABOUT_ME_DATA.name}</span>
                  <span className="block text-xs leading-snug text-neutral-400">
                    {ABOUT_ME_DATA.credential} · Replies {REPLY_WINDOW.toLowerCase()}
                  </span>
                </span>
              </a>
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
                      {row.timeLink && <LocalTimeLink className="mt-1.5" />}
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Proof strip: how I work and two freelance results, each result detailed in Selected work below */}
      <section aria-label="Why work with me" className="px-4 sm:px-6 lg:px-20 py-10">
        <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-px border border-neutral-800 bg-neutral-800 sm:grid-cols-2 lg:grid-cols-4">
          {PROOF_POINTS.map((item, i) => (
            <li key={item.kicker} className="flex flex-col bg-[#0a0a0a] p-6 md:p-7">
              <span className="font-mono text-[11px] uppercase tracking-widest text-red-400">
                0{i + 1} // {item.kicker}
              </span>
              {item.result && <span className="mt-4 text-5xl font-black tracking-tighter text-white">{item.result.metric}</span>}
              <p className="mt-4 font-bold leading-snug tracking-[-0.02em] text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.body}</p>
              {item.result && (
                <span className="mt-auto pt-4 font-mono text-[11px] uppercase tracking-widest text-neutral-500">{item.result.client}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default FreelanceHero;
