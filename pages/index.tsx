import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Hero from '@/components/organisms/Hero';

// Above the fold components stay as static imports for LCP
import Marquee from '@/components/atoms/Marquee';
import { MARQUEE_TEXT } from '@/constant/constant';

// Below the fold components are lazy-loaded
const AboutMe = dynamic(() => import('@/components/organisms/AboutMe'), { ssr: true });
const Experience = dynamic(() => import('@/components/organisms/Experience'), { ssr: true });
const Projects = dynamic(() => import('@/components/organisms/Projects'), { ssr: true });
const TechStack = dynamic(() => import('@/components/molecules/TechStack'), { ssr: true });
const Contact = dynamic(() => import('@/components/organisms/Contact'), { ssr: true });
const Footer = dynamic(() => import('@/components/organisms/Footer'), { ssr: true });

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Daffa Aditya Rahman | Software Engineer</title>
        <meta name="description" content="Portfolio of Daffa Aditya Rahman, a Software Engineer specialized in high-performance web solutions and industrial-grade UI/UX." />
        <meta property="og:title" content="Daffa Aditya Rahman" />
        <meta
          property="og:description"
          content="Software Engineer Portfolio - Crafting functional and user-centric web solutions."
        />
        <meta property="og:image" content="/image/Profile.jpg" />
        <meta property="og:url" content="https://daffaaditya.netlify.app" />
        <link rel="icon" href="/svg/selflogo.svg" />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative flex flex-col">
        
        <main className="flex-1 relative">
          <Hero />
          <AboutMe />
          <Experience />
          <Projects />
          <TechStack />
          <Contact />
        </main>

        {/* Footer Marquee */}
        <Marquee text={MARQUEE_TEXT} border={true} type="light" />

        <Footer />
      </div>
    </>
  );
};

export default Home;
