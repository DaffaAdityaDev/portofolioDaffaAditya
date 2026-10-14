import React from 'react';
import { cn } from '@/utils/cn';

interface FileSidebarProps {
  files: string[];
  mains: string[];
  openPath: string | null;
  dirtyPaths: ReadonlySet<string>;
  onOpen: (path: string) => void;
}

/** Every .tex and .cls under cv-src. Mains (files the API found a \documentclass in) are set in bold. */
const FileSidebar: React.FC<FileSidebarProps> = ({ files, mains, openPath, dirtyPaths, onOpen }) => (
  <nav aria-label="CV source files" className="max-h-48 overflow-y-auto border-b border-neutral-800 lg:max-h-none lg:border-b-0 lg:border-r">
    <p className="px-4 pt-4 pb-2 font-mono text-[10px] uppercase tracking-widest text-neutral-500">cv-src</p>
    <ul className="pb-4">
      {files.map((path) => {
        const active = path === openPath;
        return (
          <li key={path}>
            <button
              type="button"
              onClick={() => onOpen(path)}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'flex w-full items-center gap-2 border-l-2 px-4 py-1.5 text-left font-mono text-xs transition-colors',
                active ? 'border-red-500 bg-neutral-900 text-white' : 'border-transparent text-neutral-400 hover:bg-neutral-900/60 hover:text-white'
              )}
            >
              <span className={cn('truncate', mains.includes(path) && 'font-semibold')}>{path}</span>
              {dirtyPaths.has(path) && <span aria-label="unsaved" title="Unsaved changes" className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default FileSidebar;
