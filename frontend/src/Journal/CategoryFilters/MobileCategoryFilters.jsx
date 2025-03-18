import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournals } from '../../store/Slice/journalSlice';
import CategoryButton from './CategoryButton';
import styles from './CategoryFilters.module.scss';
import { categoriesConfig } from './categories.js';

import { ReactComponent as SearchIcon } from '../icons/search.svg';
import { ReactComponent as CloseIcon } from '../icons/close.svg';

function MobileCategoryFilters() {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); 
  const [prevSearchValue, setPrevSearchValue] = useState('');
  const [prevSelectedCategory, setPrevSelectedCategory] = useState(null);
  const [mobileInput, setMobileInput] = useState('');

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

  const mobileFilteredResults = useMemo(() => {
    const query = mobileInput.trim().toLowerCase();
    if (!query) return [];
    return journals.filter((journal) => journal.title.toLowerCase().includes(query));
  }, [mobileInput, journals]);

  const openOverlay = () => {
    setPrevSearchValue(searchValue);
    setPrevSelectedCategory(selectedCategory);
    setMobileInput(searchValue);
    setIsOverlayOpen(true);
  };


  const handleCancel = () => {
    // setSearchValue(prevSearchValue);
    // setSelectedCategory(prevSelectedCategory);
    setIsOverlayOpen(false);
  };

const handleClearOverlayInput = () => {
  setMobileInput('');
  setSearchValue('');
  setSelectedCategory(null);
};

  const handleClearMainSearch = (e) => {
    e.stopPropagation();
    setSearchValue('');
    setSelectedCategory(null);
  };

 const handleCategoryClick = (cat) => {
   if (selectedCategory === cat) {
     setSearchValue('');
     setSelectedCategory(null);
     setMobileInput('');
   } else {
     setSearchValue(cat);
     setSelectedCategory(cat);
     setIsOverlayOpen(false);
   }
 };


  const handleMobileInputChange = (e) => {
    setMobileInput(e.target.value);
  };

  const handleMobileResultClick = (title) => {
    setSearchValue(title);
    setSelectedCategory(null);
    setIsOverlayOpen(false);
  };

 const highlightMatches = useCallback((text, query) => {
    if (!query.trim()) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className={styles.highlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  }, []);

  return (
    <div className={styles.categoryFilters}> 
      <div className={styles.searchContainer}>
        <div className={styles.mobileSearchMini} onClick={openOverlay}>
          <SearchIcon className={styles.searchIcon} />
          <input className={styles.searchInput} type="text" placeholder="Поиск" value={searchValue} readOnly />    
          {searchValue && <CloseIcon className={styles.closeIconMobile} onClick={handleClearMainSearch} />}
        </div>
      </div>

      {isOverlayOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileOverlayHeader}>
            <SearchIcon className={styles.searchIcon} />
            <input
              className={styles.mobileOverlayInput}
              type="text"
              placeholder="Поиск"
              value={mobileInput}
              onChange={handleMobileInputChange}
              autoFocus
            />         
            {mobileInput && <CloseIcon className={styles.mobileOverlayClear} onClick={handleClearOverlayInput} />}
          </div>

          <button className={styles.mobileOverlayCancel} onClick={handleCancel}>
            Отмена
          </button>
          <div className={styles.mobileOverlayCategories}>
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
                  onClick={() => handleCategoryClick(cat)}
                />
              );
            })}
          </div>         
          {mobileInput.trim() && mobileFilteredResults.length > 0 && (
            <div className={styles.mobileOverlayResults}>
              {mobileFilteredResults.slice(0, 10).map((journal) => (
                <div
                  key={journal.id}
                  className={styles.dropdownItem}
                  onMouseDown={() => handleMobileResultClick(journal.title)}>
                  {highlightMatches(journal.title, mobileInput)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(MobileCategoryFilters);
