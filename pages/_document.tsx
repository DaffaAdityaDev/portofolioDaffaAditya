import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import { GA_MEASUREMENT_ID } from '../lib/gtag';

export default function Document() {
  return (
    <Html className="scroll-smooth" lang="en">
      <Head>
        {/* Performance: Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* Security and Rendering headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#000000" />
        
        {/* Analytics with performance optimization */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              id="ga-script"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                    transport_type: 'beacon',
                    send_page_view: false
                  });
                `,
              }}
            />
          </>
        )}
      </Head>
      <body className="bg-[#0a0a0a] text-white overflow-x-hidden antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
