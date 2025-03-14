import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournals } from '../../store/Slice/journalSlice';
import CategoryButton from './CategoryButton';
import styles from './CategoryFilters.module.scss';
import { categoriesConfig } from './categories.js';

import { ReactComponent as SearchIcon } from '../icons/search.svg';
import { ReactComponent as CloseIcon } from '../icons/close.svg';

function CategoryFilters() {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const wrapperRef = useRef(null);

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


  useEffect(() => {
    if (searchValue.trim()) {   
      const matches = journals.filter((journal) => journal.title.toLowerCase().includes(searchValue.toLowerCase()));
      setFilteredResults(matches);
      setIsDropdownOpen(true);
    } else {
      setFilteredResults([]);
      setIsDropdownOpen(false);
    }
  }, [searchValue, journals]);
 
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  
  const handleClear = () => {
    setSearchValue('');
    setFilteredResults([]);
    setIsDropdownOpen(false);
  };
 
  useEffect(() => {
    function handleOutsideClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className={styles.categoryFiltersMain}>
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
          <div className={styles.searchContainer} ref={wrapperRef}>
            <SearchIcon className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Поиск"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchValue.trim() && filteredResults.length) {
                  setIsDropdownOpen(true);
                }
              }}
            />
            {searchValue && <CloseIcon className={styles.closeIcon} onClick={handleClear} />}

            {isDropdownOpen && filteredResults.length > 0 && (
              <div className={styles.dropdown}>
                {filteredResults.slice(0, 4).map((journal) => (
                  <div key={journal.id} className={styles.dropdownItem}>
                    {journal.title}
                  </div>
                ))}
              </div>
            )}
          </div>        
      </div>
    </div>
  );
}

export default CategoryFilters;
