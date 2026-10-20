import React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';

/**
 * The site button. <Button href="/freelance">Hire me</Button> renders a Next Link, otherwise a <button>.
 * Use `buttonClasses()` to style something that can't be a Button (e.g. SpotlightButton, a <label>).
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg whitespace-nowrap cursor-pointer transition-[color,background-color,border-color,transform] duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-white text-black hover:bg-neutral-200',
  secondary: 'border border-border-strong text-neutral-200 hover:border-white hover:text-white',
  ghost: 'bg-white/5 text-neutral-200 hover:bg-white/10 hover:text-white',
};

// sm is a mono uppercase pill (matches nav and modal actions); md and lg are bold sans CTAs.
const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 font-mono text-xs font-bold uppercase tracking-wider',
  md: 'h-11 px-5 text-sm font-bold tracking-tight',
  lg: 'h-13 px-7 text-sm font-bold tracking-tight',
};

export const buttonClasses = ({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) =>
  cn(BASE, VARIANTS[variant], SIZES[size], className);

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = ButtonOwnProps &
  (
    | ({ href: string } & Omit<React.ComponentProps<typeof Link>, 'href' | 'className' | 'children'>)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>)
  );

const Button = ({ variant, size, className, children, ...props }: ButtonProps) => {
  const classes = buttonClasses({ variant, size, className });

  if (props.href !== undefined) {
    return (
      <Link className={classes} {...props}>
        {children}
      </Link>
    );
  }

  const { type = 'button', ...buttonProps } = props;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
};

export default Button;
