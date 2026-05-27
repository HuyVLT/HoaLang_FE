'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AnimatedNumberProps {
  /**
   * Target value to count up to
   */
  value: number;
  /**
   * Optional string suffix (e.g. '+', '%', ' Làng')
   */
  suffix?: string;
  /**
   * Animation duration in seconds (defaults to 1.5s)
   */
  duration?: number;
  /**
   * Optional custom tailwind classes
   */
  className?: string;
}

/**
 * AnimatedNumber - An elegant numeric counter that animates from 0 to target value.
 * Triggers automatically via Framer Motion `useInView` when it scrolls into view.
 */
export default function AnimatedNumber({
  value,
  suffix = '',
  duration = 1.5,
  className,
}: AnimatedNumberProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: '-50px' });
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        ease: [0.16, 1, 0.3, 1], // premium ease-out-expo
        onUpdate: (latest) => {
          setCount(Math.floor(latest));
        },
      });

      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return (
    <span
      ref={elementRef}
      className={cn(
        "font-heading tabular-nums select-none",
        className
      )}
    >
      {count.toLocaleString('vi-VN')}
      {suffix}
    </span>
  );
}

export { AnimatedNumber };
