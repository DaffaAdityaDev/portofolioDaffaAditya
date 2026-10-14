import React, { memo } from 'react';
import Image from 'next/image';
import { m } from 'framer-motion';
import { projectsData } from '@/features/Projects/constants';
import { ENGAGEMENTS } from '@/features/Projects/engagements';
import { diagnosticStack } from '@/features/TechStack/constants';
import { experienceYears } from '@/features/Hero/components/ExperienceTicker';

// Premium Custom Bezier Ease (Expo Out style)
const EASING = [0.16, 1, 0.3, 1] as const;

// Same start date and label as the hero ticker: counted from the first internship (2023).
const calculatedYears = experienceYears();

// Companies and clients I have shipped work for: every case study except side projects.
const companiesAndClients = ENGAGEMENTS.filter((e) => e.kind !== 'side').length;

// Dynamic calculations computed at SSG build time to keep the page completely static & SEO-optimized
const rawTechStacks = diagnosticStack.reduce(
  (acc, module) => acc + (module.processes?.length || 0),
  0
);
// Clean rounded milestone benchmark (e.g., 41/42 -> 40+)
const roundedTechStacks = Math.floor(rawTechStacks / 5) * 5;

const STATS = [
  { val: `${Math.max(1, calculatedYears)}+`, label: "Years Exp" },
  { val: `${projectsData.length}+`, label: "Projects" },
  { val: `${roundedTechStacks}+`, label: "Tech Stacks" },
  { val: `${companiesAndClients}`, label: "Companies & Clients" }
] as const;

// Staggered Container for section entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Mask/Slide Reveal for headings
const headingVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: EASING,
    },
  },
};

// Width draw for horizontal dividers
const lineVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1,
      ease: EASING,
      delay: 0.2,
    },
  },
};

// Container slide-in for profile image
const imageContainerVariants = {
  hidden: { opacity: 0, y: 45 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: EASING,
    },
  },
};

// Corner brackets coordinate animations for entrance and hover
const cornerVariants = {
  hidden: (i: number) => {
    const directions = [
      { x: -12, y: -12 }, // Top-Left
      { x: 12, y: -12 },  // Top-Right
      { x: -12, y: 12 },  // Bottom-Left
      { x: 12, y: 12 },   // Bottom-Right
    ];
    return { ...directions[i], opacity: 0 };
  },
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
        delay: 0.4,
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


const textParagraphVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASING,
    },
  },
};

const statCardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASING,
      delay: i * 0.08,
    },
  }),
};

const AboutMe = memo(() => {
  return (
    <m.section
      id="about"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative py-10 md:py-20 px-4 sm:px-6 lg:px-20 border-t border-neutral-800 bg-transparent overflow-hidden scroll-mt-20"
    >
      <div className="relative z-20 max-w-7xl mx-auto w-full">
        <m.div
          variants={headingVariants}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 border-b border-zinc-800 pb-3 md:pb-4 gap-4"
        >
          <div>
            <div className="text-xs font-mono text-zinc-500 mb-1 tracking-widest uppercase">
              [ 01 // ABOUT ]
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">About Me</h2>
          </div>
        </m.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 lg:gap-8">
        {/* Profile Image Column */}
        <m.div
          variants={imageContainerVariants}
          className="lg:col-span-4 flex flex-col items-center lg:items-start relative"
        >
          <m.div
            className="w-full max-w-sm aspect-3/4 relative border border-neutral-800 p-2 bg-neutral-900/20 cursor-pointer group"
            whileHover="hover"
          >
            <div className="absolute inset-0 bg-neutral-800/10 z-10 opacity-50 mix-blend-overlay"></div>
            <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
              <m.div
                className="w-full h-full relative"
                variants={{
                  hover: { scale: 1.04 }
                }}
                transition={{ duration: 0.8, ease: EASING }}
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

          <div className="mt-6 w-full font-mono text-xs text-neutral-500 uppercase flex justify-between border-t border-neutral-800 pt-3">
            <span>STATUS: ACTIVE</span>
            <span>LOC: JAKARTA_ID</span>
          </div>
        </m.div>

        {/* Narrative & Stats Column */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-8">
          <m.div variants={containerVariants}>
            <m.h3
              variants={headingVariants}
              className="text-2xl font-black text-white uppercase mb-2"
            >
              The Journey
            </m.h3>

            {/* Divider scale animation */}
            <m.div
              variants={lineVariants}
              style={{ originX: 0 }}
              className="h-px w-12 bg-white/50 mb-6"
            />

            <div className="space-y-6">
              <m.p
                variants={textParagraphVariants}
                className="text-neutral-300 text-base lg:text-lg leading-relaxed font-sans"
              >
                My journey into programming began in 2019, sparked by a friend's recommendation to take Harvard's CS50 course. What started as self-taught curiosity quickly evolved into a dedicated career. I formalized this passion by pursuing a Software Engineering degree, consistently pushing myself to learn beyond the classroom.
              </m.p>
              <m.p
                variants={textParagraphVariants}
                className="text-neutral-300 text-base lg:text-lg leading-relaxed font-sans"
              >
                Since then I went through Google's Bangkit Academy, led the intern team that shipped an inventory system for Ombudsman RI, and built a corporate website and HR portal at QQTech. Today I am a Software Engineer at Run System in Jakarta, where I work on Accounting+ and an enterprise low-code platform, deliver third-party integrations for BUMN and government clients, and mentor interns through code review.
              </m.p>
              <m.p
                variants={textParagraphVariants}
                className="text-neutral-300 text-base lg:text-lg leading-relaxed font-sans"
              >
                Outside my main job I take freelance projects, such as a studio website for Artifyo and a tuition ledger for a school with 500+ students, and I write about what I learn on the blog.
              </m.p>
            </div>
          </m.div>

          {/* Interactive Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-neutral-800/50">
            {STATS.map((stat, idx) => (
              <m.div
                key={idx}
                custom={idx}
                variants={statCardVariants}
                // Only the lift goes through framer; hover colours live in classes so no inline
                // styles linger and override the design tokens after a design switch.
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-6 bg-neutral-900/30 border border-neutral-800 hover:bg-[rgba(23,23,23,0.5)] hover:border-[rgba(255,255,255,0.25)] hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center text-center cursor-pointer transition-[color,background-color,border-color,box-shadow] duration-300"
              >
                <span className="block text-3xl font-black text-white mb-1">{stat.val}</span>
                <span className="text-xs font-mono text-neutral-500 uppercase">{stat.label}</span>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </m.section>
  );
});

export default AboutMe;


