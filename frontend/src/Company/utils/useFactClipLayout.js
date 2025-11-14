import { useEffect, useState } from 'react';

const getFactClipLayout = (vw) => {
  const big = { width: 70, height: 82 };
  const medium = { width: 61.619, height: 72.135 };
  const small = { width: 55, height: 64.387 };

  if (!vw || Number.isNaN(vw)) {
    return { ...medium, right: 150, translateY: -40 };
  }

  if (vw >= 3001) return { ...big, right: 250, translateY: -39 };
  if (vw >= 1700) return { ...big, right: 150, translateY: -43 };

  if (vw >= 1369) return { ...medium, right: 90, translateY: -41 };
  if (vw >= 1025) return { ...medium, right: 90, translateY: -39 };
  if (vw >= 768) return { ...medium, right: 60, translateY: -38 };

  if (vw <= 375) return { ...small, right: 50, translateY: -33 };
  if (vw <= 390) return { ...small, right: 76, translateY: -31 };
  if (vw <= 414) return { ...small, right: 76, translateY: -32 };
  if (vw <= 430) return { ...small, right: 76, translateY: -33 };
  if (vw <= 479) return { ...small, right: 76, translateY: -34 };
  if (vw <= 500) return { ...small, right: 76, translateY: -36 };
  if (vw <= 579) return { ...small, right: 76, translateY: -37 };
  if (vw <= 600) return { ...small, right: 76, translateY: -41 };
  if (vw <= 679) return { ...small, right: 76, translateY: -42 };
  if (vw <= 700) return { ...small, right: 76, translateY: -44 };
  if (vw <= 730) return { ...small, right: 76, translateY: -46 };

  return { ...small, right: 76, translateY: -48 };
};

const useFactClipLayout = () => {
  const [layout, setLayout] = useState(() => {
    if (typeof window === 'undefined') {
      return getFactClipLayout(1440);
    }
    return getFactClipLayout(window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      const next = getFactClipLayout(window.innerWidth);
      setLayout((prev) =>
        prev.width === next.width &&
        prev.height === next.height &&
        prev.right === next.right &&
        prev.translateY === next.translateY
          ? prev
          : next
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return layout;
};

export default useFactClipLayout;