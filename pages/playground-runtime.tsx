import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { startPlaygroundRuntime } from '@/features/Blog/components/ReactPlayground/runtime';

/**
 * Preview runtime for the blog's live React editor. The post page loads it in a
 * sandboxed iframe and posts code to it. Rendered without the site shell (see
 * BARE_PAGE_ROUTES), left out of the sitemap, and marked noindex.
 */
export default function PlaygroundRuntimePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => (rootRef.current ? startPlaygroundRuntime(rootRef.current) : undefined), []);

  return (
    <>
      <Head>
        <title>Live editor preview</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div id="root" ref={rootRef} />
    </>
  );
}
