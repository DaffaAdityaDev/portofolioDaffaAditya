export const FADE_IN_UP_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const FADE_IN_UP_ITEM = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const FADE_IN_SCALE = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 1.2, 
      delay: 0.6, 
      ease: [0.16, 1, 0.3, 1] as const 
    },
  },
};

// Fluid Modern Mobile OS Spring Physics (iOS App expansion / FLIP)
export const SPRING_MOBILE_OS = {
  type: "spring" as const,
  stiffness: 350,
  damping: 32,
  mass: 0.85,
};

export const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 450,
  damping: 35,
};

export const SPRING_GENTLE = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
};

export const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

