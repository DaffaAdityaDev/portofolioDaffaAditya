import React from 'react';
import Seo from '@/components/Seo';
import { m } from 'framer-motion';
import { FADE_IN_UP_CONTAINER } from '@/constant/animations';
import ResumeHeader from '@/features/Resume/components/ResumeHeader';
import ResumeSidebar from '@/features/Resume/components/ResumeSidebar';
import ResumeExperience from '@/features/Resume/components/ResumeExperience';
import ResumePdf from '@/features/Resume/components/ResumePdf';
import { useResume } from '@/features/Resume/hooks/useResume';

const ResumePage = () => {
  const { resumeUrl, downloadUrl } = useResume();

  return (
    <>
      <Seo
        path="/resume"
        title="Resume | Daffa Aditya"
        description="Resume of Daffa Aditya, Software Engineer in Jakarta, Indonesia: experience, skills and contact, with a downloadable PDF."
      />

      <m.div
        variants={FADE_IN_UP_CONTAINER}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-[#0a0a0a] pt-36 md:pt-40 pb-20 px-6 lg:px-20 relative overflow-hidden"
      >
        {/* Background Grain Effect */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('/svg/noise.svg')]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <ResumeHeader downloadUrl={downloadUrl} />

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8 xl:col-span-9 space-y-16 lg:order-2">
              <ResumeExperience />
              <ResumePdf resumeUrl={resumeUrl} downloadUrl={downloadUrl} />
            </div>
            <ResumeSidebar />
          </div>
        </div>
      </m.div>
    </>
  );
};

export default ResumePage;
