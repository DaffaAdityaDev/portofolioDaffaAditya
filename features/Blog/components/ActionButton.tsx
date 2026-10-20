import React from 'react';
import { cn } from '@/utils/cn';

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `solid` is the red call to action, `bordered` the quiet default, `light` a bare text button. */
  variant?: 'solid' | 'bordered' | 'light';
  /** Square 32px button for a single icon. Pass `aria-label`. */
  iconOnly?: boolean;
}

// `bordered` and `light` use the colors of the site Button's `secondary` and `ghost` variants
// (components/ui/Button); `solid` is the accent call to action, which Button has no variant for.
const VARIANT_CLASS: Record<NonNullable<ActionButtonProps['variant']>, string> = {
  solid: 'bg-accent-brand text-white hover:bg-accent-brand-hover',
  bordered: 'border border-border-strong bg-transparent text-neutral-200 hover:border-white hover:text-white',
  light: 'bg-transparent text-neutral-200 hover:bg-white/10 hover:text-white',
};

/** Small 32px tall button used by the blog widgets' controls. */
const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'solid',
  iconOnly = false,
  type = 'button',
  className,
  children,
  ...props
}) => (
  <button
    type={type}
    className={cn(
      'relative inline-flex h-8 cursor-pointer select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-lg text-xs font-normal',
      'transition duration-250 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100',
      'focus-visible:z-10',
      'disabled:pointer-events-none disabled:opacity-50',
      iconOnly ? 'w-8 min-w-8 px-0' : 'min-w-16 gap-2 px-3',
      VARIANT_CLASS[variant],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export default ActionButton;
