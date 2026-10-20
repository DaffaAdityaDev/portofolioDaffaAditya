import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AUTO_COMPILE_DELAY_MS, AUTO_COMPILE_STORAGE_KEY, CV_API, DEFAULT_CV_MAIN, isReadOnlyPath, pdfFileName } from '../constants';
import type { CvCompileFailure, CvCompileStatus, CvFileBuffer, CvPublishResult, CvPublishStatus } from '../types';

const messageOf = (err: unknown): string => (err instanceof Error ? err.message : String(err));

/** An error body from /api/cv/*: its `error` (or the status line) and `log` (empty when absent). */
async function readFailure(res: Response): Promise<CvCompileFailure> {
  const body = (await res.json().catch(() => null)) as Partial<CvCompileFailure> | null;
  return {
    error: typeof body?.error === 'string' ? body.error : `${res.status} ${res.statusText}`,
    log: typeof body?.log === 'string' ? body.log : '',
  };
}

/** Every source file, plus the ones the server found a \documentclass in. */
async function fetchFileList(): Promise<{ files: string[]; mains: string[] }> {
  const res = await fetch(CV_API.FILES);
  if (!res.ok) throw new Error((await readFailure(res)).error);
  return (await res.json()) as { files: string[]; mains: string[] };
}

async function fetchFile(path: string): Promise<string> {
  const res = await fetch(`${CV_API.FILE}?path=${encodeURIComponent(path)}`);
  if (!res.ok) throw new Error(`${path}: ${(await readFailure(res)).error}`);
  return ((await res.json()) as { content: string }).content;
}

async function writeFile(path: string, content: string): Promise<void> {
  const res = await fetch(CV_API.FILE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content }),
  });
  if (!res.ok) throw new Error(`${path}: ${(await readFailure(res)).error}`);
}

export interface UseCvEditorReturn {
  files: string[];
  mains: string[];
  /** Selected main; '' until the file list arrives. */
  main: string;
  setMain: (main: string) => void;
  openPath: string | null;
  /** Content of the open file, undefined while it loads or when loading failed. */
  openContent: string | undefined;
  /** The open file could not be loaded; reopening it retries. */
  openFailed: boolean;
  openFile: (path: string) => void;
  editOpenFile: (content: string) => void;
  /** Files with edits not yet written to cv-src. */
  dirtyPaths: ReadonlySet<string>;
  compileStatus: CvCompileStatus;
  /** How long the last finished compile took, including the save before it. */
  compileMs: number | null;
  compileFailure: CvCompileFailure | null;
  /** blob: URL of the last PDF that compiled. Kept while a later compile fails. */
  pdfUrl: string | null;
  /** Download file name of that PDF (from the main it was compiled from). */
  pdfName: string | null;
  /** Saves every edited file, then compiles the selected main. */
  compile: () => Promise<void>;
  publishStatus: CvPublishStatus;
  published: CvPublishResult | null;
  publish: () => Promise<void>;
  /** Loading, saving or publishing problem (compile errors go to compileFailure). */
  actionError: string | null;
  /** Save and compile on its own a moment after the last edit. Remembered in localStorage. */
  autoCompile: boolean;
  toggleAutoCompile: () => void;
}

function readAutoCompile(): boolean {
  try {
    return window.localStorage.getItem(AUTO_COMPILE_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function useCvEditor(): UseCvEditorReturn {
  const [files, setFiles] = useState<string[]>([]);
  const [mains, setMains] = useState<string[]>([]);
  const [main, setMain] = useState('');
  const [buffers, setBuffers] = useState<Record<string, CvFileBuffer>>({});
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [compileStatus, setCompileStatus] = useState<CvCompileStatus>('idle');
  const [compileMs, setCompileMs] = useState<number | null>(null);
  const [compileFailure, setCompileFailure] = useState<CvCompileFailure | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<CvPublishStatus>('idle');
  const [published, setPublished] = useState<CvPublishResult | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [failedPaths, setFailedPaths] = useState<ReadonlySet<string>>(() => new Set());
  // The page is client-only (next/dynamic, ssr: false), so reading storage here cannot mismatch hydration.
  const [autoCompile, setAutoCompile] = useState(readAutoCompile);

  // Only the newest compile may update the preview; older ones are aborted.
  const compileAbortRef = useRef<AbortController | null>(null);
  // Read by saveDirty and openFile so they do not change on every keystroke.
  const buffersRef = useRef(buffers);
  useEffect(() => {
    buffersRef.current = buffers;
  }, [buffers]);

  const dirtyPaths = useMemo(
    () => new Set(Object.keys(buffers).filter((path) => buffers[path].content !== buffers[path].saved)),
    [buffers]
  );
  const openContent = openPath ? buffers[openPath]?.content : undefined;
  const openFailed = openPath ? failedPaths.has(openPath) : false;

  const loadFile = useCallback(async (path: string) => {
    try {
      const content = await fetchFile(path);
      // Keep a buffer that is already there: it may hold edits made while this request ran.
      setBuffers((prev) => (prev[path] ? prev : { ...prev, [path]: { content, saved: content } }));
      setFailedPaths((prev) => {
        if (!prev.has(path)) return prev;
        const next = new Set(prev);
        next.delete(path);
        return next;
      });
    } catch (err) {
      setFailedPaths((prev) => new Set(prev).add(path));
      setActionError(messageOf(err));
    }
  }, []);

  const runCompile = useCallback(async (target: string, startedAt: number) => {
    compileAbortRef.current?.abort();
    const controller = new AbortController();
    compileAbortRef.current = controller;
    setCompileStatus('compiling');

    try {
      const res = await fetch(CV_API.COMPILE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ main: target }),
        signal: controller.signal,
      });
      if (res.ok) {
        const blob = await res.blob();
        if (controller.signal.aborted) return;
        // A named File (not a bare Blob) so viewers that read the object's name save it properly.
        setPdfUrl(URL.createObjectURL(new File([blob], pdfFileName(target), { type: 'application/pdf' })));
        setPdfName(pdfFileName(target));
        setCompileFailure(null);
        setCompileStatus('ok');
      } else {
        const failure = await readFailure(res);
        if (controller.signal.aborted) return;
        setCompileFailure(failure);
        setCompileStatus('error');
      }
      setCompileMs(Math.round(performance.now() - startedAt));
    } catch (err) {
      if (controller.signal.aborted) return;
      setCompileFailure({ error: messageOf(err), log: '' });
      setCompileStatus('error');
    }
  }, []);

  /** Writes every edited file. Returns false if any write failed. */
  const saveDirty = useCallback(async (): Promise<boolean> => {
    const pending = Object.entries(buffersRef.current).filter(([, buf]) => buf.content !== buf.saved);
    try {
      await Promise.all(pending.map(([path, buf]) => writeFile(path, buf.content)));
    } catch (err) {
      setActionError(messageOf(err));
      return false;
    }
    // Mark what was sent as saved, so typing during the request stays dirty.
    setBuffers((prev) => {
      const next = { ...prev };
      for (const [path, buf] of pending) next[path] = { ...next[path], saved: buf.content };
      return next;
    });
    setActionError(null);
    return true;
  }, []);

  // Pending auto compile; any compile (manual, Ctrl+S or the timer itself) supersedes it.
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelAutoCompile = useCallback(() => {
    if (autoTimerRef.current === null) return;
    clearTimeout(autoTimerRef.current);
    autoTimerRef.current = null;
  }, []);

  const compile = useCallback(async () => {
    cancelAutoCompile();
    if (!main) return;
    const startedAt = performance.now();
    if (await saveDirty()) await runCompile(main, startedAt);
  }, [cancelAutoCompile, main, runCompile, saveDirty]);

  const publish = useCallback(async () => {
    if (!(await saveDirty())) return;
    setPublishStatus('publishing');
    try {
      const res = await fetch(CV_API.PUBLISH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ main }),
      });
      if (!res.ok) throw new Error((await readFailure(res)).error);
      setPublished((await res.json()) as CvPublishResult);
      setPublishStatus('done');
    } catch (err) {
      setActionError(`Publish failed: ${messageOf(err)}`);
      setPublishStatus('error');
    }
  }, [main, saveDirty]);

  const openFile = useCallback(
    (path: string) => {
      setOpenPath(path);
      if (!buffersRef.current[path]) void loadFile(path);
    },
    [loadFile]
  );

  // The latest compile, for the Ctrl+S listener and the auto compile timer.
  const compileRef = useRef(compile);
  useEffect(() => {
    compileRef.current = compile;
  }, [compile]);
  const autoCompileRef = useRef(autoCompile);
  useEffect(() => {
    autoCompileRef.current = autoCompile;
  }, [autoCompile]);

  /** Restarts the debounce; the compile runs once edits stop for AUTO_COMPILE_DELAY_MS. */
  const scheduleAutoCompile = useCallback(() => {
    cancelAutoCompile();
    autoTimerRef.current = setTimeout(() => {
      autoTimerRef.current = null;
      void compileRef.current();
    }, AUTO_COMPILE_DELAY_MS);
  }, [cancelAutoCompile]);

  const editOpenFile = useCallback(
    (content: string) => {
      if (!openPath) return;
      const prevBuffer = buffersRef.current[openPath];
      setBuffers((prev) => (prev[openPath] ? { ...prev, [openPath]: { ...prev[openPath], content } } : prev));
      // Only real edits schedule: loading or switching files never goes through here with new content.
      if (autoCompileRef.current && prevBuffer && prevBuffer.content !== content && !isReadOnlyPath(openPath)) {
        scheduleAutoCompile();
      }
    },
    [openPath, scheduleAutoCompile]
  );

  const toggleAutoCompile = useCallback(() => {
    setAutoCompile((on) => !on);
  }, []);

  // Turning auto on with unsaved edits compiles them once; turning it off drops the pending compile.
  useEffect(() => {
    try {
      window.localStorage.setItem(AUTO_COMPILE_STORAGE_KEY, autoCompile ? '1' : '0');
    } catch {
      // Storage blocked: the toggle still works for this visit.
    }
    if (!autoCompile) {
      cancelAutoCompile();
      return;
    }
    if (Object.values(buffersRef.current).some((buf) => buf.content !== buf.saved)) scheduleAutoCompile();
  }, [autoCompile, cancelAutoCompile, scheduleAutoCompile]);

  useEffect(() => cancelAutoCompile, [cancelAutoCompile]);

  // List the sources, then open the default main and compile it at the same time so the preview starts filled.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchFileList();
        if (cancelled) return;
        setFiles(list.files);
        setMains(list.mains);
        const first = list.mains.includes(DEFAULT_CV_MAIN) ? DEFAULT_CV_MAIN : list.mains[0];
        if (!first) return;
        setMain(first);
        setOpenPath(first);
        void loadFile(first);
        void runCompile(first, performance.now());
      } catch (err) {
        if (!cancelled) setActionError(messageOf(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadFile, runCompile]);

  // Revoke each PDF URL once a newer one replaces it, and the last one on unmount.
  useEffect(() => () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
  }, [pdfUrl]);

  useEffect(() => () => compileAbortRef.current?.abort(), []);

  // Ctrl+S / Cmd+S anywhere on the page: save, then recompile. Registered once; calls the latest compile.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void compileRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const hasDirty = dirtyPaths.size > 0;
  useEffect(() => {
    if (!hasDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Older browsers only prompt when returnValue is set.
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [hasDirty]);

  return {
    files,
    mains,
    main,
    setMain,
    openPath,
    openContent,
    openFailed,
    openFile,
    editOpenFile,
    dirtyPaths,
    compileStatus,
    compileMs,
    compileFailure,
    pdfUrl,
    pdfName,
    compile,
    publishStatus,
    published,
    publish,
    actionError,
    autoCompile,
    toggleAutoCompile,
  };
}
