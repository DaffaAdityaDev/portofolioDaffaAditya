import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FADE_IN_UP_CONTAINER } from '@/constant/animations';
import dynamic from 'next/dynamic';
import { ResumeHeader, ResumeSidebar, useResume } from '@/features/Resume';

const ResumeViewer = dynamic(() => import('@/features/Resume/components/ResumeViewer'), { ssr: false });


const ResumePage = () => {
  const { resumeUrl, downloadUrl, handleBackToHome } = useResume();

  return (
    <>
      <Head>
        <title>Resume | Daffa Aditya Rahman</title>
        <meta name="description" content="Professional resume of Daffa Aditya Rahman - Software Engineer." />
      </Head>

      <motion.div 
        variants={FADE_IN_UP_CONTAINER}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-[#0a0a0a] pt-28 pb-20 px-6 lg:px-20 relative overflow-hidden"
      >
        {/* Background Grain Effect */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Section */}
          <ResumeHeader 
            downloadUrl={downloadUrl} 
            onBackToHome={handleBackToHome} 
          />

          {/* Main Content: Split Layout */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Sidebar: Quick Specs */}
            <ResumeSidebar />

            {/* Document Viewer */}
            <ResumeViewer resumeUrl={resumeUrl} />

          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ResumePage;

