import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'blur' | 'rotate';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
}

const animationStyles: Record<AnimationType, { initial: string; visible: string }> = {
  'fade-up': {
    initial: 'opacity-0 translate-y-16',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-down': {
    initial: 'opacity-0 -translate-y-16',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-left': {
    initial: 'opacity-0 translate-x-16',
    visible: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    initial: 'opacity-0 -translate-x-16',
    visible: 'opacity-100 translate-x-0',
  },
  'scale': {
    initial: 'opacity-0 scale-90',
    visible: 'opacity-100 scale-100',
  },
  'blur': {
    initial: 'opacity-0 blur-lg',
    visible: 'opacity-100 blur-0',
  },
  'rotate': {
    initial: 'opacity-0 rotate-12',
    visible: 'opacity-100 rotate-0',
  },
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  className,
  threshold = 0.1,
}) => {
  const { ref, isVisible } = useScrollAnimation({ threshold });
  const { initial, visible } = animationStyles[animation];

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all',
        isVisible ? visible : initial,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
};
