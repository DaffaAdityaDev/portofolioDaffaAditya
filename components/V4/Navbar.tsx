import React from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  const handleNavigation = async (item: { label: string; id?: string; path?: string }) => {
    if (item.path) {
      await router.push(item.path);
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
    { label: 'WORKS', id: 'works' },
    { label: 'BLOG', path: '/blog' },
    { label: 'CONTACT', id: 'contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a] border-b border-neutral-800">
      <div className="flex justify-between items-stretch h-16">
        {/* Brand */}
        <div 
          className="flex items-center px-6 border-r border-neutral-800 bg-neutral-900 cursor-pointer"
          onClick={() => router.push('/')}
        >
          {/* <div className="w-6 h-6 bg-red-600 rounded-sm mr-3 animate-pulse"></div> */}
          <span className="font-bold text-lg tracking-tight text-white">DAFFA ADITYA</span>
        </div>

        {/* Marquee Filler */}
        <div className="hidden md:flex flex-1 items-center overflow-hidden border-r border-neutral-800 relative bg-[#0a0a0a]">
          <div className="absolute inset-0 flex items-center opacity-30">
             <div className="animate-marquee whitespace-nowrap text-xs font-mono text-neutral-500">
                SOFTWARE ENGINEER /// REACT SPECIALIST /// TYPESCRIPT EXPERT /// FULL STACK DEVELOPER /// SYSTEM ARCHITECT /// 
                SOFTWARE ENGINEER /// REACT SPECIALIST /// TYPESCRIPT EXPERT /// FULL STACK DEVELOPER /// SYSTEM ARCHITECT /// 
             </div>
          </div>
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
