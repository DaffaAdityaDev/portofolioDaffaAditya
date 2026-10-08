import React from 'react';
import Image from 'next/image';
import type { StoryBlock } from '@/types/project';

const FIGURE_SIZES = '(min-width: 768px) 68ch, 100vw';

function renderBlock(block: StoryBlock, i: number, skip: Set<string>) {
  switch (block.kind) {
    case 'p':
      return (
        <p key={i} className="mt-6 text-[17px] leading-relaxed text-zinc-300">
          {block.text}
        </p>
      );
    case 'h':
      return (
        <h2 key={i} className="mt-12 font-display text-2xl font-semibold tracking-tight text-white [text-wrap:balance]">
          {block.text}
        </h2>
      );
    case 'list':
      return (
        <ul key={i} className="mt-6 list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-zinc-300 marker:text-zinc-600">
          {block.items.map((item, j) => (
            <li key={j}>{item}</li>
          ))}
        </ul>
      );
    case 'image':
      if (skip.has(block.src)) return null;
      return (
        <figure key={i} className="mt-10">
          <Image
            src={block.src}
            alt={block.alt}
            width={1600}
            height={1000}
            sizes={FIGURE_SIZES}
            className="h-auto w-full rounded-lg border border-white/10"
          />
          {block.caption && <figcaption className="mt-3 text-sm text-zinc-500">{block.caption}</figcaption>}
        </figure>
      );
    default:
      return null;
  }
}

/** The case study told as a short first-person article. Images already shown in the hero are skipped. */
const StoryBody: React.FC<{ blocks: StoryBlock[]; skipImages: string[] }> = ({ blocks, skipImages }) => {
  const skip = new Set(skipImages);
  return <div className="[&>*:first-child]:mt-0">{blocks.map((block, i) => renderBlock(block, i, skip))}</div>;
};

export default StoryBody;
