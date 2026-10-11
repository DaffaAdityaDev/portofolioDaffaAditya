import React from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, Mail } from 'lucide-react';
import SpotlightButton from '@/components/ui/SpotlightButton';
import { AVAILABILITY, BOOKING_URL, CALL_WINDOW, CONTACT_EMAIL, LINKEDIN_URL, REPLY_WINDOW, SERVICES } from '../constants/content';
import { BUDGET_OPTIONS, MESSAGE_MAX_LENGTH, TIMELINE_OPTIONS } from '../constants/inquiry';
import { useFreelance } from '../hooks/useFreelance';
import { Section, SectionHeader } from './SectionHeader';
import StatusBadge from './StatusBadge';
import type { BudgetCurrency } from '@/types/freelance';

const NEXT_STEPS = [
  { title: 'Send the brief', body: 'What you need, your budget and your timeline. Two minutes.' },
  { title: 'I reply within 24 hours', body: 'With questions, and a time for a free 30-minute call after 17:00 WIB.' },
  { title: 'You get a proposal', body: 'Within 2-3 days: the feature list, a week-by-week plan and one fixed price.' },
];

const CURRENCIES: readonly BudgetCurrency[] = ['IDR', 'USD'];

const inputClass =
  'w-full border border-neutral-800 bg-transparent px-3 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-white focus:outline-none transition-colors';

/** A selectable chip; white when selected, like the rest of the page's toggles. */
const chipClass = (selected: boolean) =>
  `min-h-11 cursor-pointer border px-3 py-2 text-left text-sm transition-colors ${
    selected ? 'border-white bg-white text-black' : 'border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white'
  }`;

const FieldLabel: React.FC<{ htmlFor?: string; n: number; children: React.ReactNode }> = ({ htmlFor, n, children }) => {
  const content = (
    <>
      <span className="text-red-400">0{n}</span> · {children}
    </>
  );
  const className = 'mb-3 block font-mono text-xs uppercase tracking-widest text-neutral-500';
  return htmlFor ? (
    <label htmlFor={htmlFor} className={className}>
      {content}
    </label>
  ) : (
    <p className={className}>{content}</p>
  );
};

export const StartProject: React.FC = () => {
  const { brief, briefStatus, briefError, setBriefField, pickService, setCurrency, handleBriefSubmit } = useFreelance();
  const sending = briefStatus === 'sending';

  return (
    <Section labelledBy="start-heading">
      <SectionHeader
        id="start-heading"
        index="06"
        label="Start a project"
        title="Start a Project"
        description="Tell me what you need and what you want to spend. You get a written proposal with a fixed price."
      />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
        {/* How it works and how to reach me */}
        <div className="space-y-10 lg:col-span-5">
          <ol className="divide-y divide-neutral-800 border-y border-neutral-800">
            {NEXT_STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-2 py-5">
                <span className="pt-1 font-mono text-xs text-red-400">0{i + 1}</span>
                <div>
                  <p className="font-bold tracking-[-0.02em] text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-400">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="border border-neutral-800">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-800 px-5 py-3">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">Reach me directly</span>
              <StatusBadge label={AVAILABILITY} />
            </div>
            <dl className="grid grid-cols-2 border-b border-neutral-800 text-sm">
              <div className="border-r border-neutral-800 px-5 py-4">
                <dt className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">Calls</dt>
                <dd className="mt-1 text-white">{CALL_WINDOW}</dd>
              </div>
              <div className="px-5 py-4">
                <dt className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">Messages</dt>
                <dd className="mt-1 text-white">{REPLY_WINDOW}</dd>
              </div>
            </dl>
            <div className="space-y-1 px-5 py-4">
              {BOOKING_URL && (
                <div className="pb-3">
                  <SpotlightButton as="a" href={BOOKING_URL} target="_blank" rel="noopener noreferrer" variant="secondary">
                    BOOK A 30-MIN CALL <ArrowUpRight size={16} />
                  </SpotlightButton>
                </div>
              )}
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Project%20inquiry`}
                className="flex min-h-11 items-center gap-2 text-sm text-neutral-300 transition-colors hover:text-white"
              >
                <Mail size={15} aria-hidden="true" /> {CONTACT_EMAIL}
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
              >
                LinkedIn <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* The brief */}
        <form id="brief" onSubmit={handleBriefSubmit} noValidate className="scroll-mt-24 border border-neutral-800 lg:col-span-7">
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
                {SERVICES.map((s) => (
                  <button key={s.id} type="button" aria-pressed={brief.service === s.id} onClick={() => pickService(s.id)} className={chipClass(brief.service === s.id)}>
                    {s.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="sr-only">Budget</legend>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                  <span className="text-red-400">02</span> · Your budget
                </p>
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

            {briefStatus === 'sent' && (
              <p role="status" className="flex items-start gap-2 border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>Brief received. I&apos;ll reply within 24 hours.</span>
              </p>
            )}
            {briefStatus === 'mail-app' && (
              <p role="status" className="flex items-start gap-2 border border-neutral-700 bg-white/[0.03] p-3 text-sm text-neutral-300">
                <Mail size={16} className="mt-0.5 shrink-0" />
                <span>
                  Your email app should now be open with the brief. If nothing opened, email {CONTACT_EMAIL} and I&apos;ll reply within 24 hours.
                </span>
              </p>
            )}
            {briefError && (
              <p role="alert" className="border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {briefError}
              </p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="group flex min-h-13 w-full cursor-pointer items-center justify-center gap-2 bg-white font-mono text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-neutral-200 disabled:cursor-wait disabled:opacity-60"
            >
              {sending ? 'Sending…' : 'Send brief'}
              {!sending && <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </div>
        </form>
      </div>
    </Section>
  );
};

export default StartProject;
