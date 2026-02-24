import React from 'react';

const Footer = () => {
  return (
    <footer className="relative border-t border-neutral-800">
      <div className="px-6 lg:px-20 py-12">
        <div className="flex flex-col justify-center items-center gap-2">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-tight">DAFFA ADITYA</span>
          </div>

          {/* Links */}
          

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
