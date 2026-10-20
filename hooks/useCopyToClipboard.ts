import { useEffect, useRef, useState } from 'react';

type CopyStatus = 'idle' | 'copied' | 'error';

/**
 * Copies text to the clipboard and reports the result for `resetMs`.
 * Reports `error` when the Clipboard API is missing or the browser rejects the write.
 */
export function useCopyToClipboard(resetMs: number) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), resetMs);
  };

  return { status, copy };
}
