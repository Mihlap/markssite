import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournals } from '../../store/Slice/journalSlice';
import CategoryButton from './CategoryButton';
import styles from './CategoryFilters.module.scss';
import { categoriesConfig } from './categories.js';

function CategoryFilters() {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchJournals());
  }, [dispatch]);

  const categoriesList = useMemo(() => {
    if (!journals.length) return [];
    const allCategories = journals.flatMap((j) => j.category || []);
    const uniqueCats = Array.from(new Set(allCategories));

    const catCounts = {};
    for (const journal of journals) {
      for (const cat of journal.category || []) {
        catCounts[cat] = (catCounts[cat] || 0) + 1;
      }
    }
    
    return uniqueCats.map((cat) => ({
      cat,
      count: catCounts[cat],
    }));
  }, [journals]);

  const handleCategoryClick = useCallback((cat) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
  }, []);

  return (
    <div className={styles.categoryFilters}>
      {categoriesList.map(({ cat, count }) => {
        const { color, icon } = categoriesConfig[cat] || {
          color: '#000',
          icon: null,
        };

        return (
          <CategoryButton
            key={cat}
            cat={cat}
            count={count}
            color={color}
            icon={icon}
            isActive={selectedCategory === cat}
            onClick={handleCategoryClick}
          />
        );
      })}
    </div>
  );
}

export default CategoryFilters;
