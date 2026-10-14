import React, { useState, useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { m } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import { FADE_IN_UP_ITEM } from '@/constant/animations';

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

const noopSubscribe = () => () => {};

const HEADING = 'text-xs font-mono text-neutral-500 uppercase tracking-[0.3em] border-b border-neutral-800 pb-2 font-bold';

const ResumePdf: React.FC<ResumePdfProps> = ({ resumeUrl, downloadUrl }) => {
  const [showPreview, setShowPreview] = useState(false);
  // false on the server and during hydration, so both renders match; the real value lands after mount
  const inline = useSyncExternalStore(noopSubscribe, canRenderInlinePdf, () => false);

  return (
    <m.section variants={FADE_IN_UP_ITEM} className="space-y-6" aria-labelledby="resume-pdf">
      <h2 id="resume-pdf" className={HEADING}>PDF Version</h2>
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
          <button
            type="button"
            onClick={() => setShowPreview((v) => !v)}
            aria-expanded={showPreview}
            className="inline-flex items-center self-start px-4 py-2 border border-neutral-800 text-xs font-mono uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
          >
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
        )}
      </div>
      {showPreview && <ResumeViewer resumeUrl={resumeUrl} />}
    </m.section>
  );
};

export default ResumePdf;
