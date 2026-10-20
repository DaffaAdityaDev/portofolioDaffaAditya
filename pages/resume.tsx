import React from 'react';
import Seo from '@/components/Seo';
import Container from '@/components/ui/Container';
import { lazyOnView } from '@/components/LazyOnView';
import ResumeHeader from '@/features/Resume/components/ResumeHeader';
import ResumeExperience from '@/features/Resume/components/ResumeExperience';
import { RESUME_URL, DOWNLOAD_URL } from '@/features/Resume/constants';

// Below the fold (the sidebar on phones; beside the experience on lg, where its static HTML shows
// at once and the small chunk loads right away). The wrapper carries the sidebar's grid column.
const ResumeSidebar = lazyOnView(() => import('@/features/Resume/components/ResumeSidebar'), {
  className: 'lg:col-span-4 xl:col-span-3',
});
const ResumePdf = lazyOnView(() => import('@/features/Resume/components/ResumePdf'));

const ResumePage = () => {
  return (
    <>
      <Seo
        path="/resume"
        title="Resume"
        description="Resume of Daffa Aditya, Software Engineer in Jakarta, Indonesia: experience, skills and contact, with a downloadable PDF."
      />

      {/* No JS entrance: the header and experience are the LCP, so they paint with the server HTML. */}
      <div className="min-h-screen bg-background pt-24 md:pt-28 pb-20 relative overflow-hidden">
        {/* Background Grain Effect */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('/svg/noise.svg')]"></div>

        <Container className="relative z-10">
          <ResumeHeader downloadUrl={DOWNLOAD_URL} />

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-8 xl:col-span-9 space-y-16 lg:order-2">
              <ResumeExperience />
              <ResumePdf resumeUrl={RESUME_URL} downloadUrl={DOWNLOAD_URL} />
            </div>
            <ResumeSidebar />
          </div>
        </Container>
      </div>
    </>
  );
};

export default ResumePage;
