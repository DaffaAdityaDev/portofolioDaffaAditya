import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { expand } from './anim';
import { useAnimation } from '@/contexts/AnimationContext';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { state, resetAnimation } = useAnimation();
  const { isAnimating, duration, columns } = state;
  
  const totalDuration = (duration.base + duration.delay * (columns - 1)) * 1000;

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, totalDuration);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // Prevent scroll during transition
      
      const timer = setTimeout(() => {
        resetAnimation();
        document.body.style.overflow = ''; // Re-enable scroll after transition
      }, totalDuration);
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isAnimating, totalDuration, resetAnimation]);

  const anim = (variants: any, custom: number | null = null) => ({
    initial: "initial",
    animate: "enter",
    exit: "exit",
    custom,
    variants
  });

  return (
    <div className='relative h-full'>
      <div className={`fixed top-0 left-0 w-full h-screen flex z-40 bg-dark
        transition-opacity duration-300 pointer-events-none
        ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(columns)].map((_, i) => (
          <motion.div 
            key={i} 
            {...anim(expand, columns - i)} 
            className={`dark:bg-neutral-800 bg-black w-full h-full`}
          />
        ))}
      </div>
      <div className="h-full">
        {children}
      </div>
    </div>
  );
}