import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'

const AboutMe:NextPage = () => {
    return (
    <div className='flex flex-wrap'>
      <div className="flex-1">
        <h2 className='text-2xl font-bold'>About Me</h2>
        <h1 className='text-5xl font-bold pr-3'>Student who passion on Technology</h1>
        <p className='text-1xl font-normal pb-5'>Hey! I&aposm Daffa Aditya Rahman, I&aposm 
          Passionated On Technologies and Programming. <br/> 
          I love to code and good design.
        </p>
      </div>
      <div className="flex-1">
        <h1 className='text-2xl font-bold'>My Journey</h1>
        <p className='text-1xl font-normal pb-5'>
          I started my journey as a programmer when i&aposve Graduated From Vocational High School, When My best friend recommended me to join a CS50&aposs 
          Introduction to Computer Science. since that i started have passion on programming, After i&aposve Finised CS50 Course i started to explored how to code 
          myself, I learn various language and tehcnologies start from Web-Development, Computer-Science, Software-Engineering, etc.
        </p>
        <p className='text-1xl font-normal pb-5'>When I&aposm not coding i play game with my friend, or do design or drawing</p>
      </div>
    </div>
  )
}

export default AboutMe