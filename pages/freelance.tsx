import React from 'react';
import Head from 'next/head';
import { ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  FreelanceHero,
  useFreelance,
  FAQS,
  TESTIMONIALS,
} from '@/features/Freelance';

const TimelineCursorPreview = dynamic(() => import('@/features/Freelance/components/TimelineCursorPreview'), { ssr: false });
const ProjectsTimeline = dynamic(() => import('@/features/Freelance/components/ProjectsTimeline'), { ssr: true });
const SkillsGrid = dynamic(() => import('@/features/Freelance/components/SkillsGrid'), { ssr: true });
const CostCalculator = dynamic(() => import('@/features/Freelance/components/CostCalculator'), { ssr: true });


export default function FreelancePage() {
  const {
    showAllProjects,
    setShowAllProjects,
    hoveredNode,
    setHoveredNode,
    calculatorInputs,
    setCalculatorInputs,
    formSubmitted,
    formData,
    setFormData,
    activeFaq,
    setActiveFaq,
    estimatedQuote,
    handlePackageChange,
    handleAddonToggle,
    handleFormSubmit,
  } = useFreelance();

  return (
    <>
      <Head>
        <title>Freelance Full-Stack Developer & UI/UX Designer | Daffa Aditya Rahman</title>
        <meta 
          name="description" 
          content="Hire Daffa Aditya Rahman, a freelance Full-Stack Software Engineer and UI/UX Designer specialized in building high-performance Next.js websites, custom APIs, and autonomous AI workflows." 
        />
        <meta name="keywords" content="Freelance Software Engineer, Full-Stack Developer, UI/UX Designer, Next.js Developer, React Developer, Node.js API, Go API, Custom AI Integration, Jakarta Developer, Freelance Next.js Developer Indonesia, Hire Web Developer Jakarta, Freelance Software Engineer Indonesia, Custom AI Workflow Integration, UI UX Designer Jakarta" />
        <meta name="author" content="Daffa Aditya Rahman" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://daffaaditya.id/freelance" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daffaaditya.id/freelance" />
        <meta property="og:title" content="Freelance Full-Stack Developer & UI/UX Designer | Daffa Aditya Rahman" />
        <meta property="og:description" content="Build high-performance web systems and AI applications with clean architecture and perfect Lighthouse scores. Check out case studies and get an instant cost estimate." />
        <meta property="og:image" content="/image/Profile.jpg" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://daffaaditya.id/freelance" />
        <meta property="twitter:title" content="Freelance Full-Stack Developer & UI/UX Designer | Daffa Aditya Rahman" />
        <meta property="twitter:description" content="Build high-performance web systems and AI applications with clean architecture and perfect Lighthouse scores. Check out case studies and get an instant cost estimate." />
        <meta property="twitter:image" content="/image/Profile.jpg" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Daffa Aditya Rahman | Freelance Full-Stack Developer & UI/UX Designer",
              "image": "https://daffaaditya.id/image/Profile.jpg",
              "url": "https://daffaaditya.id/freelance",
              "email": "daffaaditya.me@gmail.com",
              "description": "Professional freelance software engineer and UI/UX designer specializing in high-performance Next.js web applications, custom API backend systems, and autonomous AI agent integrations.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Jakarta",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-6.2088",
                "longitude": "106.8456"
              },
              "priceRange": "$$$",
              "knowsAbout": [
                "Full-Stack Web Development",
                "UI/UX Design",
                "Next.js & React",
                "Node.js & Go API Development",
                "AI Agents & LangGraph Integration",
                "PostgreSQL & MongoDB Database Design",
                "Performance Optimization & Core Web Vitals"
              ],
              "sameAs": [
                "https://github.com/DaffaAdityaDev",
                "https://www.linkedin.com/in/daffaadityarahman-14b588192/"
              ]
            })
          }}
        />
      </Head>

      <TimelineCursorPreview hoveredNode={hoveredNode} />

      {/* Edge-to-edge layout wrapper spanning full screen width up to 4K */}
      <div className="min-h-screen bg-[#070709] text-white pt-16 relative flex flex-col selection:bg-red-600 selection:text-white w-full overflow-x-hidden">
        
        {/* Subtle background grids */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]" 
             style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Dynamic glows */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-950/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-zinc-900/20 rounded-full blur-[180px] pointer-events-none" />

        <main className="flex-1 w-full flex flex-col relative z-10">
          
          {/* SECTION 1: HERO SECTION */}
          <FreelanceHero />

          {/* SECTION 2: PROJECTS PIPELINE TIMELINE */}
          <ProjectsTimeline 
            showAllProjects={showAllProjects}
            setShowAllProjects={setShowAllProjects}
            setHoveredNode={setHoveredNode}
          />

          {/* SECTION 3: SKILLS GRID */}
          <SkillsGrid />

          {/* SECTION 5: DE-RISKING & TRUST BUILDERS */}
          <section aria-label="Trust & Testimonials" className="w-full grid grid-cols-1 lg:grid-cols-2 gap-[1px] bg-zinc-800 border-b border-zinc-800">
            
            {/* The "Clean Handoff" Guarantee Cell */}
            <div className="bg-[#0f0f13] p-8 md:p-12 xl:p-16 space-y-6 border-b lg:border-b-0 border-zinc-800 lg:border-r border-zinc-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4 mb-6">
                  <ShieldCheck size={18} className="text-red-500" />
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">The Clean Handoff Guarantee</span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-snug mb-4">
                  Write code once. Maintain it forever.
                </h3>
                
                <p className="text-sm font-mono text-zinc-400 leading-relaxed mb-6">
                  Freelance clients are terrified of hiring engineers who deliver unmaintainable black boxes. 
                  I design all custom logic with robust JSDoc declarations, standard TypeScript configurations, 
                  and modular directory boundaries.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-sm text-zinc-300">
                  <div className="p-3 border border-zinc-800 rounded bg-zinc-900/30 flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Comprehensive README, env setups & deploy docs</span>
                  </div>
                  <div className="p-3 border border-zinc-800 rounded bg-zinc-900/30 flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-red-500 shrink-0 mt-0.5" />
                    <span>Modular state management with zero tight-coupling</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-zinc-800 pt-6 mt-6 font-mono text-xs text-zinc-400 uppercase flex justify-between">
                <span>Maintainability Index: 100/100</span>
                <span>Type Coverage: Strict-True</span>
              </div>
            </div>

            {/* Testimonials / Technical Commendations Cell */}
            <div className="bg-[#0f0f13] p-8 md:p-12 xl:p-16 space-y-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4 mb-6">
                  <UserCheck size={18} className="text-red-500" />
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">Technical Commendations</span>
                </div>
                
                <div className="space-y-6">
                  {TESTIMONIALS.map((t, idx) => (
                    <div key={idx} className="border-l-2 border-red-500 pl-4 space-y-2">
                      <p className="text-sm md:text-base font-mono text-zinc-300 italic leading-relaxed">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <span className="text-xs font-mono text-zinc-400 uppercase block font-bold">
                        // {t.author}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </section>

          {/* SECTION 6: FAQ ACCORDION */}
          <section className="w-full bg-[#0b0b0e] px-6 sm:px-12 md:px-16 lg:px-24 py-16 md:py-24 border-b border-zinc-800">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12 border-b border-zinc-800 pb-6 text-center sm:text-left">
                <span className="text-xs font-mono text-red-500 uppercase tracking-widest font-bold">// SYSTEM_RISK_ASSESSMENT</span>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mt-2">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border border-zinc-800 bg-zinc-900/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-zinc-700">
                    <button
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full flex justify-between items-center text-left p-6 font-mono font-bold uppercase text-white hover:text-red-500 transition-colors gap-4"
                    >
                      <span className="text-sm md:text-base">{faq.q}</span>
                      <span className="text-red-500 font-bold shrink-0">{activeFaq === idx ? '[-]' : '[+]'}</span>
                    </button>
                    {activeFaq === idx && (
                      <div className="px-6 pb-6 text-sm font-mono text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-4 bg-zinc-900/10">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: INTERACTIVE SCOPE CONFIGURATOR */}
          <CostCalculator 
            calculatorInputs={calculatorInputs}
            estimatedQuote={estimatedQuote}
            formData={formData}
            formSubmitted={formSubmitted}
            setCalculatorInputs={setCalculatorInputs}
            setFormData={setFormData}
            handlePackageChange={handlePackageChange}
            handleAddonToggle={handleAddonToggle}
            handleFormSubmit={handleFormSubmit}
          />

        </main>
      </div>
    </>
  );
}

