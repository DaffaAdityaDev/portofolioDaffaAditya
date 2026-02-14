import React from 'react'
import ContactButton from '../ui/ContactButton';

function Contact() { 
  return (
    <div className="flex flex-col items-center justify-center mt-10 w-full max-w-[1024px] mx-auto px-4 mb-20 h-[50vh] short:h-[500px]">
      <h1 className="text-7xl font-bold text-center mb-6 bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent">
        Keep In Touch.
      </h1>
      
      <div className="text-center mb-10">
        <p className="text-lg mb-2 text-default-900">
          I'm currently Working as a{' '}
          <span className="text-emerald-400">Software Engineer</span>.
        </p>
        <p className="text-lg text-default-900">
          Feel free to get in touch and talk more about your projects.
        </p>
      </div>

      <div className="flex justify-center gap-4 flex-wrap">
        <ContactButton /> 
      </div>
    </div>
  )
}

export default Contact
