import React, { useId } from 'react';
import type { SliderFieldProps } from '@/types/blog';

/*
 * Native range input drawn like the old UI kit's small danger slider: a 4px rounded track, red up
 * to the thumb centre (`--fill`, 0..1, set inline) and a 20px red ring thumb. Utilities rather
 * than a CSS module, so the styles ship in the global sheet and the static HTML is styled before
 * the widget chunk loads. Written out in full so Tailwind can find every class.
 */
const RANGE_CLASS = [
  'block h-5 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none',
  '[--track-bg:linear-gradient(to_right,#f31260_0_calc(10px_+_(100%_-_20px)_*_var(--fill)),rgb(82_82_91/0.5)_0)]',
  '[&::-webkit-slider-runnable-track]:[background:var(--track-bg)] [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full',
  '[&::-moz-range-track]:[background:var(--track-bg)] [&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full',
  '[&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#f31260] [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:-mt-2 [&::-webkit-slider-thumb]:appearance-none',
  '[&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#f31260] [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-grab',
  'active:[&::-webkit-slider-thumb]:cursor-grabbing active:[&::-moz-range-thumb]:cursor-grabbing',
  'focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-red-500',
  'focus-visible:[&::-moz-range-thumb]:outline-2 focus-visible:[&::-moz-range-thumb]:outline-offset-2 focus-visible:[&::-moz-range-thumb]:outline-red-500',
].join(' ');

/** Native range slider with the blog's mono label style and the formatted value on the right. */
const SliderField: React.FC<SliderFieldProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = String,
}) => {
  const id = useId();
  const fill = max > min ? (value - min) / (max - min) : 0;

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full items-center justify-between">
        <label htmlFor={id} className="font-mono text-xs uppercase tracking-wider text-neutral-400">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-xs text-white">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        className={RANGE_CLASS}
        style={{ '--fill': fill } as React.CSSProperties}
      />
    </div>
  );
};

export default SliderField;
