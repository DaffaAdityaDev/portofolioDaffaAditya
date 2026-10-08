import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const getSnapshot = (): boolean => window.matchMedia(REDUCED_MOTION_QUERY).matches;

/** The server cannot know the preference, so it renders as if motion is allowed. */
const getServerSnapshot = (): boolean => false;

/**
 * Whether the user asked for reduced motion, safe to branch the markup on.
 *
 * framer-motion's own `useReducedMotion` reads the preference during the first
 * client render, while the server rendered without it. Anything that renders
 * different HTML for the two values then fails to hydrate for exactly the users
 * who enabled the setting. Here the first client render uses the same value as
 * the server, and React re-renders with the real one right after hydrating.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
