import React, { memo, useCallback, useMemo, useState, useEffect } from 'react';
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
  const hasActiveCategory = selectedCategories.length > 0;

  useEffect(() => {
    dispatch(setMobileSearchValue(''));
    dispatch(setMobileInput(''));
    dispatch(setMobileSelectedCategories([]));
  }, [dispatch]);

  const [showAllCategories, setShowAllCategories] = useState(false);
  const defaultVisibleCount = 4;

  useEffect(() => {
    if (!isOverlayOpen) setShowAllCategories(false);
  }, [isOverlayOpen]);

  const openOverlay = useCallback(() => {
    dispatch(setMobilePrevSearchValue(searchValue));
    dispatch(setMobilePrevSelectedCategory(selectedCategories));
    dispatch(setMobileInput(''));
    dispatch(setMobileIsOverlayOpen(true));
    if (hasActiveCategory) setShowAllCategories(true);
  }, [dispatch, searchValue, selectedCategories, hasActiveCategory]);

  const handleCancel = useCallback(() => {
    if (mobileInput.trim()) {
      dispatch(setMobileSearchValue(mobileInput.trim()));
      dispatch(setMobileSelectedCategories([]));
    }
    dispatch(setMobileIsOverlayOpen(false));
  }, [dispatch, mobileInput]);

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
      const updated = selectedCategories.includes(cat)
        ? selectedCategories.filter((c) => c !== cat)
        : [...selectedCategories, cat];

      dispatch(setMobileSelectedCategories(updated));
      dispatch(setMobileSearchValue(''));
      dispatch(setMobileIsOverlayOpen(false));
    },
    [dispatch, selectedCategories]
  );

  const handleMobileInputChange = useCallback(
    (e) => {
      const val = e.target.value;
      dispatch(setMobileInput(val));
      if (val.trim()) {
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
    const esc = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${esc})`, 'gi');
    return text.split(re).map((part, i) =>
      re.test(part) ? (
        <span key={i} className={styles.highlight}>
          {part}
        </span>
      ) : (
        part
      )
    );
  }, []);

  const filteredByText = useMemo(() => {
    const q = mobileInput.trim().toLowerCase();
    if (!q) return [];
    return journals.filter((j) => j.title.toLowerCase().includes(q));
  }, [mobileInput, journals]);

  const visibleCategories = useMemo(
    () => (showAllCategories ? categoriesList : categoriesList.slice(0, defaultVisibleCount)),
    [showAllCategories, categoriesList]
  );
  const hiddenCount = categoriesList.length - defaultVisibleCount;

  return (
    <div className={styles.categoryFilters}>
      <div
        className={`${styles.searchContainer} ${searchValue || hasActiveCategory ? styles.filledBorder : ''}`}
        onClick={openOverlay}>
        <SearchIcon className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Поиск"
          value={searchValue ? searchValue : hasActiveCategory ? selectedCategories.join(', ') : ''}
          readOnly
        />
        {(searchValue || hasActiveCategory) && !isOverlayOpen && (
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
              const { color, icon } = categoriesConfig[cat] || {};
              return (
                <CategoryButton
                  key={cat}
                  cat={cat}
                  count={count}
                  color={color}
                  icon={icon}
                  isActive={selectedCategories.includes(cat)}
                  onClick={() => handleCategoryClick(cat)}
                />
              );
            })}
            {hiddenCount > 0 && !showAllCategories && (
              <CategoryButton
                key="more"
                cat={`＋ ещё ${hiddenCount}`}
                count={0}
                isActive={false}
                color="var(--light-light-gray-EDEDED)"
                onClick={() => setShowAllCategories(true)}
                customStyle={{ padding: '0.875rem 1rem' }}
              />
            )}
          </div>

          {mobileInput.trim() && (
            <div className={styles.mobileOverlayResults}>
              {filteredByText.length > 0 ? (
                <>
                  <div className={styles.resultsTitle}>Результаты поиска</div>
                  {filteredByText.map((j) => (
                    <div
                      key={j.id}
                      className={styles.dropdownItem}
                      onMouseDown={() => handleMobileResultClick(j.title)}>
                      {highlightMatches(j.title, mobileInput)}
                    </div>
                  ))}
                </>
              ) : (
                <div className={styles.noResults}>Ничего не найдено :(</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(MobileCategoryFilters);
