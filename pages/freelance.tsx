import React from 'react';
import dynamic from 'next/dynamic';
import Seo from '@/components/Seo';
// Below the fold: static HTML, JS loaded as the page nears the bottom.
import Footer from '@/components/Layout/LazyFooter';
import { SAME_AS, siteConfig } from '@/config/metadata.config';
import { lazyOnView } from '@/components/LazyOnView';
import FreelanceHero from '@/features/Freelance/components/FreelanceHero';

// Below-the-fold sections loaded on viewport approach via lazyOnView.
// The placeholder heights roughly match each section, so after a client-side navigation the
// hero's #work-section, #about-section and #start jumps land near their final position.
const SelectedWork = lazyOnView(() => import('@/features/Freelance/components/SelectedWork'), {
  placeholderClassName: 'empty:min-h-[2000px] lg:empty:min-h-[1400px]',
});
const Services = lazyOnView(() => import('@/features/Freelance/components/Services'), {
  placeholderClassName: 'empty:min-h-[2000px] md:empty:min-h-[1200px]',
});
const Process = lazyOnView(() => import('@/features/Freelance/components/Process'), {
  placeholderClassName: 'empty:min-h-[1100px] sm:empty:min-h-[750px] lg:empty:min-h-[550px]',
});
const AboutFreelancer = lazyOnView(() => import('@/features/Freelance/components/AboutFreelancer'), {
  placeholderClassName: 'empty:min-h-[1000px] lg:empty:min-h-[750px]',
});
const FaqSection = lazyOnView(() => import('@/features/Freelance/components/FaqSection'), {
  placeholderClassName: 'empty:min-h-[800px]',
});
const StartProject = lazyOnView(() => import('@/features/Freelance/components/StartProject'));

// Mobile-only bar that appears after the hero; never part of the first screen, so client-only
const StickyStartBar = dynamic(() => import('@/features/Freelance/components/StickyStartBar'), { ssr: false });

const FREELANCE_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: `${siteConfig.name} | Freelance Software Engineer`,
  image: `${siteConfig.url}${siteConfig.profileImage}`,
  url: `${siteConfig.url}/freelance`,
  email: siteConfig.links.email,
  description:
    'Freelance web developer in Jakarta working worldwide. Next.js websites, admin and finance systems, and fast web apps, with 100% code ownership for the client.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jakarta',
    addressCountry: 'ID',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: '-6.2088',
    longitude: '106.8456',
  },
  knowsAbout: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Web Performance',
    'Financial Ledgers',
    'Full-Stack Web Development',
  ],
  sameAs: SAME_AS,
};

export default function FreelancePage() {
  return (
    <>
      <Seo
        path="/freelance"
        title="Freelance Web Developer for Startups"
        description="Freelance web developer for businesses and startups. Fast Next.js websites, admin and finance systems, and MVPs. Fixed scope, weekly working previews and 100% code ownership."
        jsonLd={FREELANCE_STRUCTURED_DATA}
        author={siteConfig.name}
      />

      <div className="min-h-screen bg-background text-white pt-20 relative flex flex-col selection:bg-red-600 selection:text-white w-full overflow-x-clip">
        <main className="flex-1 w-full flex flex-col relative z-10">
          <FreelanceHero />
          {/* Anchor targets live outside the lazy boundary so #work-section, #about-section and #start resolve before the sections mount */}
          <div id="work-section" className="scroll-mt-20">
            <SelectedWork />
          </div>
          <Services />
          <Process />
          <div id="about-section" className="scroll-mt-20">
            <AboutFreelancer />
          </div>
          <FaqSection />
          <div id="start" className="scroll-mt-20">
            <StartProject />
          </div>
        </main>

        <StickyStartBar />

        <Footer />
      </div>
    </>
  );
}
