import React from 'react';
import Frontend from '../../public/svg/react.svg';
import Backend from '../../public/svg/database.svg';
import Ui from '../../public/svg/design.svg';
import Github from '../../public/svg/github.svg';
import Mobile from '../../public/svg/mobile_developer.svg';
import Image from 'next/image';
import { NextPage } from 'next';

const Technologies: NextPage = () => {
  return (
    <div>
      <div className="mb-2 mt-20 h-1 w-1/6 rounded-full bg-gradient-to-r from-blue-500 to-transparent"></div>
      <h2 className="bg-gradient-to-r from-white bg-clip-text text-4xl font-bold text-transparent antialiased">
        Skills
      </h2>
      <p className="text-lg opacity-80 md:text-base">
        I&apos;ve worked with a range a technologies in the web development
        world.From Front-end To design
      </p>
      <div className="flex flex-wrap justify-between gap-5 pt-5">
        <div>
          <Image src={Frontend} alt="github" width={30} height={30} />
          <div className="group w-44">
            <h2
              className="text-4xl font-bold group-hover:bg-gradient-to-r 
             group-hover:from-sky-400 group-hover:to-violet-500 
             group-hover:bg-clip-text  group-hover:text-transparent"
            >
              Framework
            </h2>
            <p className="text-lg font-normal">React.JS</p>
            <p className="text-lg font-normal">Vue.JS</p>
            <p className="text-lg font-normal">Next.JS</p>
            <p className="text-lg font-normal">Laravel</p>
            <p className="text-lg font-normal">Axios</p>
            <p className="text-lg font-normal">Tailwind</p>
          </div>
        </div>
        <div>
          <Image src={Backend} alt="github" width={30} height={30} />
          <div className="group w-44">
            <h2
              className="text-4xl font-bold group-hover:bg-gradient-to-r 
              group-hover:from-sky-400  group-hover:to-violet-500 
              group-hover:bg-clip-text  group-hover:text-transparent"
            >
              Back-End
            </h2>
            <p className="text-lg font-normal">MongoDB</p>
            <p className="text-lg font-normal">Node.JS</p>
            <p className="text-lg font-normal">MYSQL</p>
            <p className="text-lg font-normal">Linux</p>
            <p className="text-lg font-normal">Firebase</p>
            <p className="text-lg font-normal">Express.JS</p>
          </div>
        </div>
        <div>
          <Image
            src={Mobile}
            alt="github"
            width={30}
            height={30}
            className="fill-white"
          />
          <div className="group w-44">
            <h2
              className="text-4xl font-bold group-hover:bg-gradient-to-r 
              group-hover:from-sky-400  group-hover:to-violet-500 
              group-hover:bg-clip-text  group-hover:text-transparent"
            >
              Mobile
            </h2>
            <p className="text-lg font-normal">Intent and Fragment</p>
            <p className="text-lg font-normal">Kotlin</p>
            <p className="text-lg font-normal">Room</p>
            <p className="text-lg font-normal">Retrofit</p>
            <p className="text-lg font-normal">AndroidX</p>
            <p className="text-lg font-normal">Jetpack Compose</p>
          </div>
        </div>
        <div>
          <Image src={Ui} alt="github" width={30} height={30} />
          <div className="group w-44">
            <h2
              className="text-4xl font-bold group-hover:bg-gradient-to-r 
              group-hover:from-sky-400  group-hover:to-violet-500 
              group-hover:bg-clip-text  group-hover:text-transparent"
            >
              UI/UX
            </h2>
            <p className="text-lg font-normal">Photoshop</p>
            <p className="text-lg font-normal">Figma</p>
            <p className="text-lg font-normal">Web Vital</p>
            <p className="text-lg font-normal">Responsive Design</p>
          </div>
        </div>
        <div>
          <Image src={Github} alt="github" width={30} height={30} />
          <div className="group w-44">
            <h2
              className="text-4xl font-bold group-hover:bg-gradient-to-r 
              group-hover:from-sky-400  group-hover:to-violet-500 
              group-hover:bg-clip-text  group-hover:text-transparent"
            >
              DevOps
            </h2>
            <p className="text-lg font-normal">Github</p>
            <p className="text-lg font-normal">Git</p>
            <p className="text-lg font-normal">Docker</p>
            <p className="text-lg font-normal">Microservice</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Technologies;
