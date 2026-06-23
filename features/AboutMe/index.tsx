import React, { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Premium Custom Bezier Ease (Expo Out style)
const EASING = [0.16, 1, 0.3, 1] as const;

// Static configuration for stats grid to prevent allocation on every render
const STATS = [
  { val: "3+", label: "Years Exp" },
  { val: "6+", label: "Projects" },
  { val: "5+", label: "Tech Stacks" },
  { val: "100+", label: "Cup of Coffee" }
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
    <motion.section
      id="about"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative py-20 px-6 lg:px-20 border-t border-neutral-800 bg-transparent overflow-hidden"
    >
      <motion.div
        variants={headingVariants}
        className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-800 pb-4 gap-4"
      >
        <div>
          <h2 className="text-sm font-mono text-zinc-500 mb-2">/// SECTION_01</h2>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">About Me</h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
        {/* Profile Image Column */}
        <motion.div
          variants={imageContainerVariants}
          className="lg:col-span-4 flex flex-col items-center lg:items-start relative"
        >
          <motion.div
            className="w-full max-w-sm aspect-3/4 relative border border-neutral-800 p-2 bg-neutral-900/20 cursor-pointer group"
            whileHover="hover"
          >
            <div className="absolute inset-0 bg-neutral-800/10 z-10 opacity-50 mix-blend-overlay"></div>
            <div className="relative w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden">
              <motion.div
                className="w-full h-full relative"
                variants={{
                  hover: { scale: 1.04 }
                }}
                transition={{ duration: 0.8, ease: EASING }}
              >
                <Image
                  src="/image/Profile.jpg"
                  alt="Daffa Aditya Rahman"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            </div>

            {/* Interactive Decorative corners */}
            <motion.div
              custom={0}
              variants={cornerVariants}
              className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"
            />
            <motion.div
              custom={1}
              variants={cornerVariants}
              className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white"
            />
            <motion.div
              custom={2}
              variants={cornerVariants}
              className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white"
            />
            <motion.div
              custom={3}
              variants={cornerVariants}
              className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"
            />
          </motion.div>

          <div className="mt-6 w-full font-mono text-xs text-neutral-500 uppercase flex justify-between border-t border-neutral-800 pt-3">
            <span>STATUS: ACTIVE</span>
            <span>LOC: JAKARTA_ID</span>
          </div>
        </motion.div>

        {/* Narrative & Stats Column */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-8">
          <motion.div variants={containerVariants}>
            <motion.h3
              variants={headingVariants}
              className="text-2xl font-black text-white uppercase mb-2"
            >
              The Journey
            </motion.h3>

            {/* Divider scale animation */}
            <motion.div
              variants={lineVariants}
              style={{ originX: 0 }}
              className="h-px w-12 bg-white/50 mb-6"
            />

            <div className="space-y-6">
              <motion.p
                variants={textParagraphVariants}
                className="text-neutral-400 text-base lg:text-lg leading-relaxed font-mono"
              >
                My journey into programming began in 2019, sparked by a friend's recommendation to take Harvard's CS50 course. What started as self-taught curiosity quickly evolved into a dedicated career. I formalized this passion by pursuing a Software Engineering degree, consistently pushing myself to learn beyond the classroom.
              </motion.p>
              <motion.p
                variants={textParagraphVariants}
                className="text-neutral-400 text-base lg:text-lg leading-relaxed font-mono"
              >
                Since then, I've had the privilege of training under Google's Bangkit Academy, building government application systems, and developing SaaS platforms for IT companies. Today, as a Software Engineer, my focus is on delivering cutting-edge technologies while maintaining high maintainability and scalability.
              </motion.p>
              <motion.p
                variants={textParagraphVariants}
                className="text-neutral-400 text-base lg:text-lg leading-relaxed font-mono"
              >
                Outside of my core work, I actively take on freelance projects and continuously learn and experiment with new technologies.
              </motion.p>
            </div>
          </motion.div>

          {/* Interactive Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-neutral-800/50">
            {STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                variants={statCardVariants}
                whileHover={{
                  y: -6,
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  backgroundColor: 'rgba(23, 23, 23, 0.5)',
                  boxShadow: '0 10px 30px -15px rgba(0,0,0,0.8)'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-6 bg-neutral-900/30 border border-neutral-800 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-300"
              >
                <span className="block text-3xl font-black text-white mb-1">{stat.val}</span>
                <span className="text-xs font-mono text-neutral-500 uppercase">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default AboutMe;


