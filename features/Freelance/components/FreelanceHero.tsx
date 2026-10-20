import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SpotlightButton from '@/components/ui/SpotlightButton';
import { coverStyle } from '@/features/Projects/components/CaseStudyArt/coverStyle';
import { ABOUT_ME_DATA, AVAILABILITY, CAL_LINK, ENGAGEMENT_SPEC, HERO_COPY, PROOF_POINTS, REPLY_WINDOW } from '../constants/content';
import LocalTimeLink from './LocalTimeLink';
import StatusBadge from '@/components/ui/StatusBadge';
import Container from '@/components/ui/Container';
import Eyebrow from '@/components/ui/Eyebrow';
import { useFreelanceStore } from '../store';

// The same generative pixel field as the home hero, so the page reads as part of the site.
const DotMatrixArt = dynamic(() => import('@/components/ui/DotMatrixArt'), { ssr: false });
const HERO_ART = coverStyle({ slug: 'freelance', color: { accent: 'red' } });

const FreelanceHero: React.FC = () => {
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
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/25 to-transparent max-lg:bg-background/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--background)_96%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <Container className="relative z-10 pt-8 pb-20 md:pt-12 md:pb-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-7 lg:col-span-7">
              <Eyebrow as="p" tone="accent">
                {HERO_COPY.kicker}
              </Eyebrow>

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
              <a href="#about-section" className="group flex max-w-md items-center gap-3 border-t border-border pt-6">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-border-strong bg-neutral-900">
                  <Image src={ABOUT_ME_DATA.image} alt="" fill sizes="44px" className="object-cover" loading="eager" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white transition-colors group-hover:text-accent-brand-hover">{ABOUT_ME_DATA.name}</span>
                  <span className="block text-xs leading-snug text-muted-foreground">
                    {ABOUT_ME_DATA.credential} · Replies {REPLY_WINDOW.toLowerCase()}
                  </span>
                </span>
              </a>
            </div>

            {/* Terms of working together, in the case-study spec-sheet format, floating over the art like the home bento */}
            <aside aria-label="How an engagement works" className="lg:col-span-5 lg:pl-6">
              <div className="rounded-lg border border-border bg-background">
                <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
                  <Eyebrow as="span">Engagement spec</Eyebrow>
                  <StatusBadge label={AVAILABILITY} />
                </div>
                <dl className="grid grid-cols-2">
                  {ENGAGEMENT_SPEC.map((row, i) => (
                    <div
                      key={row.label}
                      className={`border-border px-5 py-4 ${i % 2 === 0 ? 'border-r' : ''} ${i < ENGAGEMENT_SPEC.length - 2 ? 'border-b' : ''}`}
                    >
                      <dt className="font-mono text-2xs uppercase tracking-widest text-neutral-500">{row.label}</dt>
                      <dd className="mt-1.5 text-sm font-medium leading-snug text-white">{row.value}</dd>
                      {row.timeLink && <LocalTimeLink className="mt-1.5" />}
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Proof strip: how I work and two freelance results, each result detailed in Selected work below */}
      <Container as="section" aria-label="Why work with me" className="py-10">
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PROOF_POINTS.map((item, i) => (
            <li key={item.kicker} className="flex flex-col bg-background p-6 md:p-7">
              <span className="font-mono text-2xs uppercase tracking-widest text-accent-brand">
                0{i + 1} {'//'} {item.kicker}
              </span>
              {item.result && <span className="mt-4 text-5xl font-black tracking-tighter text-white">{item.result.metric}</span>}
              <p className="mt-4 font-bold leading-snug tracking-[-0.02em] text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              {item.result && (
                <span className="mt-auto pt-4 font-mono text-2xs uppercase tracking-widest text-neutral-500">{item.result.client}</span>
              )}
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};

export default FreelanceHero;
