/** Expo-out bezier: fast start, long soft landing. The site's default ease. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Tween durations in seconds. */
export const DURATION = {
  fast: 0.35,
  base: 0.8,
} as const;

// Scroll reveals are CSS, not framer: `.reveal` / `.reveal-stagger` in styles/globals.css keep the
// static HTML visible without JS. Framer is for interactions: hover, morphs, presence.

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

export const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

export const SPRING_COUNTER = {
  stiffness: 120,
  damping: 24,
  mass: 0.6,
};
