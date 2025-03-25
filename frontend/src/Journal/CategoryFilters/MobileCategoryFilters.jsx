import { memo, useCallback, useMemo, useState, useEffect } from 'react';
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
  const selectedIssueNumber = useSelector((state) => state.journal.selectedIssueNumber);
  
  const activeJournal = selectedCategory !== null ? selectedCategory : selectedIssueNumber;

  const filteredJournals = useMemo(() => {
    return activeJournal
      ? journals.filter((journal) => String(journal.issue_number).padStart(3, '0') === activeJournal)
      : journals;
  }, [journals, activeJournal]);

  const mobileFilteredResults = useMemo(() => {
    const query = mobileInput.trim().toLowerCase();
    if (!query) return [];
    return filteredJournals.filter((journal) => journal.title.toLowerCase().includes(query));
  }, [mobileInput, filteredJournals]);

  useEffect(() => {
    if (activeJournal && searchValue.trim()) {
      const queryLower = searchValue.toLowerCase();
      const matchExists = journals
        .filter((journal) => String(journal.issue_number).padStart(3, '0') === activeJournal)
        .some((journal) => journal.title.toLowerCase().includes(queryLower));
      if (!matchExists) {
        dispatch(setMobileSearchValue(''));
        dispatch(setMobileInput(''));
      }
    }
  }, [activeJournal, searchValue, journals, dispatch]);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const defaultVisibleCount = 4;

  useEffect(() => {
    if (!isOverlayOpen) {
      setShowAllCategories(false);
    }
  }, [isOverlayOpen]);

  const visibleCategories = useMemo(
    () => (showAllCategories ? categoriesList : categoriesList.slice(0, defaultVisibleCount)),
    [showAllCategories, categoriesList]
  );
  const hiddenCount = useMemo(() => categoriesList.length - defaultVisibleCount, [categoriesList]);

  const openOverlay = useCallback(() => {
    dispatch(setMobilePrevSearchValue(searchValue));
    dispatch(setMobilePrevSelectedCategory(selectedCategory));
    dispatch(setMobileInput(searchValue));
    dispatch(setMobileIsOverlayOpen(true));
    if (selectedCategory) {
      setShowAllCategories(true);
    }
  }, [dispatch, searchValue, selectedCategory]);

  const handleCancel = useCallback(() => {
    dispatch(setMobileIsOverlayOpen(false));
  }, [dispatch]);

  const handleClearOverlayInput = useCallback(() => {
    dispatch(setMobileInput(''));
    dispatch(setMobileSearchValue(''));
    dispatch(setMobileSelectedCategory(null));
  }, [dispatch]);

  const handleClearMainSearch = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(setMobileSearchValue(''));
      dispatch(setMobileSelectedCategory(null));
    },
    [dispatch]
  );

  const handleCategoryClick = useCallback(
    (cat) => {
      if (selectedCategory === cat) {
        dispatch(setMobileSearchValue(''));
        dispatch(setMobileSelectedCategory(null));
        dispatch(setMobileInput(''));
      } else {
        dispatch(setMobileSelectedCategory(cat));
        dispatch(setMobileIsOverlayOpen(false));
      }
    },
    [dispatch, selectedCategory]
  );

  const handleMobileInputChange = useCallback(
    (e) => {
      dispatch(setMobileInput(e.target.value));
    },
    [dispatch]
  );

  const handleMobileResultClick = useCallback(
    (title) => {
      dispatch(setMobileSearchValue(title));
      dispatch(setMobileSelectedCategory(null));
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
            {visibleCategories.map(({ cat, count }) => {
              const { color, icon } = categoriesConfig[cat] || { color: '#000', icon: null };
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
