import React, { Suspense, lazy, useEffect, useRef, useState, type ComponentType } from 'react';

const IS_SERVER = typeof window === 'undefined';

/** Start loading a little before the block scrolls into view, so it is ready when it arrives. */
const DEFAULT_ROOT_MARGIN = '600px 0px';

interface LazyOnViewOptions {
  /** How far outside the viewport the chunk starts loading (IntersectionObserver rootMargin). */
  rootMargin?: string;
}

/**
 * Component whose HTML is part of the static page but whose JS chunk loads only when it
 * scrolls near the viewport.
 *
 * The static render writes the component inline. In the browser the wrapper hydrates with an
 * empty `dangerouslySetInnerHTML`, which tells React to leave the pre-rendered markup alone,
 * so nothing mismatches and no component JS runs yet. Once the wrapper comes near the viewport
 * the chunk loads, and only after it has arrived does the component replace that markup, in a
 * single commit. Swapping first and loading second would leave an empty box until the network
 * answered.
 *
 * Not a Suspense boundary on the server on purpose: React outlines large boundaries into
 * hidden streamed segments, which would take the HTML out of the static flow.
 */
export function lazyOnView<P extends object>(
  load: () => Promise<{ default: ComponentType<P> }>,
  { rootMargin = DEFAULT_ROOT_MARGIN }: LazyOnViewOptions = {},
) {
  type LoadedModule = { default: ComponentType<P> };
  let preloaded: LoadedModule | undefined;
  const preload = () =>
    load().then((mod) => {
      preloaded = mod;
    });
  // Static render: resolve the module before the page renders, so lazy() returns it synchronously.
  if (IS_SERVER) {
    preload();
  }
  // Resolves synchronously once the module is preloaded, so the swap never suspends.
  const Loaded = lazy(() =>
    preloaded
      ? ({ then: (resolve: (mod: LoadedModule) => void) => resolve(preloaded!) } as unknown as Promise<LoadedModule>)
      : load(),
  );

  const LazyOnView = (props: P) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      let cancelled = false;
      // On failure still swap: lazy() retries the load and the error surfaces as usual.
      const show = () => {
        const swap = () => {
          if (!cancelled) setVisible(true);
        };
        preload().then(swap, swap);
      };

      const el = ref.current;
      if (!el || typeof IntersectionObserver === 'undefined') {
        show();
        return () => {
          cancelled = true;
        };
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            show();
          }
        },
        { rootMargin },
      );
      observer.observe(el);
      return () => {
        cancelled = true;
        observer.disconnect();
      };
    }, []);

    if (IS_SERVER) {
      return (
        <div ref={ref}>
          <Loaded {...props} />
        </div>
      );
    }

    if (!visible) {
      // Keeps the static markup (or stays empty after a client-side navigation) until loaded.
      return <div ref={ref} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: '' }} />;
    }

    return (
      <div ref={ref}>
        <Suspense fallback={null}>
          <Loaded {...props} />
        </Suspense>
      </div>
    );
  };

  return LazyOnView;
}
