import { useEffect, useState, useMemo } from 'react';

export function useWindowWidth() {
  const getWidth = () => window.innerWidth;

  const [width, setWidth] = useState(getWidth);

  // breakpoints
  const MOBILE = 768; // < 768
  const TABLET = 1024; // 768–1023
  // desktop — от TABLET и выше

  useEffect(() => {
    let timeout;

    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setWidth(getWidth());
      }, 150); // debounce
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // вычисляем флаги через useMemo
  const device = useMemo(() => {
    const isMobile = width < MOBILE;
    const isTablet = width >= MOBILE && width < TABLET;
    const isDesktop = width >= TABLET;

    return { isMobile, isTablet, isDesktop };
  }, [width]);

  return {
    width,
    ...device,
  };
}
