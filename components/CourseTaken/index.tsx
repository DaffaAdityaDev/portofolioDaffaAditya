import React from 'react'
import Course from '../../data/Course'
import Arrow from '../../public/svg/arrow.svg'
import Image from 'next/image'

function CourseTaken() {
  return (
    <div className='flex flex-wrap justify-between mt-20 w-full'>
        <div className='mb-6 ml-1'>
            <h2 className='bg-clip-text text-transparent bg-gradient-to-r 
            from-red-500 to-violet-500 text-6xl font-bold uppercase'>Course</h2>
            <h2 className='uppercase text-6xl'>Taken</h2>
        </div>
        <div className='w-1/2 sm:w-full'>
            {Course.map((data, index) => {
                return (
                <div key={index.toString()}>
                    <a href={data.source}  target="_blank" rel="noreferrer">
                        <div className='flex justify-between w-full items-center text-lg group'>
                            <div>
                                <h2 className='font-bold'>{data.course}</h2>
                                <div className='flex'>
                                    <p className='group-hover:translate-x-6 ease-in duration-100 mr-1'>{data.organization}</p>
                                    <Image src={Arrow} alt="arrow" width={20} height={20} className='group-hover:translate-x-6 ease-in duration-100'/>
                                </div>
                            </div>
                            <p className='font-semibold'>{data.year}</p>
                        </div>
                    </a>
                    <div className='bg-gradient-to-r mt-5 from-sky-400 via-violet-500 to-blue-500 w-full h-1 rounded-full mb-2'></div>
                </div>
                )
            })}
            
        </div>
    </div>
  )
}

export default CourseTaken