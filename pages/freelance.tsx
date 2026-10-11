import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Seo from '@/components/Seo';
import { lazyOnView } from '@/components/LazyOnView';
import FreelanceHero from '@/features/Freelance/components/FreelanceHero';

// Below-the-fold sections loaded on viewport approach via lazyOnView
const SelectedWork = lazyOnView(() => import('@/features/Freelance/components/SelectedWork'));
const Services = lazyOnView(() => import('@/features/Freelance/components/Services'));
const Process = lazyOnView(() => import('@/features/Freelance/components/Process'));
const AboutFreelancer = lazyOnView(() => import('@/features/Freelance/components/AboutFreelancer'));
const FaqSection = lazyOnView(() => import('@/features/Freelance/components/FaqSection'));
const StartProject = lazyOnView(() => import('@/features/Freelance/components/StartProject'));

// Sticky reveal footer matching case-studies and blog pages
const Footer = dynamic(() => import('@/components/Layout/Footer'), { ssr: true });

const FREELANCE_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Daffa Aditya | Freelance Software Engineer',
  image: 'https://daffaaditya.id/image/profile-768.webp',
  url: 'https://daffaaditya.id/freelance',
  email: 'daffaaditya.me@gmail.com',
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
  sameAs: [
    'https://github.com/DaffaAdityaDev',
    'https://www.linkedin.com/in/daffaadityarahman-14b588192/',
  ],
};

export default function FreelancePage() {
  return (
    <>
      <Seo
        path="/freelance"
        title="Freelance Web Developer for Businesses & Startups | Daffa Aditya"
        description="Freelance web developer for businesses and startups. Fast Next.js websites, admin and finance systems, and MVPs. Fixed scope, weekly working previews and 100% code ownership."
        jsonLd={FREELANCE_STRUCTURED_DATA}
      />
      <Head>
        <meta
          name="keywords"
          content="Freelance Web Developer, Next.js Developer, Web App Development, Jasa Pembuatan Website, Freelance Developer Jakarta, MVP Development"
        />
        <meta name="author" content="Daffa Aditya" />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 relative flex flex-col selection:bg-red-600 selection:text-white w-full overflow-x-clip">
        <main className="flex-1 w-full flex flex-col relative z-10">
          <FreelanceHero />
          {/* Anchor targets live outside the lazy boundary so #work-section and #start resolve before the sections mount */}
          <div id="work-section" className="scroll-mt-20">
            <SelectedWork />
          </div>
          <Services />
          <Process />
          <AboutFreelancer />
          <FaqSection />
          <div id="start" className="scroll-mt-20">
            <StartProject />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
