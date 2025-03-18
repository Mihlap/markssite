import React from 'react';
import DesktopCategoryFilters from './DesktopCategoryFilters';
import MobileCategoryFilters from './MobileCategoryFilters';

/** Хук, чтобы отслеживать ширину окна и переключать логику */
function useWindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function CategoryFilters() {
  const windowWidth = useWindowWidth();

  if (windowWidth > 1024) {
    return <DesktopCategoryFilters />;
  } else {
    return <MobileCategoryFilters />;
  }
}

export default CategoryFilters;
