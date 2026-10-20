import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { DEFAULT_MARQUEE_SPEED } from '@/constant/constant';

export interface MarqueeProps {
  text: string;
  direction?: 'left' | 'right';
  type?: 'dark' | 'light';
  border?: boolean;
  opacity?: number;
  className?: string;
  speed?: number; // duration in seconds
}

const Marquee: React.FC<MarqueeProps> = ({
  text,
  direction = 'left',
  type = 'dark',
  border = true,
  opacity = 1,
  className = '',
  speed = DEFAULT_MARQUEE_SPEED,
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const isPaused = !isIntersecting || !!shouldReduceMotion;

  // Split items if separated by '///', or treat as single item
  const items = text.includes('///') ? text.split('///').map((s) => s.trim()).filter(Boolean) : [text.trim()];

  const isDark = type === 'dark';

  const renderItemSequence = (repeatKey: string) => (
    <div className="flex shrink-0 items-center">
      {/* Repeat sequence 3 times per track to ensure 100% coverage on 4K/Ultrawide */}
      {[0, 1, 2].map((loopIdx) => (
        <React.Fragment key={`${repeatKey}-${loopIdx}`}>
          {items.map((item, idx) => (
            <div
              key={`${repeatKey}-${loopIdx}-${idx}`}
              className="inline-flex items-center gap-3.5 mx-3.5 md:mx-5 group/item select-none cursor-default"
            >
              <span
                className={`text-2xs md:text-xs font-mono font-extrabold tracking-[0.22em] uppercase transition-all duration-200 ${
                  isDark
                    ? 'text-muted-foreground group-hover/item:text-white group-hover/item:scale-105'
                    : 'text-neutral-700 group-hover/item:text-black group-hover/item:scale-105'
                }`}
              >
                {item}
              </span>

              {/* High-tech accent divider */}
              <span className="inline-flex items-center gap-2 opacity-50 group-hover/item:opacity-100 transition-opacity">
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-transform group-hover/item:scale-125 ${
                    isDark
                      ? 'bg-accent-brand shadow-[0_0_8px_rgba(239,68,68,0.9)]'
                      : 'bg-red-600 shadow-[0_0_4px_rgba(220,38,38,0.4)]'
                  }`}
                />
                <span
                  className={`text-2xs font-mono font-black tracking-widest ${
                    isDark ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                >
                  {'///'}
                </span>
              </span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={{ opacity }}
      className={`group relative w-full overflow-hidden whitespace-nowrap py-3 md:py-3.5 select-none transition-colors ${
        isDark
          ? 'bg-surface-1 text-white'
          : 'bg-white text-black shadow-[inset_0_1px_0_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.03)]'
      } ${
        border
          ? `border-y ${isDark ? 'border-border' : 'border-neutral-200/90'}`
          : ''
      } ${className}`}
    >
      {/* Edge Gradient Vignettes for smooth cinematic fade-in/out */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 z-10 ${
          isDark
            ? 'bg-gradient-to-r from-surface-1 to-transparent'
            : 'bg-gradient-to-r from-white to-transparent'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 z-10 ${
          isDark
            ? 'bg-gradient-to-l from-surface-1 to-transparent'
            : 'bg-gradient-to-l from-white to-transparent'
        }`}
      />

      {/* Dual-Track Perfect Infinite Loop (Zero Stutter / Seamless Hand-off) */}
      <div className="flex w-max">
        <div
          className={direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}
          style={{
            animationDuration: `${speed}s`,
            animationPlayState: isPaused ? 'paused' : undefined,
          }}
        >
          {renderItemSequence('track-a')}
        </div>
        <div
          className={direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'}
          style={{
            animationDuration: `${speed}s`,
            animationPlayState: isPaused ? 'paused' : undefined,
          }}
          aria-hidden="true"
        >
          {renderItemSequence('track-b')}
        </div>
      </div>
    </div>
  );
};

export default Marquee;