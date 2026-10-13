import { useCallback, useEffect } from 'react';
import { useFreelanceStore } from '@/store/useFreelanceStore';
import { buildBriefSubject, buildBriefText, buildMailtoUrl, guessCurrencyFromTimeZone, validateBrief } from '../utils/brief';
import type { BriefFormData, BriefStatus, BudgetCurrency, ProjectTypeId } from '@/types/freelance';

/** Longest mailto URL that common mail apps open without cutting it off. */
const MAILTO_MAX_LENGTH = 1800;

export interface UseFreelanceReturn {
  brief: BriefFormData;
  briefStatus: BriefStatus;
  /** Validation or delivery problem to show above the submit button. */
  briefError: string | null;
  setBriefField: <K extends keyof BriefFormData>(field: K, value: BriefFormData[K]) => void;
  pickService: (id: ProjectTypeId) => void;
  setCurrency: (currency: BudgetCurrency) => void;
  handleBriefSubmit: (e: React.FormEvent, guard: BriefGuard) => Promise<void>;
}

/** Spam checks the form collects and the API verifies. */
export interface BriefGuard {
  /** Cloudflare Turnstile token, '' when the check is off. */
  turnstileToken: string;
  /** True when Turnstile is on but could not run, so the brief goes to the mail app instead of the API. */
  turnstileFailed: boolean;
  /** How long the form had been on screen, for the bot time trap. */
  elapsedMs: number;
}

export function useFreelance(): UseFreelanceReturn {
  const brief = useFreelanceStore((s) => s.brief);
  const briefStatus = useFreelanceStore((s) => s.briefStatus);
  const setBriefField = useFreelanceStore((s) => s.setBriefField);
  const pickService = useFreelanceStore((s) => s.pickService);
  const setCurrencyInStore = useFreelanceStore((s) => s.setCurrency);
  const setBriefStatus = useFreelanceStore((s) => s.setBriefStatus);
  const resetBrief = useFreelanceStore((s) => s.resetBrief);
  const serverError = useFreelanceStore((s) => s.briefError);

  // Show budgets in the visitor's likely currency, once, on the client.
  useEffect(() => {
    try {
      setCurrencyInStore(guessCurrencyFromTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone), { auto: true });
    } catch {
      // Ignore environments without Intl time zone support.
    }
  }, [setCurrencyInStore]);

  const setCurrency = useCallback((currency: BudgetCurrency) => setCurrencyInStore(currency), [setCurrencyInStore]);

  // Sends through /api/brief. When the brief was not emailed (Resend failed or is off, offline,
  // server error), it also opens in the visitor's mail app, so it always reaches the inbox.
  const handleBriefSubmit = useCallback(
    async (e: React.FormEvent, guard: BriefGuard) => {
      e.preventDefault();
      if (validateBrief(brief)) {
        setBriefStatus('error');
        return;
      }
      setBriefStatus('sending');
      // True when the Sheet saved the brief but the email did not go out.
      let saved = false;
      try {
        // A blocked spam check would get the brief rejected, so it goes straight to the mail app.
        if (guard.turnstileFailed) throw new Error('Turnstile unavailable');
        const res = await fetch('/api/brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...brief, turnstileToken: guard.turnstileToken, elapsedMs: guard.elapsedMs }),
        });
        if (res.ok) {
          const result = (await res.json().catch(() => null)) as { emailed?: boolean } | null;
          if (result?.emailed !== false) {
            resetBrief();
            setBriefStatus('sent');
            return;
          }
          saved = true;
        }
        // A rejected brief (400) is the visitor's to fix; anything else falls back to the mail app.
        else if (res.status === 400) {
          const result = (await res.json().catch(() => null)) as { error?: string } | null;
          setBriefStatus('error', result?.error);
          return;
        }
      } catch {
        // Network failure or no spam check: fall through to the mail app.
      }
      const subject = buildBriefSubject(brief);
      const body = buildBriefText(brief);
      const url = buildMailtoUrl(subject, body);
      if (url.length <= MAILTO_MAX_LENGTH) {
        window.location.href = url;
      } else {
        // Too long for a mailto link: put the full brief on the clipboard to paste.
        try {
          await navigator.clipboard.writeText(body);
        } catch {
          // The notice still offers the email address.
        }
        window.location.href = buildMailtoUrl(subject, 'My project brief is on my clipboard. I will paste it here.');
      }
      if (saved) {
        resetBrief();
        setBriefStatus('saved-mail-app');
      } else {
        setBriefStatus('mail-app');
      }
    },
    [brief, resetBrief, setBriefStatus],
  );

  return {
    brief,
    briefStatus,
    briefError:
      briefStatus === 'error' ? validateBrief(brief) ?? serverError ?? "Couldn't send the brief. Please try again or email me directly." : null,
    setBriefField,
    pickService,
    setCurrency,
    handleBriefSubmit,
  };
}

export default useFreelance;
