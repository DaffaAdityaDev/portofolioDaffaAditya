import type { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '@/components/V4/Navbar';
import Hero from '@/components/V4/Hero';
import TechStack from '@/components/V4/TechStack';
import Projects from '@/components/V4/Projects';
import Experience from '@/components/V4/Experience';
import Contact from '@/components/V4/Contact';
import Footer from '@/components/V4/Footer';
import Marquee from '@/components/V4/Marquee';

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
        
        <Navbar />

        <main className="flex-1 relative">
          <Hero />
          <TechStack />
          <Projects />
          <Experience />
          <Contact />
        </main>

        {/* Footer Marquee */}
        <Marquee text="FRONTEND ENGINEER /// REACT SPECIALIST /// SYSTEM ARCHITECT /// UI/UX DESIGNER /// AVAILABLE FOR HIRE ///" />

        <Footer />

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
          .animate-marquee-reverse {
            animation: marquee-reverse 20s linear infinite;
          }
        `}</style>
      </div>
    </>
  );
};

export default Home;
