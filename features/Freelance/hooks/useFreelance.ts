import { useCallback, useEffect } from 'react';
import { useFreelanceStore } from '@/store/useFreelanceStore';
import { buildBriefSubject, buildBriefText, buildMailtoUrl, guessCurrencyFromTimeZone, validateBrief } from '../utils/brief';
import type { BriefFormData, BriefStatus, BudgetCurrency, ServiceId } from '@/types/freelance';

/** Longest mailto URL that common mail apps open without cutting it off. */
const MAILTO_MAX_LENGTH = 1800;

export interface UseFreelanceReturn {
  brief: BriefFormData;
  briefStatus: BriefStatus;
  /** Validation or delivery problem to show above the submit button. */
  briefError: string | null;
  setBriefField: <K extends keyof BriefFormData>(field: K, value: BriefFormData[K]) => void;
  pickService: (id: ServiceId) => void;
  setCurrency: (currency: BudgetCurrency) => void;
  handleBriefSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useFreelance(): UseFreelanceReturn {
  const brief = useFreelanceStore((s) => s.brief);
  const briefStatus = useFreelanceStore((s) => s.briefStatus);
  const setBriefField = useFreelanceStore((s) => s.setBriefField);
  const pickService = useFreelanceStore((s) => s.pickService);
  const setCurrencyInStore = useFreelanceStore((s) => s.setCurrency);
  const setBriefStatus = useFreelanceStore((s) => s.setBriefStatus);
  const resetBrief = useFreelanceStore((s) => s.resetBrief);

  // Show budgets in the visitor's likely currency, once, on the client.
  useEffect(() => {
    try {
      setCurrencyInStore(guessCurrencyFromTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone), { auto: true });
    } catch {
      // Ignore environments without Intl time zone support.
    }
  }, [setCurrencyInStore]);

  const setCurrency = useCallback((currency: BudgetCurrency) => setCurrencyInStore(currency), [setCurrencyInStore]);

  // Sends through /api/brief. When the site cannot send (not configured, offline, server error),
  // the brief opens in the visitor's mail app instead, so it is never lost.
  const handleBriefSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (validateBrief(brief)) {
        setBriefStatus('error');
        return;
      }
      setBriefStatus('sending');
      try {
        const res = await fetch('/api/brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(brief),
        });
        if (res.ok) {
          resetBrief();
          setBriefStatus('sent');
          return;
        }
        // A rejected brief (400) is the visitor's to fix; anything else falls back to the mail app.
        if (res.status === 400) {
          setBriefStatus('error');
          return;
        }
      } catch {
        // Network failure: fall through to the mail app.
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
      setBriefStatus('mail-app');
    },
    [brief, resetBrief, setBriefStatus],
  );

  return {
    brief,
    briefStatus,
    briefError: briefStatus === 'error' ? validateBrief(brief) ?? "Couldn't send the brief. Please try again or email me directly." : null,
    setBriefField,
    pickService,
    setCurrency,
    handleBriefSubmit,
  };
}

export default useFreelance;
