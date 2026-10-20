import { Html, Head, Main, NextScript, type DocumentProps } from 'next/document';
import Script from 'next/script';
import { BARE_PAGE_ROUTES } from '@/constant/constant';
import { GA_MEASUREMENT_ID } from '../lib/gtag';

export default function Document({ __NEXT_DATA__ }: DocumentProps) {
  // Bare pages (the playground preview iframe) get no analytics and no site styling on <body>.
  if (__NEXT_DATA__?.page && BARE_PAGE_ROUTES.includes(__NEXT_DATA__.page)) {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

  return (
    // The site is dark-only: one palette in globals.css, and colorScheme dark for native controls and scrollbars.
    <Html className="scroll-smooth" lang="en" style={{ colorScheme: 'dark' }}>
      <Head>
        {/* Security and Rendering headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/svg/selflogo.svg" type="image/svg+xml" />
        {/* Points LLMs and agents at the plain-text summary of the site (lib/llms.ts). */}
        <link rel="alternate" type="text/markdown" href="/llms.txt" title="LLM-readable summary" />

        {/* Analytics with performance optimization */}
        {GA_MEASUREMENT_ID && (
          <>
            {/* DNS only: the GA script loads lazyOnload, so a full preconnect would spend a TLS
                handshake during the critical load on a request made long after it. */}
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
            {/* Sends the first page view. Client-side navigations are counted by GA4 Enhanced
                Measurement ("page changes based on browser history events", on by default), so
                _app does not send its own, which would count every navigation twice. */}
            <Script
              id="ga-script"
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    transport_type: 'beacon'
                  });
                `,
              }}
            />
          </>
        )}
      </Head>
      <body className="bg-background text-white overflow-x-hidden antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
