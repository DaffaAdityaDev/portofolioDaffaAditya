import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowUpRight, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useHydrated } from '@/hooks/useHydrated';
import ResumeHeading from './ResumeHeading';

const ResumeViewer = dynamic(() => import('./ResumeViewer'), { ssr: false });

interface ResumePdfProps {
  resumeUrl: string;
  downloadUrl: string;
}

// iOS Safari reports pdfViewerEnabled but frames show page 1 only; there the download link is enough.
const canRenderInlinePdf = () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return !isIOS && navigator.pdfViewerEnabled !== false;
};

const ResumePdf: React.FC<ResumePdfProps> = ({ resumeUrl, downloadUrl }) => {
  const [showPreview, setShowPreview] = useState(false);
  // false on the server and during hydration, so both renders match; the real value lands after mount
  const hydrated = useHydrated();
  const inline = hydrated && canRenderInlinePdf();

  // CSS scroll reveal (globals.css .reveal): visible by default, so the static HTML never hides.
  return (
    <section className="reveal space-y-6" aria-labelledby="resume-pdf">
      <ResumeHeading id="resume-pdf">PDF Version</ResumeHeading>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-white underline underline-offset-4 decoration-neutral-600 hover:decoration-white transition-colors"
        >
          <FileText size={16} aria-hidden="true" />
          Download / open PDF
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        {inline && (
          <Button variant="secondary" size="sm" onClick={() => setShowPreview((v) => !v)} aria-expanded={showPreview} className="self-start">
            {showPreview ? 'Hide preview' : 'Show preview'}
          </Button>
        )}
      </div>
      {showPreview && <ResumeViewer resumeUrl={resumeUrl} />}
    </section>
  );
};

export default ResumePdf;
