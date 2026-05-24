import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface MarqueeProps {
   text: string;
   direction?: 'left' | 'right';
   type?: 'dark' | 'light';
   border?: boolean;
   opacity?: number;
}

const Marquee: React.FC<MarqueeProps> = ({ text, direction = 'left', type = 'dark', border = true, opacity = 1 }) => {
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

  // Pause animation if it's off-screen or if the user prefers reduced motion
  const isPaused = !isIntersecting || !!shouldReduceMotion;

  return (
    <div 
      ref={containerRef}
      style={{ opacity }} 
      className={`overflow-hidden whitespace-nowrap ${
        type === 'dark' ? 'bg-black text-white' : 'bg-white text-black'
      } py-2 ${
        border ? `border-y ${type === 'dark' ? 'border-white/10' : 'border-black/10'}` : ''
      }`}
    >
      <div 
        className={`inline-block ${
          direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse'
        }`}
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        <span className="text-xl font-bold font-mono tracking-tighter mx-4">{text}</span>
        <span className="text-xl font-bold font-mono tracking-tighter mx-4">{text}</span>
        <span className="text-xl font-bold font-mono tracking-tighter mx-4">{text}</span>
        <span className="text-xl font-bold font-mono tracking-tighter mx-4">{text}</span>
      </div>
    </div>
  );
};

export default Marquee;


