import React from 'react'
import { Fade } from "react-awesome-reveal";

const index = ({ ExperienceData }: { ExperienceData: any }) => {
  return (
    <div className='mt-10 w-full'>
      <div className='bg-gradient-to-r mt-20 from-blue-500 to-transparent w-1/6 h-1 rounded-full mb-2'></div>
      <Fade triggerOnce>
        <h2 className='text-3xl font-bold mb-5'>Experience</h2>
      </Fade>
      {ExperienceData.map((data: any, index: number) => {
        const { title, company, time } = data;
        return (
          <>
          <Fade triggerOnce>
            <div className='flex justify-between group'>
              <div>
                  <h3 className='text-2xl font-bold group'>{title}</h3>
                  <p className='text-1xl font-semibold'>{company}</p>
              </div>
              <div className='flex items-center gap-2'>
                  {/* <div className='w-1 h-1 bg-green-500 rounded-full'></div> */}
                  <p className='text-2xl font-semibold group-hover:bg-gradient-to-r 
              group-hover:from-sky-400  group-hover:to-violet-500 group-hover:bg-clip-text 
              group-hover:text-transparent'>{time}</p>
              </div>
            </div>
            <div className='bg-gradient-to-r mt-5 from-sky-400 via-violet-500 to-blue-500 w-full h-1 rounded-full mb-2'></div>
          </Fade>
          </>
        )})}
    </div>
  )
}

export default index