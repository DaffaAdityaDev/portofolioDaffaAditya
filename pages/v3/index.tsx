import React from 'react'
import Hero from '../../components/Hero/V3'
import Navbar from '../../components/Navbar/V2'
import Project from '../../components/Project/V3'
import AboutMe from '../../components/AboutMe/V3'
import Technologies from '../../components/Technologies/V3'
import Contact from '../../components/Contact/V3'
function Index() {
  return (
    <div className="bg-black text-white font-nunito">
      <Navbar />
      <Hero />
      <Project />
      <AboutMe />
      <Technologies/>
      <Contact/>
    </div>
  )
}

export default Index