import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <Head>
          <title>Daffa Aditya Rahman</title>
          <meta name="description" content="Daffa Aditya Personal Website" />
          <meta property="og:title" content="Daffa Aditya Rahman" />
          <meta property="og:description" content="Daffa Aditya Personal Website" />
          <meta property="og:image" content="/image/Profile.jpg" />
          <meta property="og:url" content="https://daffaaditya.id" />
          <link rel="icon" href="/svg/selflogo.svg" />
        </Head>
        <Component {...pageProps} />
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default MyApp;
