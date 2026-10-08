import React, { useSyncExternalStore } from 'react';
import Head from 'next/head';
import Seo from '@/components/Seo';
import dynamic from 'next/dynamic';
import { lazyOnView } from '@/components/LazyOnView';
import FreelanceHero from '@/features/Freelance/components/FreelanceHero';

const TimelineCursorPreview = dynamic(() => import('@/features/Freelance/components/TimelineCursorPreview'), { ssr: false });
// Below the fold: HTML stays in the static page, JS loads when the section nears the viewport.
const ProjectsTimeline = lazyOnView(() => import('@/features/Freelance/components/ProjectsTimeline'));
const SkillsGrid = lazyOnView(() => import('@/features/Freelance/components/SkillsGrid'));
const FaqSection = lazyOnView(() => import('@/features/Freelance/components/FaqSection'));
const CostCalculator = lazyOnView(() => import('@/features/Freelance/components/CostCalculator'));

const HOVER_QUERY = '(hover: hover)';
const subscribeHover = (onChange: () => void) => {
  const mql = window.matchMedia(HOVER_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};
const getHoverSnapshot = () => window.matchMedia(HOVER_QUERY).matches;
const getHoverServerSnapshot = () => false;

/** True only on devices with a real hover pointer; false during SSR and on touch devices. */
const useCanHover = () => useSyncExternalStore(subscribeHover, getHoverSnapshot, getHoverServerSnapshot);

const FREELANCE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Daffa Aditya | Freelance Software Engineer",
  "image": "https://daffaaditya.id/image/profile-768.webp",
  "url": "https://daffaaditya.id/freelance",
  "email": "daffaaditya.me@gmail.com",
  "description": "Freelance software engineer in Jakarta, Indonesia. I build fast Next.js websites and admin/finance systems for small businesses and schools.",
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
  "knowsAbout": [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "Go",
    "PostgreSQL",
    "Web Performance"
  ],
  "sameAs": [
    "https://github.com/DaffaAdityaDev",
    "https://www.linkedin.com/in/daffaadityarahman-14b588192/"
  ]
};


export default function FreelancePage() {
  const canHover = useCanHover();

  return (
    <>
      <Seo
        path="/freelance"
        title="Freelance Web Developer | Daffa Aditya"
        description="Daffa Aditya, a freelance software engineer in Jakarta, Indonesia. I build fast Next.js websites and admin/finance systems for small businesses and schools."
        jsonLd={FREELANCE_STRUCTURED_DATA}
      />
      {/* Tags <Seo> does not cover */}
      <Head>
        <meta name="keywords" content="Freelance Software Engineer, Freelance Web Developer, Next.js Developer, React Developer, Jakarta Developer, Freelance Next.js Developer Indonesia, Hire Web Developer Jakarta" />
        <meta name="author" content="Daffa Aditya" />
      </Head>

      {/* Cursor preview follows the mouse over timeline rows; touch devices never load it */}
      {canHover && <TimelineCursorPreview />}

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

          {/* SECTION 2: FREELANCE PROJECTS */}
          <ProjectsTimeline />

          {/* SECTION 3: SKILLS GRID */}
          <SkillsGrid />

          {/* SECTION 4: FAQ ACCORDION */}
          <FaqSection />

          {/* SECTION 5: COST ESTIMATE & BRIEF */}
          <CostCalculator />

        </main>
      </div>
    </>
  );
}

