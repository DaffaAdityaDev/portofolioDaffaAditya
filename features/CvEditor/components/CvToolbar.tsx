import React from 'react';
import { cn } from '@/utils/cn';
import { AUTO_COMPILE_DELAY_MS, isPublishable, PUBLISHABLE_MAINS } from '../constants';
import type { CvCompileStatus, CvPublishResult, CvPublishStatus } from '../types';

const buttonClass =
  'inline-flex min-h-9 items-center border px-3 font-mono text-[11px] font-semibold uppercase tracking-widest transition-colors disabled:cursor-not-allowed disabled:opacity-40';

const STATUS_LABEL: Record<CvCompileStatus, string> = {
  idle: 'Idle',
  compiling: 'Compiling…',
  ok: 'Compiled',
  error: 'Error',
};

const STATUS_DOT: Record<CvCompileStatus, string> = {
  idle: 'bg-neutral-600',
  compiling: 'bg-amber-400 animate-pulse',
  ok: 'bg-emerald-400',
  error: 'bg-red-500',
};

interface CvToolbarProps {
  mains: string[];
  main: string;
  onMainChange: (main: string) => void;
  dirtyCount: number;
  compileStatus: CvCompileStatus;
  compileMs: number | null;
  onCompile: () => void;
  autoCompile: boolean;
  onToggleAutoCompile: () => void;
  pdfUrl: string | null;
  publishStatus: CvPublishStatus;
  published: CvPublishResult | null;
  onPublish: () => void;
}

const CvToolbar: React.FC<CvToolbarProps> = ({
  mains,
  main,
  onMainChange,
  dirtyCount,
  compileStatus,
  compileMs,
  onCompile,
  autoCompile,
  onToggleAutoCompile,
  pdfUrl,
  publishStatus,
  published,
  onPublish,
}) => {
  const publishable = isPublishable(main);
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-neutral-800 px-4 py-3">
      <h1 className="mr-2 font-mono text-xs font-bold uppercase tracking-widest text-white">
        <span className="text-red-500">/</span>cv editor
      </h1>

      <label className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
        Main
        <select
          value={main}
          onChange={(e) => onMainChange(e.target.value)}
          className="min-h-9 border border-neutral-800 bg-[#0a0a0a] px-2 font-mono text-xs normal-case tracking-normal text-white focus:border-red-500 focus:outline-none"
        >
          {mains.map((path) => (
            <option key={path} value={path}>
              {path}
            </option>
          ))}
        </select>
      </label>

      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
        <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[compileStatus])} />
        {STATUS_LABEL[compileStatus]}
        {compileMs !== null && compileStatus !== 'compiling' && <span className="text-neutral-600">{(compileMs / 1000).toFixed(1)}s</span>}
        {autoCompile && <span className="text-red-400">auto</span>}
      </span>

      {dirtyCount > 0 && <span className="font-mono text-[10px] uppercase tracking-widest text-red-400">{dirtyCount} unsaved</span>}

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCompile}
          disabled={!main || compileStatus === 'compiling'}
          title="Save and compile (Ctrl+S)"
          className={cn(buttonClass, 'border-red-500 bg-red-500 text-black hover:bg-red-400')}
        >
          Compile <span className="ml-2 font-normal opacity-60">Ctrl+S</span>
        </button>
        <button
          type="button"
          onClick={onToggleAutoCompile}
          aria-pressed={autoCompile}
          title={`Save and compile ${AUTO_COMPILE_DELAY_MS / 1000} s after you stop typing`}
          className={cn(
            buttonClass,
            'gap-2',
            autoCompile ? 'border-red-500 text-red-400 hover:text-red-300' : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-white'
          )}
        >
          <span aria-hidden className={cn('h-1.5 w-1.5 rounded-full', autoCompile ? 'bg-red-500' : 'bg-neutral-700')} />
          Auto
        </button>
        {pdfUrl ? (
          <a
            href={pdfUrl}
            download={main.replace(/\.tex$/, '.pdf')}
            className={cn(buttonClass, 'border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white')}
          >
            Download
          </a>
        ) : (
          <button type="button" disabled className={cn(buttonClass, 'border-neutral-800 text-neutral-300')}>
            Download
          </button>
        )}
        <button
          type="button"
          onClick={onPublish}
          disabled={!publishable || publishStatus === 'publishing'}
          title={
            publishable
              ? "Compile and write the site's resume PDF and features/Resume/resumePdf.ts"
              : `Only ${PUBLISHABLE_MAINS.join(', ')} can be published`
          }
          className={cn(buttonClass, 'border-neutral-800 text-neutral-300 hover:border-red-500 hover:text-white')}
        >
          {publishStatus === 'publishing' ? 'Publishing…' : 'Publish'}
        </button>
      </div>

      {published && publishStatus === 'done' && (
        <p className="w-full font-mono text-[11px] text-emerald-400">
          Published {published.path} <span className="text-neutral-500">hash</span> {published.hash}
        </p>
      )}
    </header>
  );
};

export default CvToolbar;
