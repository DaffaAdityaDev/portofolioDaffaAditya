import React from 'react';

interface ResumeViewerProps {
  resumeUrl: string;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ resumeUrl }) => {
  return (
    <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900">
      <div className="relative bg-neutral-900 h-[700px] md:h-[1000px] w-full">
        <div className="absolute inset-0 flex items-center justify-center text-neutral-500 font-mono text-sm z-0">
          Loading PDF preview...
        </div>
        <iframe
          src={resumeUrl}
          title="Daffa Aditya resume (PDF preview)"
          loading="lazy"
          className="w-full h-full relative z-10 border-none"
          allow="autoplay"
        ></iframe>
      </div>
    </div>
  );
};

export default ResumeViewer;
