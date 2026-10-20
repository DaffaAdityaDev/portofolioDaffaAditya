import React, { useRef } from 'react';
import { m, useMotionValue, useMotionTemplate } from 'framer-motion';
import { DEFAULT_OFFSCREEN_COORD, SPOTLIGHT_BUTTON_METRICS } from '@/constant/constant';
import { cn } from '@/utils/cn';
import { buttonClasses } from './Button';

export interface SpotlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export const SpotlightButton: React.FC<SpotlightButtonProps> = ({
  children,
  variant = 'secondary',
  className = '',
  as = 'button',
  href,
  target,
  rel,
  onClick,
  ...props
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(DEFAULT_OFFSCREEN_COORD);
  const mouseY = useMotionValue(DEFAULT_OFFSCREEN_COORD);

  const rectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!rectRef.current) {
      rectRef.current = e.currentTarget.getBoundingClientRect();
    }
    mouseX.set(e.clientX - rectRef.current.left);
    mouseY.set(e.clientY - rectRef.current.top);
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    mouseX.set(DEFAULT_OFFSCREEN_COORD);
    mouseY.set(DEFAULT_OFFSCREEN_COORD);
  };

  // 120/60fps hardware-accelerated radial spotlight gradients
  const spotLightBg = useMotionTemplate`radial-gradient(${SPOTLIGHT_BUTTON_METRICS.BG_RADIUS}px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.16), transparent 80%)`;
  const spotLightBorder = useMotionTemplate`radial-gradient(${SPOTLIGHT_BUTTON_METRICS.BORDER_RADIUS}px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.7), transparent 75%)`;
  const primarySpecular = useMotionTemplate`radial-gradient(${SPOTLIGHT_BUTTON_METRICS.SPECULAR_RADIUS}px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.5), transparent 80%)`;

  const isPrimary = variant === 'primary';

  // Button's lg classes; the cursor light replaces the plain hover colors, so those are pinned.
  const baseStyles = buttonClasses({
    variant,
    size: 'lg',
    className: cn(
      'relative group overflow-hidden gap-2.5',
      isPrimary ? 'shadow-lg shadow-white/5 hover:bg-white' : 'bg-surface-1 border-border hover:border-border',
    ),
  });

  const content = (
    <>
      {/* Specular Surface Gradient Following Cursor */}
      {!isPrimary ? (
        <>
          {/* Following Cursor Border Glow */}
          <m.div
            className="absolute -inset-px rounded-lg pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 -z-10"
            style={{ background: spotLightBorder }}
          />
          {/* Underlying Dark Mask */}
          <div className="absolute inset-[1px] rounded-[calc(var(--radius)-1px)] bg-surface-1 -z-10" />
          {/* Following Cursor Surface Light */}
          <m.div
            className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: spotLightBg }}
          />
        </>
      ) : (
        <>
          {/* Primary White Button Cursor-Tracking Specular Flare */}
          <m.div
            className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 mix-blend-overlay"
            style={{ background: primarySpecular }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors rounded-lg" />
        </>
      )}

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </>
  );

  if (as === 'a' && href) {
    return (
      <a
        ref={containerRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(baseStyles, className)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={containerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(baseStyles, className)}
      {...props}
    >
      {content}
    </button>
  );
};

export default SpotlightButton;
