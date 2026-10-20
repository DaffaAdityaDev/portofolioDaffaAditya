import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  PlaygroundConsoleEntry,
  PlaygroundConsoleLevel,
  PlaygroundHostMessage,
  PlaygroundStatus,
} from '@/types/blog';
import {
  PLAYGROUND_CONSOLE_MAX_ENTRIES,
  PLAYGROUND_CONSOLE_RATE_PER_SECOND,
  PLAYGROUND_LOAD_TIMEOUT_MS,
  PLAYGROUND_PING_INTERVAL_MS,
  PLAYGROUND_RECOMPILE_DELAY_MS,
  PLAYGROUND_STUCK_RELOAD_TIMEOUT_MS,
  PLAYGROUND_UNRESPONSIVE_MS,
} from '../constants';
import {
  createRateLimiter,
  describePlaygroundError,
  isPlaygroundRuntimeMessage,
  truncateText,
} from '../utils/playgroundProtocol';

type RunStatus = Exclude<PlaygroundStatus, 'unresponsive'>;

/**
 * Drives the preview iframe: sends it the files after each edit (debounced),
 * collects its console output and errors, and pings it so a frame stuck in an
 * endless loop shows up as `unresponsive` instead of a silent blank pane.
 */
export const usePlaygroundPreview = (files: Record<string, string>, entry: string) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameKey, setFrameKey] = useState(0);
  const [runStatus, setRunStatus] = useState<RunStatus>('loading');
  const [isStuck, setIsStuck] = useState(false);
  const [needsPageReload, setNeedsPageReload] = useState(false);
  const [entries, setEntries] = useState<PlaygroundConsoleEntry[]>([]);

  const isReady = useRef(false);
  const runId = useRef(0);
  const entryId = useRef(0);
  // The heartbeat effect starts the clock on mount, so render stays pure.
  const lastHeard = useRef(0);
  // Set once a running frame got stuck, cleared when a frame says it is ready again.
  const hadStuckFrame = useRef(false);
  const latest = useRef({ files, entry });
  // The frame keeps to PLAYGROUND_CONSOLE_RATE_PER_SECOND already. This limit is for code
  // in the frame that posts to this page directly, so it cannot flood the post.
  const [limiter] = useState(() => createRateLimiter(PLAYGROUND_CONSOLE_RATE_PER_SECOND * 2));
  const skippedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    latest.current = { files, entry };
  }, [files, entry]);

  // The frame has an opaque origin, which no target origin can name, so '*' it is.
  // What goes out is the post's own sample code plus the reader's edits.
  const send = useCallback((message: PlaygroundHostMessage) => {
    iframeRef.current?.contentWindow?.postMessage(message, '*');
  }, []);

  const pushEntry = useCallback((level: PlaygroundConsoleLevel, text: string) => {
    const id = ++entryId.current;
    setEntries((current) => [...current, { id, level, text: truncateText(text) }].slice(-PLAYGROUND_CONSOLE_MAX_ENTRIES));
  }, []);

  const addEntry = useCallback(
    (level: PlaygroundConsoleLevel, text: string) => {
      if (limiter.take()) {
        pushEntry(level, text);
        return;
      }
      skippedTimer.current ??= setTimeout(() => {
        skippedTimer.current = undefined;
        const skipped = limiter.takeSkipped();
        if (skipped) pushEntry('warn', `${skipped} console messages were skipped.`);
      }, 1000);
    },
    [limiter, pushEntry],
  );

  useEffect(() => () => clearTimeout(skippedTimer.current), []);

  const run = useCallback(() => {
    if (!isReady.current) return;
    runId.current += 1;
    setEntries([]);
    setRunStatus('running');
    send({ source: 'playground-host', type: 'run', runId: runId.current, ...latest.current });
  }, [send]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      // A sandboxed frame reports origin "null", so the sender's window is what proves it is ours.
      if (event.source !== iframeRef.current?.contentWindow || event.origin !== 'null') return;
      if (!isPlaygroundRuntimeMessage(event.data)) return;

      lastHeard.current = Date.now();
      setIsStuck(false);
      const message = event.data;

      switch (message.type) {
        case 'ready':
          isReady.current = true;
          hadStuckFrame.current = false;
          setNeedsPageReload(false);
          run();
          break;
        case 'rendered':
          if (message.runId === runId.current) setRunStatus('ready');
          break;
        case 'error':
          if (message.runId !== runId.current) break;
          setRunStatus('error');
          addEntry('error', describePlaygroundError(message.error));
          break;
        case 'console':
          addEntry(message.level, message.text);
          break;
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [addEntry, run]);

  // Recompile after the reader stops typing. Until the frame is ready, its `ready` message triggers the first run.
  useEffect(() => {
    if (!isReady.current) return;
    const timer = setTimeout(run, PLAYGROUND_RECOMPILE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [files, entry, run]);

  useEffect(() => {
    lastHeard.current = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      // Hidden tabs throttle timers, so silence there proves nothing. Restart the clock instead.
      if (document.visibilityState !== 'visible') {
        lastHeard.current = now;
        return;
      }
      send({ source: 'playground-host', type: 'ping' });
      const limit = isReady.current
        ? PLAYGROUND_UNRESPONSIVE_MS
        : hadStuckFrame.current
          ? PLAYGROUND_STUCK_RELOAD_TIMEOUT_MS
          : PLAYGROUND_LOAD_TIMEOUT_MS;
      if (now - lastHeard.current <= limit) return;
      // A fresh frame that cannot start after a stuck one shares its busy process.
      if (!isReady.current && hadStuckFrame.current) setNeedsPageReload(true);
      // Only a frame that ran code can be stuck. One that never loaded is a network problem.
      if (isReady.current) hadStuckFrame.current = true;
      setIsStuck(true);
    }, PLAYGROUND_PING_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [frameKey, send]);

  /**
   * Swaps in a fresh iframe. After a hang, Chromium may put the new frame in the old,
   * still busy process. The heartbeat notices and the preview asks for a page reload.
   */
  const reload = useCallback(() => {
    isReady.current = false;
    lastHeard.current = Date.now();
    setIsStuck(false);
    setRunStatus('loading');
    setFrameKey((key) => key + 1);
  }, []);

  const clearConsole = useCallback(() => setEntries([]), []);

  return {
    iframeRef,
    frameKey,
    status: (isStuck ? 'unresponsive' : runStatus) as PlaygroundStatus,
    hasLoaded: runStatus !== 'loading',
    needsPageReload,
    entries,
    clearConsole,
    reload,
  };
};
