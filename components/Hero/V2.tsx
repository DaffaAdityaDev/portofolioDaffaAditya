import React from 'react';
import image from '../../public/images/hero.jpg';
function Hero() {
  return (
    <div className="relative h-screen pt-60">
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform">
        <p className="text-center text-2xl font-normal">
          Hi There!, my name is
        </p>
        <h1 className="text-center text-8xl font-bold">Daffa Aditya Rahman</h1>
        <p className="text-center text-xl font-light">
          I&apos;m a Software Engineer
        </p>
      </div>

      <div
        className='absolute bottom-0 right-0 z-0 h-full w-full
        bg-black bg-[url("/image/bg/chroma_bg.png")] bg-cover bg-center'
      />
      <div
        className="absolute bottom-0 right-0 z-0 h-1/3 w-full
       bg-gradient-to-t from-black"
      />
    </div>
  );
}

export default Hero;
