import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Github from '/public/svg/github.svg';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        // Change this value to whatever you want
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-4 z-50 flex w-full justify-center">
      <div
        className={`relative flex h-12 items-center justify-between border-gray-400 border-opacity-0 py-4 transition-all duration-500 ease-in-out   ${
          scrolled
            ? 'h-12 w-1/2 rounded-full border-[1px] border-opacity-100 bg-white/20 bg-opacity-50 backdrop-blur-xl'
            : 'w-full px-20'
        }`}
      >
        <div className="flex items-center justify-center ">
          <a
            href="https://github.com/DaffaAdityaDev"
            target="_blank"
            rel="noopener noreferrer"
            className={`absolute left-10 flex flex-row items-center gap-2 font-bold ${
              scrolled ? 'left-10' : 'left-20'
            }`}
          >
            <Image src={Github} alt="Github" width={30} height={30} />
          </a>
        </div>
        <div className="absolute right-1/2 translate-x-1/2 transform text-white">
          <a href="/about">About</a>
        </div>
        <div className={` ${scrolled ? 'mr-2' : ''}`}>
          <a
            href="https://drive.google.com/file/d/16bp1lgGaVHe670IO1bR7khk01h6GaXdC/view?usp=share_link"
            className={`absolute right-2 -translate-y-1/2 rounded-full bg-white px-6 py-2 text-sm text-black transition-all duration-500 ease-in-out   ${
              scrolled ? ' scale-100 ' : 'right-20 scale-150 text-xs'
            }`}
            target="_blank"
            rel="noreferrer"
          >
            Resume
          </a>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
