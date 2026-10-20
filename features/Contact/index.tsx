import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { m, useMotionValue, useMotionTemplate } from 'framer-motion';
import { contactData } from './constants';
import { SPRING_SNAPPY } from '@/constant/animations';
import Eyebrow from '@/components/ui/Eyebrow';
import Section from '@/components/ui/Section';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import SpotlightButton from '@/components/ui/SpotlightButton';

const Contact = () => {
  const router = useRouter();
  const { status: copyStatus, copy } = useCopyToClipboard(2000);
  const [hoveredIdx, setHoveredIdx] = useState<number>(0);
  const [isHoveringGrid, setIsHoveringGrid] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rectRef = React.useRef<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
    setIsHoveringGrid(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) {
      rectRef.current = e.currentTarget.getBoundingClientRect();
    }
    mouseX.set(e.clientX - rectRef.current.left);
    mouseY.set(e.clientY - rectRef.current.top);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    setIsHoveringGrid(false);
  };

  const spotlightBg = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, rgba(239, 68, 68, 0.16), rgba(255, 255, 255, 0.04) 40%, transparent 80%)`;

  const handleCopyEmail = (label: string, value: string) => {
    if (label === 'EMAIL') {
      void copy(value);
    }
  };
  return (
    <Section id="contact" labelledBy="contact-title" containerClassName="z-20">
      {/* Closing CTA: a centred, larger variant of the section header (narrower measure, no rule).
          Scroll reveals are CSS (globals.css .reveal): visible by default, so the static HTML never hides. */}
      <div className="max-w-4xl mx-auto text-center relative z-20">
        <div className="reveal mb-6 md:mb-12">
          <Eyebrow className="mb-3">[ 05 {'//'} CONTACT ]</Eyebrow>
          <h2 id="contact-title" className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-6 text-white">LET'S WORK TOGETHER</h2>
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Currently available for full-time software engineering roles and select freelance opportunities.
          </p>
        </div>

        <div
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="reveal grid md:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden mb-12 shadow-2xl relative group/grid"
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
                className="block bg-background p-8 transition-colors group relative cursor-pointer"
              >
                {/* Single Shared Sliding Highlight Pill */}
                {isHovered && (
                  <m.div
                    layoutId="contact-card-highlight"
                    transition={SPRING_SNAPPY}
                    className="absolute inset-0 bg-neutral-900 border border-border-strong/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.5)] z-0 pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-accent-brand/50 to-transparent" />
                  </m.div>
                )}

                <div className="relative z-10">
                  <div className={`transition-all duration-200 mb-4 flex justify-center ${isHovered ? 'text-white scale-110' : 'text-neutral-500'}`}>
                    {contact.icon}
                  </div>
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-2">
                    {contact.label} 
                    {contact.label === 'EMAIL' && copyStatus === 'copied' && <span className="text-emerald-400 ml-2 animate-pulse">(COPIED)</span>}
                  </div>
                  <div className={`font-mono text-sm transition-colors duration-200 ${isHovered ? 'text-accent-brand-hover' : 'text-white'}`}>
                    {contact.value}
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="reveal flex flex-col md:flex-row gap-4 justify-center items-center">
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
        </div>

        <div className="reveal mt-8">
          <Link
            href="/freelance"
            className="group inline-flex items-center gap-2 font-mono text-sm text-neutral-300 hover:text-white underline underline-offset-4 decoration-neutral-700 hover:decoration-accent-brand transition-colors"
          >
            Freelance work <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </div>

      </div>
    </Section>
  );
};

export default Contact;
export { Contact };
