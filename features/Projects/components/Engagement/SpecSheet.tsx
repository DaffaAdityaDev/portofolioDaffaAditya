import React from 'react';
import { MONO_LABEL } from './constants';
import type { CaseStudyEngagement } from './types';
import { filled, filledList, pillClass } from './utils';

interface SpecSheetProps {
  engagement: CaseStudyEngagement;
  /** Titles of the engagement's projects; listed only when there are several. */
  projectTitles: string[];
}

/** Literal classes, so Tailwind sees them: the last cell spans the rest of its row. */
const SPAN_MOBILE = ['', 'col-span-1', 'col-span-2'] as const;
const SPAN_DESKTOP = ['', 'md:col-span-1', 'md:col-span-2', 'md:col-span-3', 'md:col-span-4'] as const;
const SPAN_XL = ['', 'xl:col-span-1', 'xl:col-span-2'] as const;

/**
 * The engagement's context as an instrument spec sheet, in the article's side column (two
 * columns from xl up). Only filled cells render, so an unknown team size or period leaves no blank cell.
 */
const SpecSheet: React.FC<SpecSheetProps> = ({ engagement, projectTitles }) => {
  const { context, kindLabel, color } = engagement;
  const stack = filledList(context.stack);
  // A side project's "company" is already "Side project": don't repeat it in the next cell.
  const engagementCell = kindLabel.toLowerCase() === context.company.trim().toLowerCase() ? undefined : kindLabel;

  const cells = [
    { label: 'Company', value: context.company },
    { label: 'Type', value: context.companyType },
    { label: 'Role', value: context.role },
    { label: 'Period', value: context.period },
    { label: 'Team', value: context.teamSize },
    { label: 'Engagement', value: engagementCell },
    { label: 'Projects', value: projectTitles.length > 1 ? projectTitles.join(' + ') : undefined },
  ].filter((cell): cell is { label: string; value: string } => filled(cell.value));

  const n = cells.length;
  const lastMobile = n % 2 === 0 ? 1 : 2;
  const lastDesktop = n % 4 === 0 ? 1 : 4 - (n % 4) + 1;
  const lastSpan = `${SPAN_MOBILE[lastMobile]} ${SPAN_DESKTOP[lastDesktop]} ${SPAN_XL[lastMobile]}`;

  return (
    <div className="border border-[#27272a] bg-[#0e0e11]">
      <div className={`${MONO_LABEL} flex h-10 items-center border-b border-[#27272a] px-4 text-zinc-400`}>Spec sheet</div>
      <dl className="grid grid-cols-2 gap-px bg-[#27272a] md:grid-cols-4 xl:grid-cols-2">
        {cells.map((cell, i) => (
          <div key={cell.label} className={`min-w-0 bg-[#0e0e11] px-4 py-2.5 ${i === n - 1 ? lastSpan : ''}`}>
            <dt className={`${MONO_LABEL} text-zinc-400`}>{cell.label}</dt>
            <dd className="mt-1 text-[15px] font-medium leading-snug text-zinc-100 [overflow-wrap:anywhere]">
              {cell.value}
            </dd>
          </div>
        ))}
        {stack.length > 0 && (
          <div className="col-span-2 min-w-0 bg-[#0e0e11] px-4 py-3 md:col-span-4 xl:col-span-2">
            <dt className={`${MONO_LABEL} text-zinc-400`}>Stack</dt>
            <dd className="mt-2">
              <ul className="flex flex-wrap gap-1.5">
                {stack.map((tool) => (
                  <li key={tool} className={pillClass(color)}>
                    {tool}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
};

export default SpecSheet;
