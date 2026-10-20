import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useFreelanceStore } from '../store';
import { SERVICES } from '../constants/content';
import Section from '@/components/ui/Section';
import SectionHeader from '@/components/ui/SectionHeader';
import { monoLinkClass } from './styles';

const Services: React.FC = () => {
  const setStartMode = useFreelanceStore((s) => s.setStartMode);

  return (
    <Section id="services-section" labelledBy="services-heading">
      <SectionHeader
        id="services-heading"
        index="02"
        label="Services"
        title="What I Build"
        description="Four kinds of work. Every project gets a written proposal with a fixed price before work starts."
      />

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-2">
        {SERVICES.map((service, i) => {
          return (
            <article key={service.id} className="group flex flex-col bg-background p-6 sm:p-8 lg:p-10 transition-colors hover:bg-surface-1">
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest">
                <span className="text-accent-brand">0{i + 1}</span>
                <span className="text-muted-foreground">
                  Typically {service.weeks[0]}–{service.weeks[1]} weeks
                </span>
              </div>

              <h3 className="mt-6 text-2xl md:text-3xl font-bold tracking-[-0.02em] text-white">{service.name}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{service.goodFor}</p>

              <ul className="mt-6 space-y-2.5">
                {service.youGet.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-300">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-accent-brand" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
                {service.example ? (
                  <Link
                    href={service.example.href}
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-white"
                  >
                    Example: <span className="text-white underline decoration-neutral-700 underline-offset-4">{service.example.label}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                ) : (
                  <span />
                )}
                <a
                  href="#start"
                  onClick={() => setStartMode('brief', service.id)}
                  className={`${monoLinkClass} text-white hover:text-accent-brand-hover`}
                >
                  Start a project <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
};

export default Services;
