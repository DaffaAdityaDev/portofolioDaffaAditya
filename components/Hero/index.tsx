import type { NextPage } from 'next'
import Personal from '../../data/Personal';
import githubSvg from '../../public/svg/github.svg';
import linkedIn from '../../public/svg/linkedin.svg';
import email from '../../public/svg/email.svg';
import Image from 'next/image';

const Hero: NextPage = () =>  {
  return (
    <div className="block h-screen grid content-center w">
      <div className='-mt-60'>
        <p className='font-medium text-2xl text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-800 '>Hi There!, my name is</p>
        <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            Daffa Aditya Rahman
        </h1>
        <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500 pb-4">
            I&apos;m a Software Engineer
        </h1>
        <p className='text-3xl text-white/50'>A self-taught software engineer who develop, build and Explore tehcnologies.</p>
        <p className='text-2xl mt-10'>🎓 Currently an Software Engineer Student at Bina Sarana Informatika.</p>
        <p className='text-2xl'>🚀 Exploring opportunities and side projects.</p>
        <div className='flex flex-wrap sm:justify-center'>
          <div className=' mt-5 p-2 mr-3 rounded-lg rounded-br-lg hover:-translate-y-1 hover:scale-110 hover:bg-sky-700/50 duration-300 cursor-pointer'>
            <a href="https://github.com/DaffaAdityaDev" rel="noopener noreferrer" target="_blank" className='flex items-center'>
              <Image src={githubSvg} alt="github" width={30} height={30}/>
              <p className='pl-1 text-2xl'>Github</p>
            </a>
          </div>
          <div className='mt-5 p-2 rounded-lg rounded-br-lg hover:-translate-y-1 hover:scale-110 hover:bg-sky-900/50 duration-300'>
            <a href="https://www.linkedin.com/in/daffaadityarahman-14b588192/" rel="noopener noreferrer" target="_blank" className="flex items-center" >
              <Image src={linkedIn} alt="github" width={30} height={30} className="bg-white"/>
              <p className='pl-1 text-2xl'>LinkedIn</p>
            </a>
          </div>
          <div className='mt-5 p-2 rounded-lg mx-3 rounded-br-lg hover:-translate-y-1 hover:scale-110 hover:bg-sky-900/50 duration-300'>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=daffaaditya.me@gmail.com" target="_blank" rel="noreferrer" className='flex items-center'>
              <Image src={email} alt="github" width={30} height={30} className="invert sepia-0 saturate-750 hue-rotate-137 brightness-101 contrast-105"/>
            <p className='pl-1 text-2xl'>Email</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero