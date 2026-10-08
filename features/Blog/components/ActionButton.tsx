import React from 'react';
import { cn } from '@/utils/cn';

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** `solid` is the red call to action, `bordered` the quiet default, `light` a bare text button. */
  variant?: 'solid' | 'bordered' | 'light';
  /** Square 32px button for a single icon. Pass `aria-label`. */
  iconOnly?: boolean;
}

// The palette the widgets were designed with (red-500 #f31260 and zinc-700 #3f3f46 from the old UI kit).
const VARIANT_CLASS: Record<NonNullable<ActionButtonProps['variant']>, string> = {
  solid: 'bg-[#f31260] text-white hover:opacity-80',
  bordered:
    'border-2 border-[#3f3f46] bg-transparent text-[#ecedee] hover:opacity-80',
  light: 'bg-transparent text-white hover:bg-[#3f3f46]/40',
};

/** Small square-cornered button used by the blog widgets' controls. */
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
      'relative inline-flex h-8 cursor-pointer select-none items-center justify-center overflow-hidden whitespace-nowrap rounded-none text-xs font-normal',
      'transition duration-250 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 ',
      'focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500',
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
