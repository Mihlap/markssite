import { memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  setMobileSearchValue,
  setMobileSelectedCategories,
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
  const { searchValue, selectedCategories, isOverlayOpen, mobileInput } = useSelector(
    (state) => state.categoryFilters.mobile,
    shallowEqual
  );
  const journals = useSelector((state) => state.journal.journals, shallowEqual);
  const selectedIssueNumber = useSelector((state) => state.journal.selectedIssueNumber);
  const hasActiveCategory = Array.isArray(selectedCategories) && selectedCategories.length > 0;
  const isSearchActive = mobileInput.trim().length > 0;

  const filteredJournals = useMemo(() => {
    let filtered = journals;

    if (selectedIssueNumber) {
      filtered = filtered.filter((journal) => String(journal.issue_number).padStart(3, '0') === selectedIssueNumber);
    }

    if (!isSearchActive && hasActiveCategory) {
      filtered = filtered.filter((journal) => selectedCategories.includes(journal.category));
    }
    return filtered;
  }, [journals, selectedIssueNumber, selectedCategories, isSearchActive, hasActiveCategory]);

  const mobileFilteredResults = useMemo(() => {
    const query = mobileInput.trim().toLowerCase();
    if (!query) return [];
    return filteredJournals.filter((journal) => journal.title.toLowerCase().includes(query));
  }, [mobileInput, filteredJournals]);

  useEffect(() => {
    dispatch(setMobileSearchValue(''));
    dispatch(setMobileInput(''));
  }, [selectedIssueNumber, dispatch]);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const defaultVisibleCount = 4;

  useEffect(() => {
    if (!isOverlayOpen) {
      setShowAllCategories(false);
    }
  }, [isOverlayOpen]);

  const openOverlay = useCallback(() => {
    dispatch(setMobilePrevSearchValue(searchValue));
    dispatch(setMobilePrevSelectedCategory(selectedCategories));
    dispatch(setMobileInput(searchValue));
    dispatch(setMobileIsOverlayOpen(true));
    if (selectedCategories) {
      setShowAllCategories(true);
    }
  }, [dispatch, searchValue, selectedCategories]);

  const handleCancel = useCallback(() => {
    dispatch(setMobileIsOverlayOpen(false));
  }, [dispatch]);

  const handleClearOverlayInput = useCallback(() => {
    dispatch(setMobileInput(''));
    dispatch(setMobileSearchValue(''));
    dispatch(setMobileSelectedCategories([]));
  }, [dispatch]);

  const handleClearMainSearch = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(setMobileSearchValue(''));
      dispatch(setMobileSelectedCategories([]));
    },
    [dispatch]
  );

  const handleCategoryClick = useCallback(
    (cat) => {
      let updated;
      if (selectedCategories.includes(cat)) {
        updated = selectedCategories.filter((c) => c !== cat);
      } else {
        updated = [...selectedCategories, cat];
      }
      dispatch(setMobileSearchValue(''));
      dispatch(setMobileInput(''));
      dispatch(setMobileSelectedCategories(updated));
      dispatch(setMobileIsOverlayOpen(false));
    },
    [dispatch, selectedCategories]
  );

  const handleMobileInputChange = useCallback(
    (e) => {
      dispatch(setMobileInput(e.target.value));
      if (e.target.value.trim()) {
        dispatch(setMobileSelectedCategories([]));
      }
    },
    [dispatch]
  );

  const handleMobileResultClick = useCallback(
    (title) => {
      dispatch(setMobileSearchValue(title));
      dispatch(setMobileSelectedCategories([]));
      dispatch(setMobileIsOverlayOpen(false));
    },
    [dispatch]
  );

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

  const visibleCategories = useMemo(
    () => (showAllCategories ? categoriesList : categoriesList.slice(0, defaultVisibleCount)),
    [showAllCategories, categoriesList]
  );
  const hiddenCount = useMemo(() => categoriesList.length - defaultVisibleCount, [categoriesList]);

  return (
    <div className={styles.categoryFilters}>
      <div className={`${styles.searchContainer} ${searchValue ? styles.filledBorder : ''}`}
       onClick={openOverlay}>
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
            {visibleCategories.map(({ cat, count }) => {
              const { color, icon } = categoriesConfig[cat] || { color: '#000', icon: null };
              return (
                <CategoryButton
                  key={cat}
                  cat={cat}
                  count={count}
                  color={color}
                  icon={icon}
                  isActive={Array.isArray(selectedCategories) && selectedCategories.includes(cat)}
                  onClick={() => handleCategoryClick(cat)}
                />
              );
            })}
            {categoriesList.length > defaultVisibleCount && !showAllCategories && (
              <CategoryButton
                key="more-categories"
                cat={`＋ ещё ${hiddenCount}`}
                count={0}
                isActive={false}
                color={'var(--light-light-gray-EDEDED)'}
                icon={null}
                onClick={() => setShowAllCategories(true)}
                customStyle={{ padding: '0.875rem 1rem' }}
              />
            )}
          </div>
          {mobileInput.trim() && mobileFilteredResults.length > 0 && (
            <div className={styles.mobileOverlayResults}>
              <div className={styles.resultsTitle}>Результаты поиска</div>
              {mobileFilteredResults.slice(0, 30).map((journal) => (
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

export default memo(MobileCategoryFilters);
