import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { MARQUEE_TEXT } from '@/constant/constant';
import Marquee from '../atoms/Marquee';
import { resumeLink } from '@/data/ContactV4';

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = async (item: { label: string; id?: string; path?: string; externalPath?: string }) => {
    setIsMenuOpen(false);
    
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
    { label: 'HOME', id: 'hero' },
    { label: 'BLOG', path: '/blog' },
    { label: 'CONTACT', id: 'contact' },
    { label: 'RESUME', path: '/resume' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0a0a0a] border-b border-neutral-800">
      <div className="flex justify-between items-stretch h-16">
        {/* Brand */}
        <div 
          className="flex items-center px-4 md:px-6 border-r border-neutral-800 bg-neutral-900 cursor-pointer w-auto whitespace-nowrap"
          onClick={() => {
            setIsMenuOpen(false);
            router.push('/', undefined, { scroll: false });
          }}
        >
          <span className="font-bold text-sm md:text-lg tracking-tight text-white uppercase">DAFFA ADITYA</span>
        </div>

        {/* Marquee Filler (Desktop only) */}
        <div className="hidden md:flex flex-1 items-center overflow-hidden border-r border-neutral-800 relative bg-[#0a0a0a]">
             <Marquee text={MARQUEE_TEXT} opacity={0.2} />
        </div>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex">
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

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center px-6 gap-2 text-xs font-bold font-mono text-white hover:bg-neutral-900 transition-colors"
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            <span>{isMenuOpen ? 'CLOSE' : 'MENU'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-16 left-0 w-full bg-[#0a0a0a] border-b border-neutral-800 flex flex-col shadow-2xl"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className="w-full py-6 px-6 text-left text-xs font-bold font-mono text-neutral-400 hover:text-white hover:bg-neutral-900 border-b border-neutral-900 last:border-none transition-colors"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
