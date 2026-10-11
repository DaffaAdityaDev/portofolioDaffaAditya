import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { WORK_PROOF } from '../constants/content';
import { Section, SectionHeader } from './SectionHeader';

const linkClass = 'inline-flex min-h-11 items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest transition-colors';

export const SelectedWork: React.FC = () => {
  return (
    <Section labelledBy="work-heading">
      <SectionHeader
        id="work-heading"
        index="01"
        label="Selected work"
        title="Client Work"
        description="Systems in production for paying clients. Each one has a full case study."
      />

      <div className="space-y-16 md:space-y-24">
        {WORK_PROOF.map((work, i) => (
          <article key={work.id} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
            {/* Screenshot in a window frame, like the case-study heroes */}
            <Link
              href={work.href}
              className={`group block border border-neutral-800 bg-neutral-900 lg:col-span-7 ${i % 2 === 1 ? 'lg:order-2' : ''}`}
              aria-label={`${work.client} case study`}
            >
              <div className="flex items-center gap-1.5 border-b border-neutral-800 bg-[#0a0a0a] px-3 py-2">
                <span className="h-2 w-2 bg-emerald-400" />
                <span className="h-2 w-2 bg-neutral-700" />
                <span className="h-2 w-2 bg-neutral-700" />
                <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-neutral-400">{work.client}</span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={work.image}
                  alt={work.imageAlt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 720px, 100vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
            </Link>

            <div className="lg:col-span-5">
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
                {work.kind} · {work.year}
              </p>
              <h3 className="mt-3 text-2xl md:text-3xl font-bold leading-tight tracking-[-0.02em] text-white">{work.title}</h3>

              <div className="mt-6 border-y border-neutral-800 py-5">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black tracking-tighter text-red-400">{work.metric}</span>
                  <span className="text-sm leading-snug text-neutral-300">{work.metricLabel}</span>
                </div>
                {work.testimonial && (
                  <figure className="mt-5">
                    <blockquote className="text-lg leading-snug text-white">&ldquo;{work.testimonial.quote}&rdquo;</blockquote>
                    <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                      {work.testimonial.name} · {work.testimonial.role}
                    </figcaption>
                  </figure>
                )}
                {!work.testimonial && work.clientNote && (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-neutral-500">
                    [ Client note ] <span className="normal-case tracking-normal text-neutral-300">{work.clientNote}</span>
                  </p>
                )}
              </div>

              <dl className="mt-6 space-y-4 text-base leading-relaxed">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">The problem</dt>
                  <dd className="mt-1 text-neutral-300">{work.problem}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">What I built</dt>
                  <dd className="mt-1 text-neutral-300">{work.built}</dd>
                </div>
              </dl>

              <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-neutral-500">{work.stack.join(' · ')}</p>

              <div className="mt-6 flex flex-wrap gap-x-8">
                <Link href={work.href} className={`${linkClass} text-white hover:text-red-400`}>
                  Read the case study <ArrowUpRight size={14} />
                </Link>
                {work.liveUrl && (
                  <a href={work.liveUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} text-neutral-400 hover:text-white`}>
                    Visit live site <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-neutral-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-400">More projects, including my day-job work, are in the case studies.</p>
        <Link href="/case-studies" className={`${linkClass} text-white hover:text-red-400`}>
          All case studies <ArrowUpRight size={14} />
        </Link>
      </div>
    </Section>
  );
};

export default SelectedWork;
