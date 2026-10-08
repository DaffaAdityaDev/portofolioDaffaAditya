import React, { useEffect } from 'react';
import { m, useSpring, useTransform } from 'framer-motion';
import { SPRING_COUNTER } from '@/constant/animations';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { AnimatedNumberProps } from '@/types/blog';

/** Counts toward `value` with a spring instead of snapping, and formats on the fly. */
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, format, className }) => {
  const reduceMotion = usePrefersReducedMotion();
  const spring = useSpring(value, SPRING_COUNTER);
  const text = useTransform(spring, format);

  useEffect(() => {
    if (reduceMotion) spring.jump(value);
    else spring.set(value);
  }, [spring, value, reduceMotion]);

  return <m.span className={className}>{text}</m.span>;
};

export default AnimatedNumber;
