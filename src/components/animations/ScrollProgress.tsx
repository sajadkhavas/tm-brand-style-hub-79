import React from 'react';
import { useScrollProgress } from '@/hooks/useScrollAnimation';

export const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-background/50">
      <div
        className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-100"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
};
