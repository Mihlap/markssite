import { useEffect, useState } from 'react';

export function useCompanyHistoryBreakpoints() {
  const [isDesktop, setIsDesktop] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth > 1024 : true)
  );
  const [isTablet, setIsTablet] = useState(
    () =>
      typeof window !== 'undefined'
        ? window.innerWidth >= 768 && window.innerWidth <= 1024
        : false
  );
  const [mobileSlidesOffsetAfter, setMobileSlidesOffsetAfter] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      setIsDesktop(width > 1024);
      setIsTablet(width >= 768 && width <= 1024);
      setMobileSlidesOffsetAfter(width <= 1024 ? width : 0);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isDesktop, isTablet, mobileSlidesOffsetAfter };
}

