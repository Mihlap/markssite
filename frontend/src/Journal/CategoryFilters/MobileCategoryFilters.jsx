import { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  setMobileSearchValue,
  setMobileSelectedCategory,
  setMobileIsOverlayOpen,
  setMobilePrevSearchValue,
  setMobilePrevSelectedCategory,
  setMobileInput,
} from '../../store/Slice/journal_categoryFiltersSlice.js';
import CategoryButton from './CategoryButton';
import styles from './CategoryFilters.module.scss';
import { categoriesConfig } from './categories.js';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import { ReactComponent as CloseIcon } from '../icons/close.svg';

function MobileCategoryFilters({ categoriesList }) {
  const dispatch = useDispatch();
  const { searchValue, selectedCategory, isOverlayOpen, mobileInput } = useSelector(
    (state) => state.categoryFilters.mobile,
    shallowEqual
  ); 
  const journals = useSelector((state) => state.journal.journals, shallowEqual);

  const mobileFilteredResults = useMemo(() => {
    const query = mobileInput.trim().toLowerCase();
    if (!query) return [];
    return journals.filter((journal) => journal.title.toLowerCase().includes(query));
  }, [mobileInput, journals]);

  const openOverlay = () => {
    dispatch(setMobilePrevSearchValue(searchValue));
    dispatch(setMobilePrevSelectedCategory(selectedCategory));
    dispatch(setMobileInput(searchValue));
    dispatch(setMobileIsOverlayOpen(true));
  };

  const handleCancel = () => {
    dispatch(setMobileIsOverlayOpen(false));
  };

  const handleClearOverlayInput = () => {
    dispatch(setMobileInput(''));
    dispatch(setMobileSearchValue(''));
    dispatch(setMobileSelectedCategory(null));
  };

  const handleClearMainSearch = (e) => {
    e.stopPropagation();
    dispatch(setMobileSearchValue(''));
    dispatch(setMobileSelectedCategory(null));
  };

  const handleCategoryClick = (cat) => {
    if (selectedCategory === cat) {  
      dispatch(setMobileSearchValue(''));
      dispatch(setMobileSelectedCategory(null));
      dispatch(setMobileInput(''));
    } else {   
      dispatch(setMobileSearchValue(cat));
      dispatch(setMobileSelectedCategory(cat));
      dispatch(setMobileIsOverlayOpen(false));
    }
  };

  const handleMobileInputChange = (e) => {
    dispatch(setMobileInput(e.target.value));
  };

  const handleMobileResultClick = (title) => {
    dispatch(setMobileSearchValue(title));
    dispatch(setMobileSelectedCategory(null));
    dispatch(setMobileIsOverlayOpen(false));
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
      <div className={styles.searchContainer} onClick={openOverlay}>
        <SearchIcon className={styles.searchIcon} />
        <input className={styles.searchInput} type="text" placeholder="Поиск" value={searchValue} readOnly />
        {searchValue && !isOverlayOpen && (
          <CloseIcon className={styles.closeIconMobile} onClick={handleClearMainSearch} />
        )}
      </div>
      {isOverlayOpen && (
        <div className={styles.mobileOverlay}>
          <div className={styles.mobileOverlayWrapper}>
            <div className={styles.mobileOverlayHeader}>
              <SearchIcon className={styles.searchIcon} />
              <input
                className={styles.mobileOverlayInput}
                type="text"
                placeholder="Поиск"
                value={mobileInput}
                maxLength={50}
                onChange={handleMobileInputChange}
                autoFocus
                />
                {mobileInput && <CloseIcon className={styles.mobileOverlayClear} onClick={handleClearOverlayInput} />}
            </div>
            <button className={styles.mobileOverlayCancel} onClick={handleCancel}>
              Отмена
            </button>
          </div>
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
            // <>
            <div className={styles.mobileOverlayResults}>
              <div className={styles.resultsTitle}>Результаты поиска</div>
              {mobileFilteredResults.slice(0, 20).map((journal) => (
                <div
                  key={journal.id}
                  className={styles.dropdownItem}
                  onMouseDown={() => handleMobileResultClick(journal.title)}>
                  {highlightMatches(journal.title, mobileInput)}
                </div>
              ))}
            </div>
            // </>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(MobileCategoryFilters);
