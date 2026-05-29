import React, { useState, useRef } from 'react';

interface AmbientGlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export const AmbientGlowCard: React.FC<AmbientGlowCardProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md rounded-xl overflow-hidden transition-all duration-500 group hover:border-red-500/30 hover:shadow-[0_0_40px_rgba(239,68,68,0.08)] ${className}`}
    >
      {/* Dynamic Hover Glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(239, 68, 68, 0.07), transparent 80%)`
        }}
      />
      
      {/* Design accents */}
      <div className="absolute top-0 left-0 w-[20px] h-[1px] bg-gradient-to-r from-red-500/20 to-transparent group-hover:from-red-500/70 transition-all duration-500" />
      <div className="absolute top-0 left-0 w-[1px] h-[20px] bg-gradient-to-b from-red-500/20 to-transparent group-hover:from-red-500/70 transition-all duration-500" />
      <div className="absolute bottom-0 right-0 w-[20px] h-[1px] bg-gradient-to-l from-red-500/10 to-transparent group-hover:from-red-500/40 transition-all duration-500" />
      <div className="absolute bottom-0 right-0 w-[1px] h-[20px] bg-gradient-to-t from-red-500/10 to-transparent group-hover:from-red-500/40 transition-all duration-500" />

      <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
};

export default AmbientGlowCard;
