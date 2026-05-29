import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Outfit, Inter } from 'next/font/google';
import { siteConfig } from '../config/metadata.config';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Layout/Navbar';
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import PageTransition from '@/components/Layout/PageTransition';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark">
      <HeroUIProvider>
        <div className={`${inter.variable} ${outfit.variable} font-sans`}>
          <Navbar />
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={router.asPath}>
              <Component {...pageProps} />
            </PageTransition>
          </AnimatePresence>
        </div>
      </HeroUIProvider>
    </NextThemesProvider>
  );
}

export default MyApp;
