import React from 'react';
import { motion } from 'framer-motion';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/constant/animations';

const Footer = () => {
  return (
    <motion.footer 
      variants={FADE_IN_UP_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative border-t border-neutral-800"
    >
      <div className="px-6 lg:px-20 py-12">
        <motion.div variants={FADE_IN_UP_ITEM} className="flex flex-col justify-center items-center gap-2">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg tracking-tight">DAFFA ADITYA</span>
          </div>

          {/* Copyright */}
          <div className="text-xs font-mono text-neutral-600">
            © 2026 — ALL RIGHTS RESERVED
          </div>

        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
export { Footer as FooterComponent };
