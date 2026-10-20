import React from 'react';
import { Download } from 'lucide-react';
import type { CvCompileStatus } from '../types';

interface PdfPreviewProps {
  pdfUrl: string | null;
  /** File name for the download link; blob: URLs carry no name of their own. */
  pdfName: string | null;
  status: CvCompileStatus;
}

/** The last PDF that compiled, shown by the browser's own viewer, with a properly named download. */
const PdfPreview: React.FC<PdfPreviewProps> = ({ pdfUrl, pdfName, status }) => {
  if (!pdfUrl) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-xs uppercase tracking-widest text-neutral-600">
        {status === 'compiling' ? 'Compiling…' : 'No PDF yet'}
      </div>
    );
  }
  return (
    <div className="relative h-full w-full">
      <iframe title="Compiled PDF" src={`${pdfUrl}#view=FitH`} className="h-full w-full border-0 bg-neutral-900" />
      <a
        href={pdfUrl}
        download={pdfName ?? undefined}
        className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2/90 px-3 py-2 font-mono text-2xs uppercase tracking-widest text-white backdrop-blur hover:border-border-strong"
      >
        <Download size={14} aria-hidden="true" />
        {pdfName ?? 'Download'}
      </a>
    </div>
  );
};

export default PdfPreview;
