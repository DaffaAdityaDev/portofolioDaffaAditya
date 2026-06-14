import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import {
  FreelanceHero,
  useFreelance,
} from '@/features/Freelance';

const TimelineCursorPreview = dynamic(() => import('@/features/Freelance/components/TimelineCursorPreview'), { ssr: false });
const ProjectsTimeline = dynamic(() => import('@/features/Freelance/components/ProjectsTimeline'), { ssr: true });
const SkillsGrid = dynamic(() => import('@/features/Freelance/components/SkillsGrid'), { ssr: true });
const CostCalculator = dynamic(() => import('@/features/Freelance/components/CostCalculator'), { ssr: true });
const TrustSection = dynamic(() => import('@/features/Freelance/components/TrustSection'), { ssr: true });
const FaqSection = dynamic(() => import('@/features/Freelance/components/FaqSection'), { ssr: true });


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
          <TrustSection />

          {/* SECTION 6: FAQ ACCORDION */}
          <FaqSection />

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

