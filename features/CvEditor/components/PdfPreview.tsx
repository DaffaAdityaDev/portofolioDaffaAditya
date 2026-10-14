import React from 'react';
import type { CvCompileStatus } from '../types';

interface PdfPreviewProps {
  pdfUrl: string | null;
  status: CvCompileStatus;
}

/** The last PDF that compiled, shown by the browser's own viewer. */
const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfUrl, status }) => {
  if (!pdfUrl) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-neutral-600">
        {status === 'compiling' ? 'Compiling…' : 'No PDF yet'}
      </div>
    );
  }
  return <iframe title="Compiled PDF" src={`${pdfUrl}#view=FitH`} className="h-full w-full border-0 bg-neutral-900" />;
};

export default PdfPreview;
