import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { m, useMotionValue, useMotionTemplate } from 'framer-motion';
import { contactData, resumeLink } from './constants';
import { FADE_IN_UP_CONTAINER, FADE_IN_UP_ITEM } from '@/constant/animations';
import SpotlightButton from '@/components/ui/SpotlightButton';

const Contact = () => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const [isHoveringGrid, setIsHoveringGrid] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const spotlightBg = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, rgba(239, 68, 68, 0.16), rgba(255, 255, 255, 0.04) 40%, transparent 80%)`;

  const handleCopyEmail = (label: string, value: string) => {
    if (label === 'EMAIL') {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <m.section 
      id="contact" 
      variants={FADE_IN_UP_CONTAINER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative py-10 md:py-20 px-4 sm:px-6 lg:px-20 border-t border-neutral-800 scroll-mt-20"
    >
      {/* Markers for the parent SVG */}
      <div id="contact-timeline-start" className="absolute left-[15px] md:left-[31px] top-0 w-1 h-1 pointer-events-none" />
      <div id="contact-timeline-end" className="absolute left-[15px] md:left-[31px] bottom-0 w-1 h-1 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-20">
        
        <m.div variants={FADE_IN_UP_ITEM} className="mb-6 md:mb-12">
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-6 text-white">LET'S WORK TOGETHER</h2>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Currently available for full-time software engineering roles and select freelance opportunities.
          </p>
        </m.div>

        <m.div
          variants={FADE_IN_UP_ITEM}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringGrid(true)}
          onMouseLeave={() => {
            setIsHoveringGrid(false);
          }}
          className="grid md:grid-cols-3 gap-px bg-neutral-800 border border-neutral-800/80 rounded-2xl overflow-hidden mb-12 shadow-2xl relative group/grid"
        >
          {/* Round Cursor-Tracking Spotlight Gradient */}
          <m.div
            className="pointer-events-none absolute inset-0 z-5 transition-opacity duration-300"
            style={{
              background: spotlightBg,
              opacity: isHoveringGrid ? 1 : 0,
            }}
          />
          {contactData.map((contact, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <a 
                key={idx} 
                href={contact.link}
                target={contact.label === 'EMAIL' ? undefined : '_blank'}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => handleCopyEmail(contact.label, contact.value)}
                rel="noopener noreferrer"
                data-cursor="merge"
                className="block bg-[#0a0a0a] p-8 transition-colors group relative cursor-pointer focus:outline-none"
              >
                {/* Single Shared Sliding Highlight Pill */}
                {isHovered && (
                  <m.div
                    layoutId="contact-card-highlight"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 35,
                      mass: 0.8,
                    }}
                    className="absolute inset-0 bg-neutral-900 border border-neutral-700/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.5)] z-0 pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                  </m.div>
                )}

                <div className="relative z-10">
                  <div className={`transition-all duration-200 mb-4 flex justify-center ${isHovered ? 'text-white scale-110' : 'text-neutral-500'}`}>
                    {contact.icon}
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                    {contact.label} 
                    {contact.label === 'EMAIL' && copied && <span className="text-emerald-400 ml-2 animate-pulse">(COPIED)</span>}
                  </div>
                  <div className={`font-mono text-sm transition-colors duration-200 ${isHovered ? 'text-red-400' : 'text-white'}`}>
                    {contact.value}
                  </div>
                </div>
              </a>
            );
          })}
        </m.div>

        {/* CTA */}
        <m.div variants={FADE_IN_UP_ITEM} className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <SpotlightButton 
            as="a"
            variant="primary"
            href="mailto:daffaaditya.me@gmail.com"
            onClick={() => handleCopyEmail('EMAIL', 'daffaaditya.me@gmail.com')}
          >
            SEND EMAIL <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </SpotlightButton>
          
          <SpotlightButton 
            as="a"
            variant="secondary"
            href="/resume"
            onClick={(e) => {
              e.preventDefault();
              router.push('/resume');
            }}
          >
            VIEW RESUME <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={18} />
          </SpotlightButton>
        </m.div>

        <m.div variants={FADE_IN_UP_ITEM} className="mt-8">
          <Link
            href="/freelance"
            className="group inline-flex items-center gap-2 font-mono text-sm text-neutral-300 hover:text-white underline underline-offset-4 decoration-neutral-700 hover:decoration-red-500 transition-colors"
          >
            Freelance work <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </m.div>

      </div>

    </m.section>
  );
};

export default Contact;
export { Contact };
