import type { NextPage } from 'next';
import Head from 'next/head';
import AboutMe from '../components/AboutMe';
import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import Project from '../components/Project';
import data from '../data/Personal.js';
import ExperienceData from '../data/Experience.js';
import Contact from '../components/Contact';
import Technologies from '../components/Technologies';
import Experience from '../components/Experience';
import CourseTaken from '../components/CourseTaken';
import Footer from '../components/Footer';
import { Fade } from 'react-awesome-reveal';

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

      <div className="container max-w-[1200px] font-primary text-white">
        <Navbar />
        <Hero />
        <Fade triggerOnce>
          <AboutMe />
        </Fade>
        <Project data={data} />
        <Fade triggerOnce>
          <Technologies />
        </Fade>
        <Experience ExperienceData={ExperienceData} />
        <Fade triggerOnce>
          <CourseTaken />
        </Fade>
        <Fade triggerOnce>
          <Contact />
        </Fade>
        <Fade triggerOnce>
          <Footer />
        </Fade>

        {/* <BlogLayout>
          {posts.slice(0,3).map((post: any) => (
            <div className="" key={post.title}>
                <BlogCard 
                    title={post.title}
                    key={post.id}
                    datePublished={post.datePublished}
                    slug={post.slug}
                    timeRead={post.timeRead}
                    description={post.description}
                />
            </div>
          ))}
        </BlogLayout> */}
      </div>
    </>
  );
};

export default Home;
