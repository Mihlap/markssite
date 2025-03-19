import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournals } from '../../store/Slice/journalSlice';
import DesktopCategoryFilters from './DesktopCategoryFilters';
import MobileCategoryFilters from './MobileCategoryFilters';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function CategoryFilters() {
  const dispatch = useDispatch();
  const windowWidth = useWindowWidth();
  const journals = useSelector((state) => state.journal.journals);

  useEffect(() => {
    dispatch(fetchJournals());
  }, [dispatch]);

  const categoriesList = useMemo(() => {
    if (!journals.length) return [];
    const catCounts = journals.reduce((acc, { category = [] }) => {
      category.forEach((cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    }, {});
    return Object.entries(catCounts).map(([cat, count]) => ({ cat, count }));
  }, [journals]);
 
  if (windowWidth > 1024) {
    return <DesktopCategoryFilters categoriesList={categoriesList} />;
  } else {
    return <MobileCategoryFilters categoriesList={categoriesList} />;
  }
}

export default CategoryFilters;
