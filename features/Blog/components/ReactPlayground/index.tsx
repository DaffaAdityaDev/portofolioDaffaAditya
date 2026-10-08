import React, { lazy, Suspense, useRef } from 'react';
import { useInView } from 'framer-motion';
import type { ReactPlaygroundProps } from '@/types/blog';
import { PLAYGROUND_CONSOLE_HEIGHT, PLAYGROUND_DEFAULT_HEIGHT, PLAYGROUND_PRELOAD_MARGIN } from '../../constants';

// The editor is browser-only, so it is split out and loaded on demand.
const Playground = lazy(() => import('./Playground'));

interface PlaygroundSkeletonProps {
  title?: string;
  height: number;
  showConsole: boolean;
}

/**
 * Takes the exact space of the loaded playground, so the post does not jump: the h-8
 * toolbar, the panes (stacked below md, so twice as tall there) and the console.
 */
const PlaygroundSkeleton: React.FC<PlaygroundSkeletonProps> = ({ title, height, showConsole }) => (
  <div role="status" aria-label="Loading live editor" style={{ '--playground-height': `${height}px` } as React.CSSProperties}>
    <div className="flex h-8 items-center border border-b-0 border-neutral-800 bg-neutral-900/50 pl-3 font-mono text-xs text-neutral-400">
      <span className="truncate">{title ?? 'Live React'}</span>
    </div>
    {/* 2px: the top and bottom border around the panes. */}
    <div className="flex h-[calc(var(--playground-height)_*_2_+_2px)] items-center justify-center border border-neutral-800 bg-[#0d0d0d] font-mono text-xs uppercase tracking-wider text-neutral-500 md:h-[calc(var(--playground-height)_+_2px)]">
      Loading live editor
    </div>
    {showConsole && (
      <div className="border border-t-0 border-neutral-800 bg-[#0d0d0d]" style={{ height: PLAYGROUND_CONSOLE_HEIGHT }} />
    )}
  </div>
);

/**
 * Live React editor with a side-by-side preview. The code runs in a sandboxed
 * iframe served by this site. Nothing loads until the block is about to scroll
 * into view.
 *
 * <ReactPlayground title="Counter">{`export default function App() { ... }`}</ReactPlayground>
 */
const ReactPlayground: React.FC<ReactPlaygroundProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const isNearViewport = useInView(ref, { once: true, margin: PLAYGROUND_PRELOAD_MARGIN });
  const height = props.height ?? PLAYGROUND_DEFAULT_HEIGHT;
  const skeleton = <PlaygroundSkeleton title={props.title} height={height} showConsole={props.showConsole ?? false} />;

  return (
    <div ref={ref} className="my-8">
      {isNearViewport ? (
        <Suspense fallback={skeleton}>
          <Playground {...props} />
        </Suspense>
      ) : (
        skeleton
      )}
    </div>
  );
};

export default ReactPlayground;
