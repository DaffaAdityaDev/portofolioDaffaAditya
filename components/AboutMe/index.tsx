import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'

const AboutMe:NextPage = () => {
    return (
    <div className='flex flex-wrap md:flex-col bg-sky-700 border-sky-700 border-2 bg-opacity-20 p-5 rounded-lg '>
      <div className="flex-1 ">
        <h2 className='text-4xl font-bold'>About Me</h2>
        <h1 className='text-2xl font-bold pr-3'>Student who have passion on Technology</h1>
        <p className='text-1xl font-normal pb-5'>Hey! I&apos;m Daffa Aditya Rahman, I&apos;m 
        Student who majoring in Software Engineering. I&apos;m 
          Passionated On Technologies and Programming. <br/> 
          I&apos;m Currently Learning anything what excited me,
        </p>
      </div>
      <div className="flex-1 ml-3 md:ml-0">
        <h1 className='text-2xl font-bold'>My Journey</h1>
        <p className='text-1xl font-normal pb-5'>
          I started my journey as a programmer when i Graduated From Vocational High School, When My best friend recommended me to join a CS50&apos;s 
          Introduction to Computer Science. since that i started have passion on programming, After i Finised CS50 Course i started to explored how to code 
          myself, I learn various language and tehcnologies start from Web-Development, Computer-Science, Software-Engineering, etc.
        </p>
        <p className='text-1xl font-normal pb-5'>When I&apos;m not coding i play game with my friend, or do design</p>
      </div>
    </div>
  )
}

export default AboutMe