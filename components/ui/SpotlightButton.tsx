import React, { useRef } from 'react';
import { m, useMotionValue, useMotionTemplate } from 'framer-motion';
import { DEFAULT_OFFSCREEN_COORD, SPOTLIGHT_BUTTON_METRICS } from '@/constant/constant';

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

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(DEFAULT_OFFSCREEN_COORD);
    mouseY.set(DEFAULT_OFFSCREEN_COORD);
  };

  // 120/60fps hardware-accelerated radial spotlight gradients
  const spotLightBg = useMotionTemplate`radial-gradient(${SPOTLIGHT_BUTTON_METRICS.BG_RADIUS}px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.16), transparent 80%)`;
  const spotLightBorder = useMotionTemplate`radial-gradient(${SPOTLIGHT_BUTTON_METRICS.BORDER_RADIUS}px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.7), transparent 75%)`;
  const primarySpecular = useMotionTemplate`radial-gradient(${SPOTLIGHT_BUTTON_METRICS.SPECULAR_RADIUS}px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, 0.5), transparent 80%)`;

  const isPrimary = variant === 'primary';

  const baseStyles = isPrimary
    ? 'relative group h-13 px-7 bg-white text-black font-bold tracking-tight rounded-full overflow-hidden flex items-center justify-center gap-2.5 active:scale-95 whitespace-nowrap text-sm cursor-pointer shadow-lg shadow-white/5 transition-transform'
    : 'relative group h-13 px-7 bg-[#0d0d0f] text-neutral-200 font-medium text-sm rounded-full overflow-hidden flex items-center justify-center gap-2.5 active:scale-95 whitespace-nowrap cursor-pointer transition-transform border border-neutral-800 hover:text-white';

  const content = (
    <>
      {/* Specular Surface Gradient Following Cursor */}
      {!isPrimary ? (
        <>
          {/* Following Cursor Border Glow */}
          <m.div
            className="absolute -inset-px rounded-full pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 -z-10"
            style={{ background: spotLightBorder }}
          />
          {/* Underlying Dark Mask */}
          <div className="absolute inset-[1px] rounded-full bg-[#0d0d0f] -z-10" />
          {/* Following Cursor Surface Light */}
          <m.div
            className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{ background: spotLightBg }}
          />
        </>
      ) : (
        <>
          {/* Primary White Button Cursor-Tracking Specular Flare */}
          <m.div
            className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100 mix-blend-overlay"
            style={{ background: primarySpecular }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors rounded-full" />
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
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`${baseStyles} ${className}`}
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {content}
    </button>
  );
};

export default SpotlightButton;
