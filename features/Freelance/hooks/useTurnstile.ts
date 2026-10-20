import { useEffect, useRef, useState } from 'react';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
/** How long to wait for Cloudflare's first answer before treating the check as unavailable. */
const GIVE_UP_MS = 10000;

// One script per page, however many times the form mounts.
let loading: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loading = null;
      reject(new Error('Turnstile failed to load'));
    };
    document.head.appendChild(script);
  });
  return loading;
}

interface UseTurnstileReturn {
  /** Container for the widget. It stays empty unless Cloudflare needs the visitor to click. */
  ref: React.RefObject<HTMLDivElement | null>;
  /** One-time token for the next submit, '' until the check passes. */
  token: string;
  /** True when the check could not run (script blocked, widget error), so the form should not wait for it. */
  failed: boolean;
  /** Tokens are single-use: call after every submit. */
  reset: () => void;
}

/**
 * Cloudflare Turnstile, invisible for most visitors. Does nothing while siteKey is empty, so callers pass ''
 * until the visitor starts on the form and the script only loads for people who use it.
 */
export function useTurnstile(siteKey: string): UseTurnstileReturn {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    let answered = false;
    // Neither callback ever fires when the challenge iframe is blocked: stop waiting so the form can still send.
    const giveUp = window.setTimeout(() => !answered && setFailed(true), GIVE_UP_MS);
    loadTurnstile()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          theme: 'dark',
          appearance: 'interaction-only',
          callback: (t) => {
            answered = true;
            setToken(t);
            setFailed(false);
          },
          'expired-callback': () => setToken(''),
          'error-callback': () => {
            answered = true;
            setToken('');
            setFailed(true);
          },
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      window.clearTimeout(giveUp);
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, [siteKey]);

  const reset = () => {
    setToken('');
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  };

  return { ref, token, failed, reset };
}
