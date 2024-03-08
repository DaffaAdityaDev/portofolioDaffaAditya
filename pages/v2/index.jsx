import React from 'react';
import Navbar from '../../components/Navbar/V2';
import AboutMe from '../../components/AboutMe/V2';
import Hero from '../../components/Hero/V2';
import Technologies from '../../components/Technologies/V2';

function index() {
  return (
    <>
      <div className="h-full bg-black font-secondary text-white">
        <div className="">
          <Navbar />
          <Hero />
          <AboutMe />
          <Technologies />
        </div>
      </div>
    </>
  );
}

export default index;
