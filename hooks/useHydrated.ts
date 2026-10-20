import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False in the static HTML and during hydration, true from the render right after. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
