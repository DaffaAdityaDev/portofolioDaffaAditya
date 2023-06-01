import React, { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import Image from 'next/image'

const AboutMe:NextPage = () => {
    return (
    <div className='flex flex-wrap md:flex-col bg-sky-700 border-sky-700 border-2 bg-opacity-20 p-5 rounded-lg '>
      <div className="flex-1 ">
        <h2 className='text-4xl font-bold'>About Me</h2>
        <h1 className='text-2xl font-bold pr-3'>Enginner who have passion on Technology</h1>
        <p className='text-1xl font-normal pb-5'>Hey there! I&apos;m 
        <span className="text-blue-400 font-bold">
          <a href='https://www.linkedin.com/in/daffaadityarahman-14b588192/' rel="noreferrer" target='_blank'> Daffa Aditya Rahman</a>
        </span>, a third-year Software Engineering student with a strong 
        passion for technology and programming. I&apos;m constantly driven to expand my knowledge and stay ahead in this rapidly evolving field. 
        Currently, my primary areas of focus are 
        <span className="text-teal-400 font-bold">
          <a href='https://www.dicoding.com/certificates/JMZV91O1RPN9' rel="noreferrer" target='_blank'> mobile app development </a>
        </span>and 
        <span className="text-green-400 font-bold">
          <a href='https://www.freecodecamp.org/certification/fcc69fbe3fe-5900-4d24-b19e-a24be1c50320/responsive-web-design' rel="noreferrer" target='_blank'> web development.</a>
        </span> I&apos;m enthusiastic about honing my skills in these 
        areas and staying up to date with the latest advancements.
        </p>
      </div>
      <div className="flex-1 ml-3 md:ml-0">
        <h1 className='text-2xl font-bold'>My Journey</h1>
        <p className='text-1xl font-normal pb-5'>
          I started my journey as a programmer when i Graduated From Vocational High School, 
          When My best friend recommended me to join a 
          <span className="text-amber-500 font-bold">
            <a href='https://pll.harvard.edu/course/cs50-introduction-computer-science' rel="noreferrer" target='_blank'> Harvard CS50 </a>
          </span> 
          Introduction to Computer Science. Intrigued by programming,
          
          I decided to pursue a Software Engineering major at the
          <span className="text-blue-400 font-bold">
            <a href='https://pddikti.kemdikbud.go.id/data_pt/MUE4NEE5QUQtNzVGOS00NENELUJFQkEtNUE1RDIzQzdGNjEz' rel="noreferrer" target='_blank'> Bina Sarana Informatika University. </a>
          </span>
          Alongside my studies, I also explored mobile app development and web development. Recently, 
          I was accepted into the prestigious 
          <span className="text-red-500 font-bold">
            <a href='https://grow.google/intl/id_id/bangkit/?tab=mobile-development' rel="noreferrer" target='_blank'> Bangkit Academy 2023 </a>
          </span>
          as Mobile Development cohort, where I continue to learn and stay up to date with the latest technology.
        </p>
        <p className='text-1xl font-normal pb-5'>Let&apos;s connect and collaborate together</p>
      </div>
    </div>
  )
}

export default AboutMe