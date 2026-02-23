import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import * as gtag from '../lib/gtag'
import { siteConfig } from '../config/metadata.config';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/organisms/Navbar';
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import PageTransition from '@/components/molecules/PageTransition';

function MyApp({ Component, pageProps, router }: AppProps) {

  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider>
        <>
            <Head>
              <title>{siteConfig.title}</title>
              <meta name="description" content={siteConfig.description} />
              <meta property="og:title" content={siteConfig.title} />
              <meta property="og:description" content={siteConfig.description} />
              <meta property="og:image" content={siteConfig.ogImage} />
              <meta property="og:url" content={siteConfig.url} />
              <link rel="icon" href="/svg/selflogo.svg" />
            </Head>
            
            <Navbar />
            <AnimatePresence mode="wait" initial={false}>
              <PageTransition key={router.asPath} >
                <Component {...pageProps} />
              </PageTransition>
            </AnimatePresence>

          </>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}

export default MyApp;
