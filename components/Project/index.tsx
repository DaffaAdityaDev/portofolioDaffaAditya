import React from 'react'
import Image from 'next/image'
import githubSvg from '../../public/svg/github.svg'
import weblinkSvg from '../../public/svg/weblink.svg'


const Project = ({ data }: { data: any }) =>  {
  let isOdd = true;
  return (
    <div className='pt-20'>
      <div className='bg-gradient-to-r from-blue-500 to-transparent w-1/6 h-1 rounded-full mb-2'></div>
      <h2 className='text-4xl font-bold'>Project</h2>
      <p className='opacity-80 pb-4 text-2xl'>Some i have done</p>
      <div className='flex flex-wrap justify-center w-full'>
      {data.map((data: any, index: number) => {
          const { title, description, image, link, github, id, tech } = data;
          return (
            <div className='bg-slate-800 h-[600px] max-w-[30rem] px-10 rounded-lg py-10 m-3' key={id}>
              <div className='h-full flex flex-wrap flex-col justify-between'>
                <div>
                  <h1 className='font-bold text-3xl'>{title}</h1>
                  <p className='text-white opacity-80 normal'>{description}</p>
                  <div className='bg-gradient-to-r from-blue-500 to-transparent w-1/3 h-1 rounded-full mt-3'></div>
                </div>
                <div className='h-60 relative w-full overflow-hidden rounded-xl'>
                  <a href={link} target='_blank' rel='noreferrer'>
                    <div className='z-10 absolute peer hover:bg-black hover:bg-opacity-60 
                    text-transparent hover:text-white text-lg font-bold flex items-center justify-center w-full h-full'>Open Page</div>
                    <img className='z-0 rounded-xl peer-hover:scale-150 ease-in-out duration-500 w-full h-60' src={image} alt='project'/>
                  </a>
                </div>
                <div>
                  <p className='text-center font-bold'>Tech Stack</p>
                  <div className='flex flex-row items-center justify-center justify-items-center'>
                    {tech.map((tech: any, index: number) => {
                      return (
                        <p className='text-gray-300 font-medium mx-2 text-center' key={index}>{tech}</p>
                      )})}
                  </div>
                </div>
                <div className='flex flex-row justify-center gap-10'>
                  <a href={link} target
                  ='_blank' rel='noreferrer' className='ease-out duration-300 hover:scale-125'>
                    <div className='h-full flex flex-row content-center justify-center items-center'>
                      <Image src={weblinkSvg} alt='weblink' width={30} height={30} />
                      <p className='pl-2'>Page</p>
                    </div>
                  </a>
                  <a href={github} target
                  ='_blank' rel='noreferrer' className='ease-out duration-300 hover:scale-125'>
                    <div className='h-full flex flex-row content-center justify-center items-center'>
                      <Image src={githubSvg} alt='github' width={30} height={30} />
                      <p className='pl-2'>Code</p>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          )
      })}

      </div>
    </div>
  )
}

export default Project