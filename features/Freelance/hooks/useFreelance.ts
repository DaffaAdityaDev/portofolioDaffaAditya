import { useEffect } from 'react';
import { useFreelanceStore } from '../store';
import { buildBriefSubject, buildBriefText, buildMailtoUrl, guessCurrencyFromTimeZone, validateBrief } from '../utils/brief';
import type { BriefFormData, BriefRequest, BriefStatus, BudgetCurrency, ProjectTypeId } from '@/types/freelance';

/** Longest mailto URL that common mail apps open without cutting it off. */
const MAILTO_MAX_LENGTH = 1800;

/** Only the fields /api/brief reads; serviceOther only matters when the project type is 'other'. */
function buildBriefRequest(brief: BriefFormData, guard: BriefGuard): BriefRequest {
  return {
    name: brief.name,
    email: brief.email,
    company: brief.company,
    service: brief.service,
    serviceOther: brief.service === 'other' ? brief.serviceOther : '',
    budget: brief.budget,
    timeline: brief.timeline,
    message: brief.message,
    website: brief.website,
    turnstileToken: guard.turnstileToken,
    elapsedMs: guard.elapsedMs,
  };
}

/**
 * The brief as a mailto link. A message too long for the link is shortened and marked, rather than
 * relying on the clipboard, which browsers block once a slow request has used up the click.
 */
function buildMailtoFallback(brief: BriefFormData): string {
  const subject = buildBriefSubject(brief);
  let body = buildBriefText(brief);
  if (buildMailtoUrl(subject, body).length <= MAILTO_MAX_LENGTH) return buildMailtoUrl(subject, body);
  const note = '\n\n[Message shortened to fit the email. I will send the rest in a reply.]';
  while (body.length > 0 && buildMailtoUrl(subject, body + note).length > MAILTO_MAX_LENGTH) body = body.slice(0, Math.floor(body.length * 0.9));
  return buildMailtoUrl(subject, body + note);
}

export interface UseFreelanceReturn {
  brief: BriefFormData;
  briefStatus: BriefStatus;
  /** Validation or delivery problem to show above the submit button. */
  briefError: string | null;
  setBriefField: <K extends keyof BriefFormData>(field: K, value: BriefFormData[K]) => void;
  pickService: (id: ProjectTypeId) => void;
  setCurrency: (currency: BudgetCurrency) => void;
  handleBriefSubmit: (e: React.FormEvent, guard: BriefGuard) => Promise<boolean>;
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

  const setCurrency = (currency: BudgetCurrency) => setCurrencyInStore(currency);

  // Sends through /api/brief. When the brief was not emailed (Resend failed, offline, server error),
  // it also opens in the visitor's mail app, so it always reaches the inbox.
  // Resolves to true when the Turnstile token was sent, so the form knows to fetch a fresh one.
  const handleBriefSubmit = async (e: React.FormEvent, guard: BriefGuard) => {
      e.preventDefault();
      if (validateBrief(brief)) {
        setBriefStatus('error');
        return false;
      }
      setBriefStatus('sending');
      // True when the Sheet saved the brief but the email did not go out.
      let saved = false;
      // A blocked spam check would get the brief rejected, so it goes straight to the mail app.
      if (!guard.turnstileFailed) {
        try {
          const res = await fetch('/api/brief', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildBriefRequest(brief, guard)),
          });
          const result = (await res.json().catch(() => null)) as { ok?: boolean; openMailApp?: boolean; error?: string } | null;
          if (res.ok && result?.ok) {
            if (!result.openMailApp) {
              resetBrief();
              setBriefStatus('sent');
              return true;
            }
            saved = true;
          } else if (res.status === 400) {
            // A rejected brief is the visitor's to fix; anything else falls back to the mail app.
            setBriefStatus('error', result?.error);
            return true;
          }
        } catch {
          // Network failure: fall through to the mail app.
        }
      }
      window.location.href = buildMailtoFallback(brief);
      if (saved) {
        resetBrief();
        setBriefStatus('saved-mail-app');
      } else {
        setBriefStatus('mail-app');
      }
      return !guard.turnstileFailed;
  };

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
