import { useEffect, useState } from 'react';

export const useIsDesktop = (minWidth = 1024) => {
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= minWidth : true
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= minWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minWidth]);

  return isDesktop;
};
