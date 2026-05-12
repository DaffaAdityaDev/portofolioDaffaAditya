import React, { useState, useEffect } from 'react';

interface MarqueeProps {
   text: string;
   direction?: 'left' | 'right';
   type?: 'dark' | 'light';
   border?: boolean;
   opacity?: number;
}

const Marquee: React.FC<MarqueeProps> = ({ text, direction = 'left', type = 'dark', border = true, opacity = 1 }) => {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Pause animation if scrolled more than 20px
      if (window.scrollY > 20) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ opacity }} className={`overflow-hidden whitespace-nowrap ${type === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} py-2 ${border ? `border-y border-${type === 'dark' ? 'white' : 'black'}` : ''}`}>
      <div 
        className={`inline-block animate-${direction === 'left' ? 'marquee' : 'marquee-reverse'}`}
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

