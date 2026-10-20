import React from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import { projectsData } from '@/features/Projects/constants';
import { ENGAGEMENTS } from '@/features/Projects/engagements';
import { diagnosticStack } from '@/features/TechStack/constants';
import { DURATION, EASE_OUT_EXPO } from '@/constant/animations';
import { experienceYears } from '@/utils/experience';
import Section from '@/components/ui/Section';
import SectionHeader from '@/components/ui/SectionHeader';

// Companies and clients I have shipped work for: every case study except side projects.
const companiesAndClients = ENGAGEMENTS.filter((e) => e.kind !== 'side').length;

// Dynamic calculations computed at SSG build time to keep the page completely static & SEO-optimized
const rawTechStacks = diagnosticStack.reduce(
  (acc, module) => acc + (module.processes?.length || 0),
  0
);
// Clean rounded milestone benchmark (e.g., 41/42 -> 40+)
const roundedTechStacks = Math.floor(rawTechStacks / 5) * 5;

const STATIC_STATS = [
  { val: `${projectsData.length}+`, label: "Projects" },
  { val: `${roundedTechStacks}+`, label: "Tech Stacks" },
  { val: `${companiesAndClients}`, label: "Companies & Clients" }
] as const;

// Corner brackets: resting offsets (also the static HTML) and the hover spread.
const cornerVariants = {
  visible: (i: number) => {
    const offsets = [
      { x: -4, y: -4 },
      { x: 4, y: -4 },
      { x: -4, y: 4 },
      { x: 4, y: 4 },
    ];
    return {
      x: offsets[i].x,
      y: offsets[i].y,
      opacity: 0.5,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 14,
      },
    };
  },
  hover: (i: number) => {
    const hoverOffsets = [
      { x: -8, y: -8 },
      { x: 8, y: -8 },
      { x: -8, y: 8 },
      { x: 8, y: 8 },
    ];
    return {
      x: hoverOffsets[i].x,
      y: hoverOffsets[i].y,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 280,
        damping: 16,
      },
    };
  },
};


const AboutMe = () => {
  // Same start date as the hero ticker: counted from the first internship (2023). Read in render,
  // not at module load, so an open tab never keeps a stale count. AboutMe mounts through
  // lazyOnView, which swaps in a fresh client render instead of hydrating the static HTML,
  // so the visitor's count never has to match the build-time one.
  const years = experienceYears();
  const stats = [{ val: `${Math.max(1, years)}+`, label: "Years Exp" }, ...STATIC_STATS];

  // Scroll reveals are CSS (globals.css .reveal): visible by default, so the static HTML never hides.
  return (
    <Section id="about" labelledBy="about-title" className="overflow-hidden" containerClassName="z-20">
      <div className="reveal">
        <SectionHeader id="about-title" index="01" label="ABOUT" title="About Me" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 lg:gap-8">
        {/* Profile Image Column */}
        <div className="reveal lg:col-span-4 flex flex-col items-center lg:items-start relative">
          <m.div
            className="w-full max-w-sm aspect-3/4 relative rounded-lg border border-border p-2 bg-surface-1 cursor-pointer group"
            // Starts at rest (no entrance), so the corners are in place in the static HTML.
            initial={false}
            animate="visible"
            whileHover="hover"
          >
            <div className="absolute inset-0 rounded-lg bg-neutral-800/10 z-10 opacity-50 mix-blend-overlay"></div>
            <div className="relative w-full h-full rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
              <m.div
                className="w-full h-full relative"
                variants={{
                  hover: { scale: 1.04 }
                }}
                transition={{ duration: DURATION.base, ease: EASE_OUT_EXPO }}
              >
                <Image
                  src="/image/profile-768.webp"
                  alt="Daffa Aditya"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 640px) 100vw, 384px"
                />
              </m.div>
            </div>

            {/* Interactive Decorative corners */}
            <m.div
              custom={0}
              variants={cornerVariants}
              className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"
            />
            <m.div
              custom={1}
              variants={cornerVariants}
              className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white"
            />
            <m.div
              custom={2}
              variants={cornerVariants}
              className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white"
            />
            <m.div
              custom={3}
              variants={cornerVariants}
              className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"
            />
          </m.div>

          <div className="mt-6 w-full font-mono text-xs text-neutral-500 uppercase flex justify-between border-t border-border pt-3">
            <span>STATUS: ACTIVE</span>
            <span>LOC: JAKARTA_ID</span>
          </div>
        </div>

        {/* Narrative & Stats Column */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-8">
          <div>
            <h3 className="reveal text-2xl font-black text-white uppercase mb-2">
              The Journey
            </h3>

            {/* Divider draws its width in on scroll */}
            <div className="reveal-draw h-px w-12 bg-white/50 mb-6" />

            <div className="space-y-6">
              <p className="reveal text-neutral-300 text-base lg:text-lg leading-relaxed font-sans">
                My journey into programming began in 2019, sparked by a friend's recommendation to take Harvard's CS50 course. What started as self-taught curiosity quickly evolved into a dedicated career. I formalized this passion with a Software Engineering degree (S.Kom, 2024) from Universitas Bina Sarana Informatika, and I keep learning beyond the classroom.
              </p>
              <p className="reveal text-neutral-300 text-base lg:text-lg leading-relaxed font-sans">
                Since then I went through Google's Bangkit Academy, led the intern team that shipped an office and inventory management system for Ombudsman RI, built a corporate website and HR portal at QQTech, and worked on Accounting+ and an enterprise low-code platform at Run System. Today I am a Frontend Engineer placed by Lawencon at PNM in Jakarta, in the Innovation division, where I modernize internal systems with React and Next.js and work on the shared component library, CI and automated tests.
              </p>
              <p className="reveal text-neutral-300 text-base lg:text-lg leading-relaxed font-sans">
                Outside my main job I take freelance projects, such as a studio website for Artifyo and a tuition ledger for a school with 500+ students, and I write about what I learn on the blog.
              </p>
            </div>
          </div>

          {/* Interactive Stats Grid: the tiles reveal in sequence (globals.css .reveal-stagger) */}
          <div className="reveal-stagger grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border/50">
            {stats.map((stat, idx) => (
              <m.div
                key={idx}
                // Only the lift goes through framer; hover colours live in classes so no inline
                // styles linger and override the design tokens after a design switch.
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-6 rounded-lg bg-surface-1 border border-border hover:bg-neutral-900/50 hover:border-border-strong hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center cursor-pointer transition-[color,background-color,border-color,box-shadow] duration-300"
              >
                <span className="block text-3xl font-black text-white mb-1">{stat.val}</span>
                <span className="text-xs font-mono text-neutral-500 uppercase">{stat.label}</span>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AboutMe;


