import React from 'react';

const Footer = () => {
  return (
    <footer className="relative border-t border-neutral-800">
      <div className="px-6 lg:px-20 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
            <span className="font-bold text-lg tracking-tight">DAFFA ADITYA</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm font-mono text-neutral-500">
            <a href="#" className="hover:text-white transition-colors">INDEX</a>
            <a href="#" className="hover:text-white transition-colors">WORKS</a>
            <a href="#" className="hover:text-white transition-colors">CONTACT</a>
          </div>

          {/* Copyright */}
          <div className="text-xs font-mono text-neutral-600">
            © 2026 — ALL RIGHTS RESERVED
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
