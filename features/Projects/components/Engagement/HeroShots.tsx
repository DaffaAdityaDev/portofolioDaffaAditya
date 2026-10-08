import React from 'react';
import Image from 'next/image';
import { isPortraitShot, shotSize } from '../CaseStudyArt/ProductShot';

export interface HeroShot {
  src: string;
  /** Project title as shown elsewhere, e.g. "ACCOUNTING+". */
  title: string;
}

interface ShotFrameProps extends HeroShot {
  priority: boolean;
  className?: string;
}

/** Visible part of a screenshot, as fractions of the full image. */
interface Crop {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Screenshots whose top is mostly marketing page: the frame shows the product UI inside them
 * instead. The platform shot is a landing page with the builder in its lower half.
 */
const CROPS: Record<string, Crop> = {
  '/image/projects/platform.webp': { x: 0.22, y: 0.31, w: 0.56, h: 0.62 },
};

/** The shots column: full width below lg, about 7/12 of the 1320px container from lg up. */
const SIZES = '(min-width: 1024px) 720px, (min-width: 768px) 620px, 100vw';

const SHADOW = 'shadow-[0_28px_60px_-18px_rgba(0,0,0,0.9),0_0_0_1px_rgba(0,0,0,0.6)]';

/** Square pixel "traffic lights". Decorative. */
const ChromeDots = () => (
  <span aria-hidden="true" className="flex shrink-0 gap-1">
    <span className="h-1.5 w-1.5 bg-[var(--cs-accent)]" />
    <span className="h-1.5 w-1.5 bg-[#3f3f46]" />
    <span className="h-1.5 w-1.5 bg-[#3f3f46]" />
  </span>
);

const Img: React.FC<{ src: string; alt: string; priority: boolean }> = ({ src, alt, priority }) => {
  const { width, height } = shotSize(src);
  const crop = CROPS[src];
  const common = {
    src,
    alt,
    width,
    height,
    sizes: SIZES,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    decoding: 'async' as const,
  };

  if (!crop) {
    return <Image {...common} className="block h-auto w-full bg-[#111114]" style={{ aspectRatio: `${width} / ${height}` }} />;
  }

  // The box keeps the crop's ratio, so nothing shifts while the image loads. Percent margins
  // resolve against the box width, which is why both offsets are scaled by it.
  const scale = 1 / crop.w;
  return (
    <div
      className="relative overflow-hidden bg-[#111114]"
      style={{ aspectRatio: `${crop.w * width} / ${crop.h * height}` }}
    >
      <Image
        {...common}
        className="absolute left-0 top-0 block h-auto max-w-none"
        style={{
          width: `${scale * 100}%`,
          aspectRatio: `${width} / ${height}`,
          marginLeft: `${-crop.x * scale * 100}%`,
          marginTop: `${-crop.y * scale * (height / width) * 100}%`,
        }}
      />
    </div>
  );
};

/** One screenshot in a browser window (landscape) or a phone body (portrait), captioned by its title. */
const ShotFrame: React.FC<ShotFrameProps> = ({ src, title, priority, className = '' }) => {
  const alt = `Screenshot of ${title}`;
  const caption = <span className="min-w-0 truncate">{title}</span>;

  if (isPortraitShot(src)) {
    return (
      <figure className={`min-w-0 border border-white/[0.12] bg-[#0e0e11] p-1.5 ${SHADOW} ${className}`}>
        <Img src={src} alt={alt} priority={priority} />
        <figcaption className="flex items-center gap-2 px-1 pt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-300">
          <ChromeDots />
          {caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className={`min-w-0 overflow-hidden border border-white/[0.12] bg-[#0e0e11] ${SHADOW} ${className}`}>
      <figcaption className="flex h-6 items-center gap-2.5 border-b border-white/[0.08] bg-[#141417] px-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-300">
        <ChromeDots />
        {caption}
      </figcaption>
      <Img src={src} alt={alt} priority={priority} />
    </figure>
  );
};

/**
 * The engagement's project screenshots as product shots over the hero art. One project: a single
 * frame. Several: below md they sit side by side or stacked at full width, never overlapping;
 * from md up the next one steps down and right, covering only the corner of the one before.
 */
const HeroShots: React.FC<{ shots: HeroShot[] }> = ({ shots }) => {
  if (shots.length === 0) return null;

  if (shots.length === 1) {
    const [shot] = shots;
    const portrait = isPortraitShot(shot.src);
    return (
      <div className={portrait ? 'mx-auto w-[min(56%,230px)] lg:mr-[12%]' : 'w-full'}>
        <ShotFrame {...shot} priority />
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:block">
      {shots.map((shot, i) => (
        <ShotFrame
          key={shot.src}
          {...shot}
          priority={i === 0}
          // md and up: each next frame overlaps about a quarter of the previous one's lower right.
          className={i === 0 ? 'relative w-full md:w-[64%]' : 'relative z-10 w-full md:-mt-[10%] md:ml-auto md:w-[60%]'}
        />
      ))}
    </div>
  );
};

export default HeroShots;
