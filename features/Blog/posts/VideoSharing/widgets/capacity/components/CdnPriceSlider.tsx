import React from 'react';
import { clamp, roundTo } from '@/utils/math';
import { cn } from '@/utils/cn';
import {
  AWS_CLOUDFRONT_TIERS,
  CDN_PRICE_POINTS,
  CDN_PRICE_SOURCES,
  CDN_PRICES_CHECKED,
  CDN_SLIDER,
  MB_PER_GB,
} from '../constants';
import { useVideoConstraints } from '../hooks/useVideoDesignSlices';
import { formatStorage } from '../utils/format';
import {
  blendedPricePerGb,
  positionToPrice,
  priceToPosition,
  snapPosition,
} from '../utils/pricing';

const CHECKPOINT_PRICES = CDN_PRICE_POINTS.map((point) => point.pricePerGb);
const LAST_POSITION = CDN_PRICE_POINTS.length - 1;

const formatPrice = (value: number): string => `$${value.toFixed(3)}`;

/**
 * Horizontal position of a point along the track. A native range thumb never
 * reaches the very edge, so the track is inset by half a thumb on each side.
 * Labels, stems and the filled track all use this same formula.
 */
const trackOffset = (fraction: number): string =>
  `calc(var(--thumb) / 2 + (100% - var(--thumb)) * ${fraction})`;

/**
 * CDN price slider with one checkpoint per real provider price, named above the
 * track. Dragging between two checkpoints gives an in-between price.
 */
const CdnPriceSlider: React.FC = () => {
  const { constraints, estimates, setConstraint } = useVideoConstraints();
  const price = constraints.cdnCostPerGb;
  const position = priceToPosition(price, CHECKPOINT_PRICES);
  const active = CDN_PRICE_POINTS.find(
    (point) => Math.abs(point.pricePerGb - price) < CDN_SLIDER.priceEpsilon,
  );
  const awsBlended = blendedPricePerGb(estimates.monthlyEgressGb, AWS_CLOUDFRONT_TIERS);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number(event.target.value);
    const next = positionToPrice(snapPosition(raw, CDN_SLIDER.snapRadius), CHECKPOINT_PRICES);
    setConstraint('cdnCostPerGb', roundTo(next, CDN_SLIDER.decimals));
  };

  const jumpToCheckpoint = (index: number) => {
    const clamped = clamp(index, 0, LAST_POSITION);
    setConstraint('cdnCostPerGb', CHECKPOINT_PRICES[clamped]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowUp';
    const backward = event.key === 'ArrowLeft' || event.key === 'ArrowDown';
    if (!forward && !backward) return;

    event.preventDefault();
    const onCheckpoint = Number.isInteger(position);
    if (forward) jumpToCheckpoint(onCheckpoint ? position + 1 : Math.ceil(position));
    else jumpToCheckpoint(onCheckpoint ? position - 1 : Math.floor(position));
  };

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="font-mono text-xs uppercase tracking-wider text-neutral-400">
        CDN price per GB
      </div>

      <div className="px-4" style={{ '--thumb': '16px' } as React.CSSProperties}>
        <div className="relative h-14" aria-hidden="true">
          {CDN_PRICE_POINTS.map((point, index) => {
            const isUpperRow = index % 2 === 0;
            return (
              <React.Fragment key={point.id}>
                <span
                  style={{ left: trackOffset(index / LAST_POSITION) }}
                  className={cn(
                    'absolute bottom-0 w-px -translate-x-1/2 bg-neutral-700',
                    isUpperRow ? 'top-[1.5rem]' : 'top-[3.25rem]',
                  )}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setConstraint('cdnCostPerGb', point.pricePerGb)}
                  style={{ left: trackOffset(index / LAST_POSITION) }}
                  className={cn(
                    'absolute -mx-1 flex -translate-x-1/2 cursor-pointer flex-col items-center whitespace-nowrap px-1 font-mono text-[10px] leading-tight transition-colors',
                    // Neighbours alternate between two rows so seven labels fit a narrow column.
                    isUpperRow ? 'top-0' : 'top-7',
                    point === active ? 'text-red-500' : 'text-neutral-500 hover:text-neutral-200',
                  )}
                >
                  <span className="font-bold">{point.short}</span>
                  <span>{formatPrice(point.pricePerGb)}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <input
          type="range"
          className="checkpoint-range"
          aria-label="CDN price per GB"
          aria-valuetext={`${formatPrice(price)} per GB${active ? `, ${active.label}` : ''}`}
          min={0}
          max={LAST_POSITION}
          step={CDN_SLIDER.step}
          value={position}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{ '--fill': trackOffset(position / LAST_POSITION) } as React.CSSProperties}
        />
      </div>

      <div className="text-xs leading-relaxed text-neutral-500" role="status">
        <span className="font-mono font-bold text-white">{formatPrice(price)}</span> per GB
        {active ? (
          <>
            {' '}
            · <span className="text-neutral-300">{active.label}</span>, {active.detail}
          </>
        ) : (
          ' · between two providers, interpolated'
        )}
      </div>

      <div className="break-words text-xs leading-relaxed text-neutral-500">
        List prices for the US and Europe, checked {CDN_PRICES_CHECKED}. At this volume (
        {formatStorage(estimates.monthlyEgressGb * MB_PER_GB)} a month) AWS CloudFront blends to
        about <span className="text-neutral-300">{formatPrice(awsBlended)}</span> per GB, because
        each pricing tier covers only part of the traffic. Large customers usually negotiate below
        list. Sources:{' '}
        {CDN_PRICE_SOURCES.map((source, index) => (
          <React.Fragment key={source.href}>
            {index > 0 && ', '}
            <a href={source.href} target="_blank" rel="noopener noreferrer">
              {source.label}
            </a>
          </React.Fragment>
        ))}
        .
      </div>
    </div>
  );
};

export default CdnPriceSlider;
