import { useSyncExternalStore } from 'react';
import { replaceUrl } from '@/utils/url';

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

/**
 * The URL hash without "#", and a setter that rewrites it in place. Empty in the static HTML and
 * during hydration, so server and client render the same thing first.
 */
export function useLocationHash(): [string, (hash: string) => void] {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash.slice(1), () => '');

  const setHash = (next: string) => {
    const url = next ? `#${next}` : window.location.pathname + window.location.search;
    replaceUrl(url);
    // replaceState fires no event of its own.
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  return [hash, setHash];
}
