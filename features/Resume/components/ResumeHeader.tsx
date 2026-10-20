import React from 'react';
import { Download } from 'lucide-react';
import BackLink from '@/components/ui/BackLink';
import { buttonClasses } from '@/components/ui/Button';
import PageTitle from '@/components/ui/PageTitle';
import { IDENTIFICATION, RESUME_FILE_NAME } from '../constants';

interface ResumeHeaderProps {
  downloadUrl: string;
}

const ResumeHeader: React.FC<ResumeHeaderProps> = ({ downloadUrl }) => {
  return (
    <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
      {/* No entrance animation: this is the LCP block, so it paints with the server HTML. */}
      <div className="lg:col-span-8">
        <BackLink href="/" className="mb-8">
          Back to home
        </BackLink>

        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
          <PageTitle size="xl" className="mb-2">
            Resume<span className="text-accent-brand">.</span>
          </PageTitle>
          <div className="flex flex-col border-l border-border pl-6 py-1">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">Status</span>
            <span className="text-sm md:text-base font-bold text-neutral-200 uppercase tracking-tight">
              Open to work <br />
              & Freelance
            </span>
          </div>
        </div>

        <p className="mt-8 text-lg md:text-xl font-bold text-neutral-200 tracking-tight">
          {IDENTIFICATION.name}
          <span className="text-neutral-500 font-medium"> / {IDENTIFICATION.role} / {IDENTIFICATION.location}</span>
        </p>
      </div>

      <div className="lg:col-span-4 flex justify-start lg:justify-end">
        <a
          href={downloadUrl}
          download={RESUME_FILE_NAME}
          className={buttonClasses({ variant: 'primary', size: 'lg', className: 'group relative overflow-hidden' })}
        >
          {/* Accent wipe from the bottom on hover, clipped to the rounded corners */}
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-y-full bg-accent-brand transition-transform duration-300 ease-out-expo group-hover:translate-y-0 motion-reduce:transition-none"
          />
          <Download size={18} className="relative z-10 group-hover:text-white transition-colors" />
          <span className="relative z-10 group-hover:text-white transition-colors">Download PDF</span>
        </a>
      </div>
    </div>
  );
};

export default ResumeHeader;
