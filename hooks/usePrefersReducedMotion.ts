import { useMediaQuery } from './useMediaQuery';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Whether the user asked for reduced motion, safe to branch the markup on.
 *
 * framer-motion's own `useReducedMotion` reads the preference during the first
 * client render, while the server rendered without it. Anything that renders
 * different HTML for the two values then fails to hydrate for exactly the users
 * who enabled the setting. Here the first client render uses the same value as
 * the server (motion allowed), and React re-renders with the real one right after hydrating.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY, false);
}
