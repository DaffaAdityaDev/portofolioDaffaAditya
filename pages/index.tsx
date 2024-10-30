import type { NextPage } from 'next';
import Head from 'next/head';
import AboutMe from '../components/AboutMe/V3';
import Hero from '../components/Hero/V3';
import Navbar from '../components/Navbar/V2';
import Project from '../components/Project/V3';
import data from '../data/Personal.js';
import ExperienceData from '../data/Experience.js';
import Contact from '../components/Contact/V3';
import Technologies from '../components/Technologies/V3';
import Experience from '../components/Experience';
import CourseTaken from '../components/CourseTaken';
import Footer from '../components/Footer';
import { Fade } from 'react-awesome-reveal';
import React from 'react';

const Home: NextPage = ({ posts }: any) => {
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

      <div className="font-primary text-white">
        <Navbar />
        <div className='flex flex-col items-center justify-center w-screen'>
          <Hero />
          <Project />
          <Fade triggerOnce>
            <AboutMe />
          </Fade>
          <Fade triggerOnce>
            <Technologies />
          </Fade>
          <Fade className="w-full" triggerOnce>
            <Experience ExperienceData={ExperienceData} />
          </Fade>
          <Fade className="w-full" triggerOnce>
            <CourseTaken />
          </Fade>
          <Fade triggerOnce>
            <Contact />
          </Fade>
          <Fade triggerOnce>
            <Footer />
          </Fade>
        </div>
      </div>
    </>
  );
};

export default Home;
