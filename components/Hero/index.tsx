'use client';
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Personal from '../../data/Personal';
import githubSvg from '../../public/svg/github.svg';
import linkedIn from '../../public/svg/linkedin.svg';
import email from '../../public/svg/email.svg';
import Bangkit from '../../public/svg/bangkit.svg';
import Image from 'next/image';
const Hero: NextPage = () => {
  const [showScrollBar, setShowScrollBar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollBar(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="block grid h-screen content-center my-20">
      <div className="-mt-60">
        <p className="bg-gradient-to-r from-sky-400 to-sky-800 bg-clip-text text-2xl font-medium text-transparent ">
          Hi There!, my name is
        </p>
        <h1
          className="bg-gradient-to-r from-white to-slate-500 bg-clip-text 
        text-7xl font-bold text-transparent md:text-5xl sm:text-4xl"
        >
          Daffa Aditya Rahman
        </h1>
        <h1
          className="bg-gradient-to-r from-white to-slate-500 bg-clip-text 
        pb-4 text-7xl font-bold text-transparent md:text-5xl sm:text-4xl"
        >
          I&apos;m a Software Engineer
        </h1>
        <p className="text-3xl text-white/50 md:text-2xl sm:text-xl">
          A software engineer who develop, build and Explore tehcnologies.
        </p>
        <p className="mt-10 text-2xl md:text-xl sm:text-lg">
          🎓 Software Engineer Student at Bina Sarana Informatika.
        </p>
        <p className="flex gap-2 align-middle text-2xl md:text-xl sm:text-lg">
          <Image src={Bangkit} alt="github" width={30} height={30} /> Bangkit
          Mobile Developer Cohort.
        </p>
        <div className="flex flex-wrap sm:justify-center">
          <div className=" mr-3 mt-5 cursor-pointer rounded-lg rounded-br-lg p-2 duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-sky-700/50">
            <a
              href="https://github.com/DaffaAdityaDev"
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center"
            >
              <Image src={githubSvg} alt="github" width={30} height={30} />
              <p className="pl-1 text-2xl">Github</p>
            </a>
          </div>
          <div className="mt-5 rounded-lg rounded-br-lg p-2 duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-sky-900/50">
            <a
              href="https://www.linkedin.com/in/daffaadityarahman-14b588192/"
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center"
            >
              <Image
                src={linkedIn}
                alt="github"
                width={30}
                height={30}
                className="bg-white"
              />
              <p className="pl-1 text-2xl">LinkedIn</p>
            </a>
          </div>
          <div className="mx-3 mt-5 rounded-lg rounded-br-lg p-2 duration-300 hover:-translate-y-1 hover:scale-110 hover:bg-sky-900/50">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=daffaaditya.me@gmail.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center"
            >
              <Image
                src={email}
                alt="github"
                width={30}
                height={30}
                className="saturate-750 hue-rotate-137 brightness-101 contrast-105 invert sepia-0"
              />
              <p className="pl-1 text-2xl">Email</p>
            </a>
          </div>
        </div>
      </div>
      <div
        className={`absolute bottom-10 left-1/2 flex h-10 w-10 flex-col items-center justify-center opacity-100 transition-opacity duration-700 ease-in ${
          showScrollBar ? '!opacity-100' : '!opacity-0'
        }`}
      >
        <img
          src="/svg/scroll-bar.svg"
          alt="scroll"
          className={` animate-bounce `}
        />
        <p className="font-bold">scroll</p>
      </div>
    </div>
  );
};

export default Hero;
