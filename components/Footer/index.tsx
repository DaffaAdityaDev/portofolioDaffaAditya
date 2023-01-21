import React from 'react'

function Footer() {
  return (
    <div className='flex flex-col w-full antialiased text-center pb-5'>
        <p>Designed and Developed by Daffa Aditya Rahman</p>
        <p>Build With 
            <span className='mx-1 text-cyan-400'>Next.JS</span>
            &
            <span className='mx-1 text-sky-400'>TailwindCSS.</span>
            Hosted on 
            <span className='mx-1 text-emerald-400'>Netlify</span>
        </p>
    </div>
  )
}

export default Footer