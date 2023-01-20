import React from 'react'
import Frontend from '../../public/svg/react.svg'
import Backend from '../../public/svg/database.svg'
import Ui from '../../public/svg/design.svg'
import Github from '../../public/svg/github.svg'
import Image from 'next/image'
import { NextPage } from 'next'

const Technologies:NextPage = () => {
  return (
    <div>
      <div className='bg-gradient-to-r mt-20 from-blue-500 to-transparent w-1/6 h-1 rounded-full mb-2'></div>
      <h2 className='font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white antialiased'>Skills</h2>
      <p className='opacity-80 text-lg md:text-base'>I&apos;ve worked with a range a technologies in the web development world.From Front-end To design</p>
      <div className='flex flex-wrap justify-between gap-5 pt-5'>
        <div>
          <Image src={Frontend} alt='github' width={30} height={30} />
          <div className='group w-44'>
            <h2 className='font-bold text-4xl group-hover:bg-clip-text 
             group-hover:text-transparent group-hover:bg-gradient-to-r 
             group-hover:from-sky-400  group-hover:to-violet-500'>Front-End</h2>
            <p className='font-normal text-lg'>HTML & CSS</p>
            <p className='font-normal text-lg'>React.JS</p>
            <p className='font-normal text-lg'>Next.JS</p>
            <p className='font-normal text-lg'>Axios</p>
            <p className='font-normal text-lg'>Sass</p>
            <p className='font-normal text-lg'>Tailwind</p>
          </div>
        </div>
        <div>
          <Image src={Backend} alt='github' width={30} height={30} />
          <div className='group w-44'>
            <h2 className='font-bold text-4xl group-hover:bg-clip-text 
              group-hover:text-transparent  group-hover:bg-gradient-to-r 
              group-hover:from-sky-400  group-hover:to-violet-500'>Back-End</h2>
            <p className='font-normal text-lg'>MongoDB</p>
            <p className='font-normal text-lg'>Node.JS</p>
            <p className='font-normal text-lg'>MYSQL</p>
            <p className='font-normal text-lg'>Linux</p>
            <p className='font-normal text-lg'>Firebase</p>
            <p className='font-normal text-lg'>Express.JS</p>
          </div>
        </div>
        <div>
          <Image src={Ui} alt='github' width={30} height={30} />
          <div className='group w-44'>
            <h2 className='font-bold text-4xl group-hover:bg-clip-text 
              group-hover:text-transparent  group-hover:bg-gradient-to-r 
              group-hover:from-sky-400  group-hover:to-violet-500'>UI/UX</h2>
            <p className='font-normal text-lg'>Photoshop</p>
            <p className='font-normal text-lg'>Figma</p>
            <p className='font-normal text-lg'>Web Vital</p>
            <p className='font-normal text-lg'>Responsive Design</p>
          </div>
        </div>
        <div>
          <Image src={Github} alt='github' width={30} height={30} />
          <div className='group w-44'>
            <h2 className='font-bold text-4xl group-hover:bg-clip-text 
              group-hover:text-transparent  group-hover:bg-gradient-to-r 
              group-hover:from-sky-400  group-hover:to-violet-500'>DevOps</h2>
            <p className='font-normal text-lg'>Github</p>
            <p className='font-normal text-lg'>Git</p>
            <p className='font-normal text-lg'>Docker</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Technologies