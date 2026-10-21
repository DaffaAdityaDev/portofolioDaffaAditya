import React from 'react';
import Image from 'next/image';

/** Intrinsic sizes of the project screenshots, so every screenshot reserves its box before it loads. */
const SHOT_SIZES: Record<string, { width: number; height: number }> = {
  '/image/projects/platform.webp': { width: 1862, height: 984 },
  '/image/projects/accplus.webp': { width: 1885, height: 1004 },
  '/image/projects/ombudsman.webp': { width: 1077, height: 552 },
  '/image/projects/qltech.webp': { width: 1880, height: 990 },
  '/image/projects/artifyo.webp': { width: 1899, height: 999 },
  '/image/projects/aliman.webp': { width: 1905, height: 999 },
  '/image/projects/recyclops.webp': { width: 414, height: 882 },
  '/image/projects/echo-chat.webp': { width: 1600, height: 1048 },
  '/image/projects/filmyuk-hero.webp': { width: 1600, height: 900 },
};
const FALLBACK_SIZE = { width: 1600, height: 900 };

export const shotSize = (src: string) => SHOT_SIZES[src] ?? FALLBACK_SIZE;

/** Portrait screenshots get a phone frame, landscape ones a browser window. */
export const isPortraitShot = (src: string) => {
  const { width, height } = shotSize(src);
  return height > width;
};

export interface ShotItem {
  src: string;
  alt: string;
}

interface FrameProps extends ShotItem {
  /** Above the fold: loads eagerly, preloaded from the head at high priority (the index's LCP). */
  eager?: boolean;
  /** next/image `sizes`: the frame's rendered width. */
  sizes: string;
  className?: string;
  style?: React.CSSProperties;
}

/** The screenshot itself, at its intrinsic size so it reserves its box before it loads. */
const ShotImage: React.FC<Pick<FrameProps, 'src' | 'alt' | 'eager' | 'sizes'>> = ({ src, alt, eager, sizes }) => {
  const { width, height } = shotSize(src);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={eager ? 'eager' : 'lazy'}
      preload={eager}
      fetchPriority={eager ? 'high' : 'auto'}
      className="block h-auto w-full"
      style={{ aspectRatio: `${width} / ${height}` }}
    />
  );
};

/** A screenshot in a minimal browser window: three dots, a slim bar, a soft drop shadow. */
const BrowserFrame: React.FC<FrameProps> = ({ src, alt, eager, sizes, className = '', style }) => {
  return (
    <figure
      className={`overflow-hidden rounded-lg border border-border bg-surface-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(0,0,0,0.6)] ${className}`}
      style={style}
    >
      <div aria-hidden="true" className="flex h-5 items-center gap-1 border-b border-border bg-neutral-900 px-2">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
        <span className="ml-2 h-2 flex-1 rounded-sm bg-white/[0.05]" />
      </div>
      <ShotImage src={src} alt={alt} eager={eager} sizes={sizes} />
    </figure>
  );
};

/** A portrait screenshot in a slim phone body. */
const PhoneFrame: React.FC<FrameProps> = ({ src, alt, eager, sizes, className = '', style }) => {
  return (
    <figure
      className={`overflow-hidden rounded-[14px] border-[3px] border-border bg-surface-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.85)] ${className}`}
      style={style}
    >
      <ShotImage src={src} alt={alt} eager={eager} sizes={sizes} />
    </figure>
  );
};

const LIFT =
  'transition-transform duration-300 ease-out-expo motion-safe:group-hover:-translate-y-1 motion-safe:group-focus-within:-translate-y-1';

/**
 * The project screenshot(s) layered over a card poster, sitting high so most of each frame shows.
 * One project: a single centred window. Two or more: the first sits back and left, the second
 * in front and right, so both read at a glance. The poster must be `relative overflow-hidden`.
 */
export const PosterShots: React.FC<{ shots: ShotItem[]; eager?: boolean; wide?: boolean }> = ({
  shots,
  eager,
  wide,
}) => {
  if (shots.length === 0) return null;
  // The poster is about half the viewport in a two-column card, a bit more in a wide one.
  const sizes = wide ? '(min-width: 768px) 60vw, 100vw' : '(min-width: 768px) 50vw, 100vw';

  if (shots.length === 1) {
    const [shot] = shots;
    if (isPortraitShot(shot.src)) {
      return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[12%] z-[6] flex justify-center">
          <PhoneFrame {...shot} eager={eager} sizes="180px" className={`w-[30%] max-w-[180px] self-start ${LIFT}`} />
        </div>
      );
    }
    return (
      <div className="pointer-events-none absolute inset-x-0 top-[12%] z-[6] flex justify-center">
        <BrowserFrame {...shot} eager={eager} sizes={sizes} className={`w-[86%] ${LIFT}`} />
      </div>
    );
  }

  const [back, front] = shots;
  return (
    <div className="pointer-events-none absolute inset-0 z-[6]">
      <BrowserFrame
        {...back}
        eager={eager}
        sizes={sizes}
        className={`absolute left-[6%] top-[12%] w-[62%] opacity-90 ${LIFT}`}
      />
      <BrowserFrame {...front} eager={eager} sizes={sizes} className={`absolute right-[6%] top-[26%] w-[62%] ${LIFT}`} />
    </div>
  );
};
