import type { NextPage } from 'next';
import Head from 'next/head';
import Hero from '@/components/organisms/Hero';
import TechStack from '@/components/molecules/TechStack';
import Projects from '@/components/organisms/Projects';
import Experience from '@/components/organisms/Experience';
import Contact from '@/components/organisms/Contact';
import Footer from '@/components/organisms/Footer';
import Marquee from '@/components/atoms/Marquee';
import AboutMe from '@/components/organisms/AboutMe';

import { MARQUEE_TEXT } from '@/constant/constant';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Daffa Aditya Rahman</title>
        <meta name="description" content="Daffa Aditya Personal Website" />
        <meta property="og:title" content="Daffa Aditya Rahman" />
        <meta
          property="og:description"
          content="Daffa Aditya Personal Website"
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
