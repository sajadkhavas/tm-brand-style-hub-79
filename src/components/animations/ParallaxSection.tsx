import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down';
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  speed = 0.3,
  className,
  direction = 'up',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const ticking = useRef(false);

  const updateOffset = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = elementCenter - windowHeight / 2;
      const multiplier = direction === 'up' ? -1 : 1;
      setOffset(distanceFromCenter * speed * multiplier);
    }
    ticking.current = false;
  }, [speed, direction]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateOffset);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateOffset();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateOffset]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <div
        className="transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${offset}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  speed?: number;
  imageUrl?: string;
}

export const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  children,
  className,
  speed = 0.5,
  imageUrl,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const ticking = useRef(false);

  const updateScroll = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const scrollProgress = -rect.top * speed;
      setScrollY(scrollProgress);
    }
    ticking.current = false;
  }, [speed]);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScroll]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <div
        className="absolute inset-0 scale-125 transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${scrollY}px)`,
          backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
