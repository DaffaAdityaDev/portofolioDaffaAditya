import React from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { PLAYGROUND_RUNTIME_ROUTE } from '@/constant/constant';
import type { PlaygroundPreviewProps, PlaygroundStatus } from '@/types/blog';
import { PLAYGROUND_SANDBOX } from '../../constants';
import ToolbarButton from '../ToolbarButton';

// Only failures are announced. A run after every pause in typing would be noise.
const STATUS_TEXT: Partial<Record<PlaygroundStatus, string>> = {
  error: 'The code has an error. The preview and the console show where.',
};

/**
 * The iframe that runs the code. It loads this site's runtime page with an
 * opaque origin, so the code cannot touch the post page.
 */
const PlaygroundPreview: React.FC<PlaygroundPreviewProps> = ({
  iframeRef,
  frameKey,
  status,
  hasLoaded,
  needsPageReload,
  height,
  onReload,
  onReset,
}) => (
  <div className="relative bg-white" style={{ height }}>
    <iframe
      key={frameKey}
      ref={iframeRef}
      src={PLAYGROUND_RUNTIME_ROUTE}
      sandbox={PLAYGROUND_SANDBOX}
      title="Live preview"
      className="block size-full border-0 bg-white"
    />

    {status === 'loading' && (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d0d] font-mono text-xs uppercase tracking-wider text-neutral-500">
        Starting preview
      </div>
    )}

    {status === 'unresponsive' && (
      <div
        role="alert"
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0d0d0d]/95 p-6 text-center font-mono text-xs text-neutral-400"
      >
        <div className="max-w-xs leading-relaxed">
          {needsPageReload
            ? 'The preview is still stuck. The browser keeps the stuck code running until this page reloads. Your edits will be lost.'
            : hasLoaded
              ? 'The preview stopped responding. A loop in the code may never end.'
              : 'The preview did not load. Check your connection and try again.'}
        </div>
        <div className="flex items-center gap-1 border border-neutral-800 bg-neutral-900/50">
          {needsPageReload ? (
            <ToolbarButton label="Reload page" onClick={() => window.location.reload()}>
              <RefreshCw className="size-3.5" aria-hidden="true" />
              <span>Reload page</span>
            </ToolbarButton>
          ) : (
            <>
              <ToolbarButton label="Reload preview" onClick={onReload}>
                <RefreshCw className="size-3.5" aria-hidden="true" />
                <span>Reload</span>
              </ToolbarButton>
              <ToolbarButton label="Reset code" onClick={onReset}>
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Reset</span>
              </ToolbarButton>
            </>
          )}
        </div>
      </div>
    )}

    {status !== 'loading' && status !== 'unresponsive' && (
      <div className="absolute bottom-1 right-1 border border-neutral-800 bg-neutral-900/90">
        <ToolbarButton label="Reload preview" onClick={onReload}>
          <RefreshCw className="size-3.5" aria-hidden="true" />
        </ToolbarButton>
      </div>
    )}

    <span className="sr-only" role="status" aria-live="polite">
      {STATUS_TEXT[status]}
    </span>
  </div>
);

export default PlaygroundPreview;
