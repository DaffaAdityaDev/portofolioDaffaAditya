import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, type LucideIcon } from 'lucide-react';
import { CONTACT_EMAIL } from '../constants/content';
import {
  BUDGET_OPTIONS,
  MESSAGE_MAX_LENGTH,
  PROJECT_TYPES,
  SERVICE_OTHER_MAX_LENGTH,
  TIMELINE_OPTIONS,
  TURNSTILE_SITE_KEY,
} from '../constants/inquiry';
import { useFreelance } from '../hooks/useFreelance';
import { useTurnstile } from '../hooks/useTurnstile';
import { solidButtonClass } from './styles';
import type { BriefStatus, BudgetCurrency } from '@/types/freelance';

const CURRENCIES: readonly BudgetCurrency[] = ['IDR', 'USD'];

const SUCCESS_TONE = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';

/** The notice shown under the form for each delivery outcome. */
const STATUS_NOTICES: Partial<Record<BriefStatus, { tone: string; Icon: LucideIcon; text: string }>> = {
  sent: { tone: SUCCESS_TONE, Icon: CheckCircle2, text: "Brief received. I'll reply within 24 hours." },
  'mail-app': {
    tone: 'border-neutral-700 bg-white/[0.03] text-neutral-300',
    Icon: Mail,
    text: `Your email app should now be open with the brief. If nothing opened, email ${CONTACT_EMAIL} and I'll reply within 24 hours.`,
  },
  'saved-mail-app': {
    tone: SUCCESS_TONE,
    Icon: CheckCircle2,
    text: "Brief received. Your email app should also open with a copy; please send it so it lands in my inbox too. If nothing opened, that's fine, I already have your brief.",
  },
};

const inputClass =
  'w-full border border-neutral-800 bg-transparent px-3 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-colors';

/** A selectable chip; white when selected, like the rest of the page's toggles. */
const chipClass = (selected: boolean) =>
  `min-h-11 cursor-pointer border px-3 py-2 text-left text-sm transition-colors ${
    selected ? 'border-white bg-white text-black' : 'border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white'
  }`;

const FieldLabel: React.FC<{ htmlFor?: string; n: number; className?: string; children: React.ReactNode }> = ({
  htmlFor,
  n,
  className: spacing = 'mb-3 block',
  children,
}) => {
  const content = (
    <>
      <span className="text-red-400">0{n}</span> · {children}
    </>
  );
  const className = `${spacing} font-mono text-xs uppercase tracking-widest text-neutral-500`;
  return htmlFor ? (
    <label htmlFor={htmlFor} className={className}>
      {content}
    </label>
  ) : (
    <p className={className}>{content}</p>
  );
};

/** The project brief: contact details, project type, budget, timeline and a message. Sends through useFreelance. */
export const BriefForm: React.FC = () => {
  const { brief, briefStatus, briefError, setBriefField, pickService, setCurrency, handleBriefSubmit } = useFreelance();
  const sending = briefStatus === 'sending';
  // Turnstile loads on the first focus inside the form, not for every visitor who scrolls past it.
  const [engaged, setEngaged] = useState(false);
  const { ref: turnstileRef, token, failed, reset } = useTurnstile(engaged ? TURNSTILE_SITE_KEY : '');
  // When the form appeared, for the API's bot time trap.
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    await handleBriefSubmit(e, { turnstileToken: token, turnstileFailed: failed, elapsedMs: Date.now() - shownAt.current });
    reset();
  };
  // Turnstile usually passes within a second or two; until then the button waits instead of failing.
  const checking = !!TURNSTILE_SITE_KEY && engaged && !token && !failed;
  const notice = STATUS_NOTICES[briefStatus];

  return (
    <form id="brief" onSubmit={onSubmit} onFocus={() => setEngaged(true)} noValidate className="scroll-mt-24 border border-neutral-800">
      <div className="border-b border-neutral-800 px-5 py-3 sm:px-6">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">Project brief</span>
      </div>

      <div className="space-y-8 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="brief-name" className="mb-1.5 block text-sm text-neutral-400">Name *</label>
            <input id="brief-name" required autoComplete="name" value={brief.name} onChange={(e) => setBriefField('name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="brief-email" className="mb-1.5 block text-sm text-neutral-400">Email *</label>
            <input
              id="brief-email"
              type="email"
              required
              autoComplete="email"
              value={brief.email}
              onChange={(e) => setBriefField('email', e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="brief-company" className="mb-1.5 block text-sm text-neutral-400">Company</label>
            <input id="brief-company" autoComplete="organization" value={brief.company} onChange={(e) => setBriefField('company', e.target.value)} className={inputClass} />
          </div>
        </div>

        <fieldset>
          <legend className="sr-only">Project type</legend>
          <FieldLabel n={1}>What are you building?</FieldLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {PROJECT_TYPES.map((t) => (
              <button key={t.id} type="button" aria-pressed={brief.service === t.id} onClick={() => pickService(t.id)} className={chipClass(brief.service === t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          {brief.service === 'other' && (
            <div className="mt-3">
              <label htmlFor="brief-service-other" className="mb-1.5 block text-sm text-neutral-400">
                What are you building? *
              </label>
              <input
                id="brief-service-other"
                required
                autoFocus
                maxLength={SERVICE_OTHER_MAX_LENGTH}
                placeholder="e.g. a booking system for my clinic"
                value={brief.serviceOther}
                onChange={(e) => setBriefField('serviceOther', e.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend className="sr-only">Budget</legend>
          <div className="mb-3 flex items-center justify-between gap-3">
            <FieldLabel n={2} className="block">
              Your budget
            </FieldLabel>
            <div className="flex border border-neutral-800" role="group" aria-label="Budget currency">
              {CURRENCIES.map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={brief.currency === code}
                  onClick={() => setCurrency(code)}
                  className={`min-h-9 min-w-12 cursor-pointer px-3 font-mono text-xs transition-colors ${
                    brief.currency === code ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {BUDGET_OPTIONS[brief.currency].map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={brief.budget === option}
                onClick={() => setBriefField('budget', brief.budget === option ? '' : option)}
                className={chipClass(brief.budget === option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="sr-only">Timeline</legend>
          <FieldLabel n={3}>When do you need it?</FieldLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {TIMELINE_OPTIONS.map((t) => (
              <button key={t.id} type="button" aria-pressed={brief.timeline === t.id} onClick={() => setBriefField('timeline', t.id)} className={chipClass(brief.timeline === t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <FieldLabel htmlFor="brief-message" n={4}>
            Tell me about it *
          </FieldLabel>
          <textarea
            id="brief-message"
            required
            rows={5}
            maxLength={MESSAGE_MAX_LENGTH}
            placeholder="What should it do, who is it for, and is there anything you already have (a site, a design, a spreadsheet)?"
            value={brief.message}
            onChange={(e) => setBriefField('message', e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Honeypot: hidden from people and screen readers, filled in by bots */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="brief-website">Website</label>
          <input id="brief-website" tabIndex={-1} autoComplete="off" value={brief.website} onChange={(e) => setBriefField('website', e.target.value)} />
        </div>

        {notice && (
          <p role="status" className={`flex items-start gap-2 border p-3 text-sm ${notice.tone}`}>
            <notice.Icon size={16} className="mt-0.5 shrink-0" />
            <span>{notice.text}</span>
          </p>
        )}
        {briefError && (
          <p role="alert" className="border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {briefError}
          </p>
        )}

        {/* Turnstile renders here only when Cloudflare needs the visitor to click */}
        <div ref={turnstileRef} className="empty:hidden" />

        <button
          type="submit"
          disabled={sending || checking}
          className={`group flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 disabled:cursor-wait disabled:opacity-60 ${solidButtonClass}`}
        >
          {sending ? 'Sending…' : checking ? 'Checking for spam…' : 'Send brief'}
          {!sending && !checking && <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />}
        </button>
        <p className="text-center text-xs leading-relaxed text-neutral-500">
          Free and no commitment. Your brief goes straight to my inbox and is never shared.
        </p>
      </div>
    </form>
  );
};

export default BriefForm;
