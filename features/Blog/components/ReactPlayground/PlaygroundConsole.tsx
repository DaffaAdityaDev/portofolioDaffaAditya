import React, { useEffect, useRef } from 'react';
import { Ban } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { PlaygroundConsoleLevel, PlaygroundConsoleProps } from '@/types/blog';
import { PLAYGROUND_CONSOLE_HEIGHT } from '../../constants';
import ToolbarButton from '../ToolbarButton';

const LEVEL_CLASS: Record<PlaygroundConsoleLevel, string> = {
  log: 'text-neutral-300',
  info: 'text-sky-300',
  warn: 'bg-amber-500/5 text-amber-300',
  error: 'bg-red-500/5 text-red-300',
};

/** Console output of the preview, newest at the bottom. */
const PlaygroundConsole: React.FC<PlaygroundConsoleProps> = ({ entries, onClear }) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries]);

  return (
    <div
      className="flex flex-col border border-t-0 border-neutral-800 bg-[#0d0d0d]"
      style={{ height: PLAYGROUND_CONSOLE_HEIGHT }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-900/50 py-0.5 pl-3 pr-1 font-mono text-[11px] uppercase tracking-wider text-neutral-500">
        <span>Console</span>
        <ToolbarButton label="Clear console" onClick={onClear}>
          <Ban className="size-3.5" aria-hidden="true" />
          <span>Clear</span>
        </ToolbarButton>
      </div>
      <div ref={logRef} role="log" aria-label="Console output" className="min-h-0 flex-1 overflow-auto font-mono text-xs leading-relaxed">
        {entries.length === 0 ? (
          <div className="px-3 py-2 text-neutral-500">Console output shows up here.</div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={cn('whitespace-pre-wrap break-words border-b border-neutral-900 px-3 py-1', LEVEL_CLASS[entry.level])}
            >
              {entry.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaygroundConsole;
