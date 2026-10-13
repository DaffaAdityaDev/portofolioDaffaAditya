import React from 'react';
import dynamic from 'next/dynamic';
import { ArrowUpRight, CalendarDays, FileText, Mail, type LucideIcon } from 'lucide-react';
import SpotlightButton from '@/components/ui/SpotlightButton';
import { useFreelanceStore, type StartMode } from '@/store/useFreelanceStore';
import { AVAILABILITY, CAL_LINK, CALL_WINDOW, CONTACT_EMAIL, LINKEDIN_URL, REPLY_WINDOW } from '../constants/content';
import BriefForm from './BriefForm';
import { Section, SectionHeader } from './SectionHeader';
import StatusBadge from './StatusBadge';

// Cal.com's script loads only once someone opens the calendar.
const CalEmbed = dynamic(() => import('./CalEmbed'), { ssr: false });

const MODES: readonly { id: StartMode; label: string; icon: LucideIcon }[] = [
  { id: 'brief', label: 'Send a brief', icon: FileText },
  { id: 'call', label: 'Book a call', icon: CalendarDays },
];

const NEXT_STEPS = [
  { title: 'Send the brief', body: 'What you need, your budget and your timeline. Two minutes.' },
  { title: 'I reply within 24 hours', body: 'With questions, and a time for a free 30-minute call after 17:00 WIB.' },
  { title: 'You get a proposal', body: 'Within 2-3 days: the feature list, a week-by-week plan and one fixed price.' },
];

export const StartProject: React.FC = () => {
  const startMode = useFreelanceStore((s) => s.startMode);
  const setStartMode = useFreelanceStore((s) => s.setStartMode);
  const callOpened = useFreelanceStore((s) => s.callOpened);

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
              {CAL_LINK && (
                <div className="pb-3">
                  <SpotlightButton as="button" type="button" onClick={() => setStartMode('call')} variant="secondary">
                    BOOK A 30-MIN CALL <CalendarDays size={16} />
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

        {/* The brief, or the booking calendar when a Cal.com link is set */}
        <div className="lg:col-span-7">
          {CAL_LINK && (
            <div role="tablist" aria-label="How to start" className="mb-4 grid grid-cols-2 border border-neutral-800">
              {MODES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  id={`start-tab-${id}`}
                  aria-selected={startMode === id}
                  aria-controls={`start-panel-${id}`}
                  onClick={() => setStartMode(id)}
                  className={`flex min-h-12 cursor-pointer items-center justify-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest transition-colors ${
                    startMode === id ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon size={14} aria-hidden /> {label}
                </button>
              ))}
            </div>
          )}

          <div id="start-panel-brief" {...(CAL_LINK && { role: 'tabpanel', 'aria-labelledby': 'start-tab-brief' })} hidden={startMode !== 'brief'}>
            <BriefForm />
          </div>

          {CAL_LINK && callOpened && (
            <div id="start-panel-call" role="tabpanel" aria-labelledby="start-tab-call" hidden={startMode !== 'call'} className="border border-neutral-800">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 px-5 py-3 sm:px-6">
                <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">Free call · 30 min · Google Meet</span>
                <a href={`https://cal.com/${CAL_LINK}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-widest text-neutral-500 transition-colors hover:text-white">
                  Open in new tab <ArrowUpRight size={12} />
                </a>
              </div>
              <CalEmbed />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default StartProject;
