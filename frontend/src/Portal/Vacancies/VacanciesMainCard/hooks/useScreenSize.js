import { useState, useEffect } from 'react';

export function useScreenSize() {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [size, setSize] = useState(getSize);

  useEffect(() => {
    const handleResize = () => {
      setSize(getSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
