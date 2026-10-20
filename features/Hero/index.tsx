import React, { useRef } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import GridLine from '@/components/ui/GridLine';
import BentoGrid from './components/BentoGrid';
import SpotlightButton from '@/components/ui/SpotlightButton';
import PageTitle from '@/components/ui/PageTitle';
import { coverStyle } from '@/features/Projects/components/CaseStudyArt/coverStyle';
import { siteConfig } from '@/config/metadata.config';
import intro from './HeroIntro.module.css';

// Same generative pixel field as the case-study heroes: drifts on its own, never follows the cursor.
// Canvas only, so it stays off the server render and out of the first chunk.
const DotMatrixArt = dynamic(() => import('@/components/ui/DotMatrixArt'), { ssr: false });
const HERO_ART = coverStyle({ slug: 'home', color: { accent: 'red' } });

const Hero = () => {
  const router = useRouter();
  const leftSectionRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Intro layer over the first viewport: backdrop while the headline glides in, plus the system indicator.
          Plain CSS (HeroIntro.module.css), so it plays without waiting for JS and is skipped under reduced motion. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[100dvh] z-30 pointer-events-none">
        <div className={`absolute inset-0 bg-background ${intro.backdrop}`} />
        <div
          className={`absolute bottom-12 inset-x-0 flex items-center justify-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-widest select-none ${intro.indicator}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent-brand animate-pulse" />
          <span>INITIALIZING SYSTEM</span>
        </div>
      </div>

      <section
        id="hero"
        className="relative pt-20 flex flex-col lg:flex-row min-h-[100dvh] overflow-hidden"
      >
        {/* Generative pixel field behind the whole hero, the same art as the case-study heroes */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <DotMatrixArt
            seed="daffa-aditya"
            imageFit="trace"
            renderer="pixel"
            ramp={HERO_ART.ramp}
            signal={HERO_ART.signal}
            composition="hero"
            motion="idle"
          />
          {/* Subtle perimeter vignettes ensuring crisp headline readability and smooth border blending */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-background/55 via-transparent to-background/35" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--background)_96%)]" />
        </div>

        {/* Left Section: Content */}
        <div
          ref={leftSectionRef}
          className="w-full lg:w-1/2 p-6 md:p-12 lg:p-16 relative flex items-center overflow-hidden z-10"
        >

          <GridLine className="top-12 opacity-30 pointer-events-none z-10" />
          <GridLine className="bottom-12 opacity-30 pointer-events-none z-10" />
          <GridLine vertical className="left-6 md:left-12 opacity-30 pointer-events-none z-10" />

          <div className="flex flex-col justify-center py-8 lg:py-0 w-full relative z-20">
            <div className="space-y-6">
              {/* Header Badges: Software Engineer */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Software Engineer Badge */}
                <div
                  className={`inline-flex items-center gap-2 border border-accent-brand/20 bg-accent-brand/10 px-3 py-1 rounded-lg ${intro.badge}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-brand animate-pulse" />
                  <span className="text-accent-brand-hover text-xs font-semibold font-mono tracking-widest uppercase">Software Engineer</span>
                </div>
              </div>

              {/* Headline: the LCP text, static from the first paint. */}
              <PageTitle size="xl" className="sm:text-6xl tracking-tighter relative z-40">
                Daffa <br />
                Aditya <br />
              </PageTitle>

              {/* Subtitle Bio Paragraph */}
              <p
                className={`max-w-xl text-neutral-300 text-base md:text-lg leading-relaxed font-sans ${intro.bio}`}
              >
                Engineering industrial-grade systems and high-performance web architectures built for speed, resilience, and scale.
              </p>
            </div>

            {/* Action Buttons: directly under the subtitle */}
            <div
              className={`flex flex-wrap items-center gap-3 sm:gap-4 mt-8 ${intro.actions}`}
            >
              <SpotlightButton
                variant="primary"
                onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                VIEW PROJECTS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </SpotlightButton>
              <SpotlightButton
                variant="secondary"
                onClick={() => router.push('/resume')}
              >
                RESUME
              </SpotlightButton>
              <a
                href={`mailto:${siteConfig.links.email}`}
                className="inline-flex items-center gap-2 h-13 px-3 text-sm font-medium text-neutral-300 hover:text-white underline-offset-4 hover:underline transition-colors whitespace-nowrap"
              >
                <Mail size={16} aria-hidden="true" />
                Email me
              </a>
            </div>
          </div>
        </div>

        {/* Right Section: Bento Grid */}
        <div
          className={`w-full lg:w-1/2 p-6 lg:p-12 xl:p-16 relative flex items-center justify-center z-10 ${intro.bento}`}
        >
          <div className="w-full max-w-lg z-10">
            <BentoGrid />
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
