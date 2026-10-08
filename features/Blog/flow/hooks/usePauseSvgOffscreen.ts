import { useEffect, type RefObject } from 'react';

/**
 * Pauses the SMIL animations (the moving dots) of the SVG that contains `ref` while it is off
 * screen. They repeat forever, so on a long post they would otherwise keep running for
 * every diagram the reader has scrolled past.
 */
export function usePauseSvgOffscreen(ref: RefObject<SVGElement | null>) {
  useEffect(() => {
    const node = ref.current;
    const svg = node instanceof SVGSVGElement ? node : node?.ownerSVGElement;
    if (!svg || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (entry.isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
    observer.observe(svg);
    return () => {
      observer.disconnect();
      svg.unpauseAnimations();
    };
  }, [ref]);
}
