import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { ABOUT_ME_DATA, GITHUB_URL, LINKEDIN_URL } from '../constants/content';
import Section from '@/components/ui/Section';
import SectionHeader from '@/components/ui/SectionHeader';
import { monoLinkClass } from './styles';

const linkClass = `${monoLinkClass} text-neutral-300 hover:text-accent-brand-hover`;

const AboutFreelancer: React.FC = () => {
  // No id here: #about-section sits on the page's wrapper, outside the lazy boundary.
  return (
    <Section labelledBy="about-heading">
      <SectionHeader
        id="about-heading"
        index="04"
        label="About"
        title="Who You'll Work With"
        description="The engineer behind the projects above."
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Portrait: a compact row on phones, a full card from lg up */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-4 overflow-hidden rounded-lg border border-border p-3 lg:block lg:p-0">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-900 lg:rounded-none lg:h-auto lg:w-full lg:aspect-[4/5]">
              <Image
                src={ABOUT_ME_DATA.image}
                alt={ABOUT_ME_DATA.imageAlt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 400px, 96px"
                className="object-cover"
              />
            </div>
            <div className="lg:border-t lg:border-border lg:px-5 lg:py-4">
              <p className="text-lg font-bold tracking-[-0.02em] text-white">{ABOUT_ME_DATA.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{ABOUT_ME_DATA.role}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-widest text-neutral-500">
                <MapPin size={12} /> {ABOUT_ME_DATA.location}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <p className="text-xl md:text-2xl font-semibold leading-snug tracking-[-0.02em] text-white">{ABOUT_ME_DATA.bio}</p>

          <ul className="mt-10 divide-y divide-border border-y border-border">
            {ABOUT_ME_DATA.highlights.map((h, i) => (
              <li key={h} className="grid grid-cols-[2.5rem_1fr] gap-2 py-5 text-base leading-relaxed text-neutral-300">
                <span className="pt-0.5 font-mono text-xs text-accent-brand">0{i + 1}</span>
                {h}
              </li>
            ))}
          </ul>

          {/* Everything above can be checked outside this site */}
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-1">
            <span className="font-mono text-2xs uppercase tracking-widest text-neutral-500">Check my background</span>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
              GitHub <ArrowUpRight size={14} />
            </a>
            <Link href="/resume" className={linkClass}>
              Resume <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default AboutFreelancer;
