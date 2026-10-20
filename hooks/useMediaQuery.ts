import { useCallback, useSyncExternalStore } from 'react';

// One MediaQueryList per query, shared by every subscriber and snapshot read instead of a new
// matchMedia() call on each render.
const lists = new Map<string, MediaQueryList>();
const getList = (query: string): MediaQueryList => {
  let list = lists.get(query);
  if (!list) {
    list = window.matchMedia(query);
    lists.set(query, list);
  }
  return list;
};

/**
 * Whether a CSS media query matches, safe to branch the markup on.
 *
 * The server cannot evaluate media queries, so it renders with `serverDefault`. The first client
 * render uses the same value, and React re-renders with the real one right after hydrating, so the
 * HTML never mismatches.
 */
export function useMediaQuery(query: string, serverDefault: boolean): boolean {
  // Stable per query: useSyncExternalStore resubscribes whenever the subscribe function changes.
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = getList(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => getList(query).matches,
    () => serverDefault,
  );
}
