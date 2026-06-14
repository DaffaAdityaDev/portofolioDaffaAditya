import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import {
  projectsData,
  CASE_STUDIES_META,
  DEFAULT_META,
  ACCENT_SPOTLIGHT_COLORS
} from '@/features/Projects/constants';
import GridLine from '@/components/ui/GridLine';
import dynamic from 'next/dynamic';

const CaseStudyRow = dynamic(() => import('@/features/Projects/components/CaseStudyRow'), { ssr: true });

// Injecting CSS Animations for SVG Drawing hoisted outside render context
const ARROW_STYLES = `
  .arrow-line {
    stroke-dasharray: 12;
    stroke-dashoffset: 12;
    transition: stroke-dashoffset 0.3s ease-out, opacity 0.3s ease-in-out;
    opacity: 0;
  }
  .group:hover .arrow-line {
    stroke-dashoffset: 0;
    opacity: 1;
  }
  .arrow-head {
    transform: translateX(-4px);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .group:hover .arrow-head {
    transform: translateX(0px);
  }
`;

export default function CaseStudiesIndex() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Dynamic color spectrum backdrop transitions
  const getAmbientSpotlightColor = () => {
    if (!hoveredSlug) return 'rgba(239, 68, 68, 0.02)'; // Soft red default
    const meta = CASE_STUDIES_META[hoveredSlug];
    if (!meta) return 'rgba(239, 68, 68, 0.02)';
    return ACCENT_SPOTLIGHT_COLORS[meta.color.accent] || 'rgba(239, 68, 68, 0.02)';
  };

  const handleMouseEnter = useCallback((slug: string) => {
    setHoveredSlug(slug);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredSlug(null);
  }, []);

  return (
    <>
      <Head>
        <title>Technical Case Studies | Daffa Aditya Rahman</title>
        <meta name="description" content="Immersive systems engineering case studies exploring BLE thread offloading, style encapsulation, and low-latency vector synchronization." />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: ARROW_STYLES }} />

      <div className="bg-[#060608] text-zinc-100 min-h-screen relative overflow-hidden font-sans select-none pb-32 pt-20 selection:bg-red-500/30 selection:text-red-400">

        {/* Dynamic Spectrum Ambient Spotlight */}
        <div
          id="ambient-spotlight"
          className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[65vw] h-[65vw] rounded-full blur-[200px] pointer-events-none transition-all duration-1000 ease-in-out z-0 opacity-40"
          style={{ backgroundColor: getAmbientSpotlightColor() }}
        />

        {/* Dotted Grid Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#555 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* Main Context Grid Wrapper */}
        <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12">

          {/* Header Block with fluid typography scaling */}
          <header className="mb-24 text-left relative max-w-4xl pb-12 border-b border-zinc-900/60">
            <GridLine className="bottom-0 opacity-40" />

            <div className="inline-block border border-red-900/50 bg-red-900/10 px-3 py-1 mb-8">
              <span className="text-red-500 text-xs font-bold font-mono tracking-widest uppercase">// ARCHIVE_PREVIEW</span>
            </div>

            <h1
              className="font-display font-black tracking-tighter uppercase text-white leading-[0.88]"
              style={{ fontSize: 'clamp(2.5rem, 7.5vw + 1rem, 5.5rem)' }}
            >
              Technical <br />
              Case Studies
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-mono mt-8 max-w-2xl text-left">
              // Deep-dive analysis of systems architecture, BLE thread isolation,
              high-availability multi-tenant nodes, and WebGL drawing optimizations.
            </p>
          </header>

          {/* Table Breakdown Row Listing */}
          <section className="space-y-8 relative z-10">
            <div className="flex justify-between items-end mb-8 border-b border-zinc-900/60 pb-4">
              <div className="text-left">
                <h2 className="text-sm font-mono text-zinc-500 mb-2">/// INDEX_LIST_03</h2>
                <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">System Breakdown Index</h1>
              </div>
            </div>

            <div className="flex flex-col border-t border-zinc-900/60 overflow-hidden">
              {(showAll ? projectsData : projectsData.slice(0, 3)).map((proj) => {
                const meta = CASE_STUDIES_META[proj.slug] || DEFAULT_META;

                return (
                  <CaseStudyRow
                    key={proj.id}
                    proj={proj}
                    colorMap={meta.color}
                    metricVal={meta.metric}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </div>

            {projectsData.length > 3 && (
              <div className="flex justify-center pt-12">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="group relative px-6 py-3 border border-zinc-800 hover:border-red-500/50 bg-zinc-900/20 text-xs font-mono tracking-widest text-zinc-400 hover:text-white uppercase transition-all duration-300 rounded cursor-pointer"
                >
                  <span className="relative z-10">{showAll ? '/// COLLAPSE_INDEX' : '/// SHOW_ALL_STUDIES'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
