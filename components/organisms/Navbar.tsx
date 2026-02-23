import React from 'react';
import { useRouter } from 'next/router';
import { MARQUEE_TEXT } from '@/constant/constant';
import Marquee from '../atoms/Marquee';
import { resumeLink } from '@/data/ContactV4';

const Navbar = () => {
  const router = useRouter();

  const handleNavigation = async (item: { label: string; id?: string; path?: string; externalPath?: string }) => {
    if (item.externalPath) {
      window.open(item.externalPath, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.path) {
      await router.push(item.path, undefined, { scroll: false });
      return;
    }

    if (item.id) {
      if (router.pathname !== '/') {
        await router.push(`/#${item.id}`);
      } else {
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const navItems = [
    { label: 'INDEX', id: 'hero' },
    { label: 'BLOG', path: '/blog' },
    { label: 'CONTACT', id: 'contact' },
    { label: 'RESUME', externalPath: resumeLink }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-100 bg-[#0a0a0a] border-b border-neutral-800">
      <div className="flex justify-between items-stretch h-16">
        {/* Brand */}
        <div 
          className="flex items-center px-6 border-r border-neutral-800 bg-neutral-900 cursor-pointer w-auto whitespace-nowrap"
          onClick={() => router.push('/', undefined, { scroll: false })}
        >
          {/* <div className="w-6 h-6 bg-red-600 rounded-sm mr-3 animate-pulse"></div> */}
          <span className="font-bold text-lg tracking-tight text-white">DAFFA ADITYA</span>
        </div>

        {/* Marquee Filler */}
        <div className="hidden md:flex flex-1 items-center overflow-hidden border-r border-neutral-800 relative bg-[#0a0a0a]">
             {/* <div className="animate-marquee whitespace-nowrap text-xs font-mono text-neutral-500">
                {MARQUEE_TEXT} {MARQUEE_TEXT}
             </div> */}
             <Marquee text={MARQUEE_TEXT} opacity={0.2} />
        </div>

        {/* Nav Links */}
        <div className="flex">
          {navItems.map((item, i) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item)}
              className={`flex items-center px-6 lg:px-8 text-xs font-bold font-mono text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors ${i !== navItems.length - 1 ? 'border-r border-neutral-800' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
