import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Footer from '@/components/organisms/Footer';
import Marquee from '@/components/atoms/Marquee';
import { MARQUEE_TEXT } from '@/constant/constant';

const Custom404: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | Daffa Aditya</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>

      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-600 selection:text-white overflow-x-hidden relative flex flex-col">
        <main className="flex-1 relative flex flex-col items-center justify-center min-h-[80vh] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.h1 
              className="text-7xl md:text-9xl font-bold tracking-tighter"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              404
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 space-y-4"
            >
              <h2 className="text-xl md:text-2xl text-neutral-400 font-medium tracking-tight">
                Page not found
              </h2>
              <p className="max-w-md mx-auto text-neutral-500 text-sm md:text-base">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-10"
            >
              <Link 
                href="/"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-3 text-sm font-medium tracking-wide text-white transition-all bg-white/5 border border-white/10 rounded-full hover:bg-white/10 overflow-hidden"
              >
                <span className="relative z-10 transition-transform group-hover:-translate-x-1">
                  Return Home
                </span>
                <svg 
                  className="w-4 h-4 relative z-10 transition-all opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </main>

        {/* Footer Marquee */}
        <Marquee text={MARQUEE_TEXT} border={true} type="light" />
        <Footer />
      </div>
    </>
  );
};

export default Custom404;
