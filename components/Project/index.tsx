import React from 'react'
import Image from 'next/image'
import githubSvg from '../../public/svg/github.svg'
import weblinkSvg from '../../public/svg/weblink.svg'


const Project = ({ data }: { data: any }) =>  {
  let isOdd = true;
  return (
    <div className=''>
      <h1 className='text-4xl font-bold pb-4'>Some Thing i&apos;ve done</h1>
      {data.slice(0,3).map((data: any, index: number) => {
          const { title, description, image, link, id, tech } = data;
          return (
            <div className='bg-gray-900 h-[600px] w-1/2 px-10 rounded-lg mb-2 py-10'  key={id}>
              <div className='h-full flex flex-wrap flex-col justify-between'>
                <div>
                  <h1 className='font-bold text-3xl'>{title}</h1>
                  <p className='text-gray-500'>{description}</p>
                  <div className='bg-gradient-to-r from-blue-500 to-transparent w-1/3 h-1 rounded-full mt-3'></div>
                </div>
                <div className='h-50 w-full overflow-hidden rounded-xl'>
                  <img className='rounded-xl hover:scale-150 ease-in-out duration-150' src={image} alt='project'/>
                </div>
                <div>
                  <p className='text-center'>Tech Stack</p>
                  <div className='flex flex-row items-center justify-center'>
                    {tech.map((tech: any, index: number) => {
                      return (
                        <p className='text-gray-300 font-medium mx-2' key={index}>{tech}</p>
                      )})}
                  </div>
                </div>
                <div className='flex flex-row justify-center gap-10'>
                  <a href={link} target
                  ='_blank' rel='noreferrer'>
                    <div className='h-full flex flex-row content-center justify-center items-center'>
                      <Image src={weblinkSvg} alt='weblink' width={30} height={30} />
                      <p className='pl-2'>Page</p>
                    </div>
                  </a>
                    <a href={link} target
                    ='_blank' rel='noreferrer'>
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
  )
}

export default Project