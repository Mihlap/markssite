import { useEffect, useCallback, useRef, memo, useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  setDesktopSelectedCategories,
  setDesktopSearchValue,
  setDesktopFilteredResults,
  setDesktopIsDropdownOpen,
  setDesktopIsManualSelection,
  setDesktopDropdownStyle,
  setDesktopIsSearchExpanded,
  setDesktopButtonsOffset,
  resetDesktopSearchState,
} from '../../store/Slice/journal_categoryFiltersSlice.js';
import CategoryButton from './CategoryButton';
import styles from './CategoryFilters.module.scss';
import { categoriesConfig } from './categories.js';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import { ReactComponent as CloseIcon } from '../icons/close.svg';

function DesktopCategoryFilters({ categoriesList }) {
  const dispatch = useDispatch();
  const {
    selectedCategories,
    searchValue,
    filteredResults,
    isDropdownOpen,
    isManualSelection,
    buttonsOffset,
    dropdownStyle,
    isSearchExpanded,
  } = useSelector((state) => state.categoryFilters.desktop, shallowEqual);
  const journals = useSelector((state) => state.journal.journals, shallowEqual);
  const selectedIssueNumber = useSelector((state) => state.journal.selectedIssueNumber);

  const wrapperRef = useRef(null);
  const searchContainerRef = useRef(null);
  const buttonsWrapperRef = useRef(null);
  const buttonsRef = useRef(null);
  const resizeTimerRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  const resetDesktopSearch = useCallback(() => {
    dispatch(resetDesktopSearchState());
    setIsCategoriesExpanded(false);
  }, [dispatch]);

  const filteredJournals = useMemo(() => {
    return selectedIssueNumber
      ? journals.filter((journal) => String(journal.issue_number).padStart(3, '0') === selectedIssueNumber)
      : journals;
  }, [journals, selectedIssueNumber]);

  useEffect(() => {
    if (selectedIssueNumber && searchValue.trim()) {
      const queryLower = searchValue.toLowerCase();
      const matchExists = filteredJournals.some((journal) => journal.title.toLowerCase().includes(queryLower));
      if (!matchExists) {
        resetDesktopSearch();
      }
    }
  }, [selectedIssueNumber, searchValue, filteredJournals, resetDesktopSearch]);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimerRef.current) return;
      resizeTimerRef.current = setTimeout(() => {
        setWindowWidth(window.innerWidth);
        resizeTimerRef.current = null;
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimerRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedIssueNumber && searchValue.trim()) {
      const queryLower = searchValue.toLowerCase();
      const matchExists = filteredJournals.some((journal) => journal.title.toLowerCase().includes(queryLower));

      if (!matchExists) {
        resetDesktopSearch();
      }
    }
  }, [selectedIssueNumber, searchValue, filteredJournals, resetDesktopSearch]);

const handleCategoryClick = useCallback(
  (cat) => {
    let newSelected;
    if (selectedCategories.includes(cat)) {
      newSelected = selectedCategories.filter((c) => c !== cat);
    } else {
      newSelected = [...selectedCategories, cat];
    }
    dispatch(setDesktopSelectedCategories(newSelected));
    dispatch(setDesktopSearchValue(''));
    dispatch(setDesktopFilteredResults([]));
    dispatch(setDesktopIsDropdownOpen(false));
    dispatch(setDesktopIsManualSelection(false));
    if (windowWidth >= 1025 && windowWidth <= 1600) {
      dispatch(setDesktopIsSearchExpanded(false));
    }
    setIsCategoriesExpanded(true);
  },
  [dispatch, selectedCategories, windowWidth]
);

  const handleSearchChange = useCallback(
    (e) => {
      dispatch(setDesktopSelectedCategories([]));
      dispatch(setDesktopSearchValue(e.target.value));
      dispatch(setDesktopIsManualSelection(false));
    },
    [dispatch]
  );

  const handleClear = useCallback(() => {
    resetDesktopSearch();
  }, [resetDesktopSearch]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        dispatch(setDesktopIsDropdownOpen(false));
        if (!searchValue.trim() && windowWidth >= 1025 && windowWidth <= 1600) {
          dispatch(setDesktopIsSearchExpanded(false));
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dispatch, searchValue, windowWidth]);

  useEffect(() => {
    if (searchValue.trim() && !isManualSelection) {
      const matches = filteredJournals.filter((journal) =>
        journal.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      dispatch(setDesktopFilteredResults(matches));
      dispatch(setDesktopIsDropdownOpen(matches.length > 0));
    } else {
      dispatch(setDesktopFilteredResults([]));
      dispatch(setDesktopIsDropdownOpen(false));
    }
  }, [dispatch, searchValue, filteredJournals, isManualSelection]);

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

  const handleResultClick = useCallback(
    (title) => {
      dispatch(setDesktopSearchValue(title));
      dispatch(setDesktopIsDropdownOpen(false));
      dispatch(setDesktopIsManualSelection(true));
      if (!title.trim() && windowWidth >= 1025 && windowWidth <= 1600) {
        dispatch(setDesktopIsSearchExpanded(false));
      }
    },
    [dispatch, windowWidth]
  );

  const updateDropdownPosition = useCallback(() => {
    if (searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      dispatch(
        setDesktopDropdownStyle({
          position: 'absolute',
          top: rect.bottom + window.scrollY + 2,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 1000,
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (isDropdownOpen) {
      updateDropdownPosition();
      const throttledResize = () => updateDropdownPosition();
      window.addEventListener('resize', throttledResize);
      return () => window.removeEventListener('resize', throttledResize);
    }
  }, [isDropdownOpen, updateDropdownPosition]);

  const visibleCategories = useMemo(() => {
    if (windowWidth >= 1025 && windowWidth <= 1600 && !isCategoriesExpanded) {
      return categoriesList.slice(0, 4);
    }
    return categoriesList;
  }, [categoriesList, windowWidth, isCategoriesExpanded]);

  const hiddenCount = useMemo(() => {
    if (windowWidth >= 1025 && windowWidth <= 1600 && !isCategoriesExpanded) {
      return categoriesList.length > 4 ? categoriesList.length - 4 : 0;
    }
    return 0;
  }, [categoriesList, windowWidth, isCategoriesExpanded]);

  const updateButtonsOffset = useCallback(() => {
    if (buttonsWrapperRef.current && buttonsRef.current) {
      const availableWidth = buttonsWrapperRef.current.offsetWidth;
      const totalButtonsWidth = buttonsRef.current.scrollWidth;
      const offset = availableWidth < totalButtonsWidth ? availableWidth - totalButtonsWidth : 0;
      dispatch(setDesktopButtonsOffset(offset));
    }
  }, [dispatch]);

  useEffect(() => {
    if (windowWidth >= 1025 && windowWidth <= 1600 && isSearchExpanded && buttonsWrapperRef.current) {
      const observer = new ResizeObserver(() => {
        updateButtonsOffset();
      });
      observer.observe(buttonsWrapperRef.current);
      updateButtonsOffset();
      return () => observer.disconnect();
    }
  }, [isSearchExpanded, updateButtonsOffset, windowWidth]);

  return (
    <div className={styles.categoryFiltersMain}>
      <div className={styles.categoryFilters} ref={wrapperRef}>
        <div className={styles.categoryButtonsWrapper} ref={buttonsWrapperRef}>
          <div
            ref={buttonsRef}
            className={
              windowWidth >= 1025 && windowWidth <= 1600 && isSearchExpanded
                ? styles.categoryButtonsExpanded
                : styles.categoryButtons
            }
            style={
              windowWidth >= 1025 && windowWidth <= 1600 && isSearchExpanded
                ? { transform: `translateX(${buttonsOffset}px)` }
                : {}
            }>
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
            {hiddenCount > 0 && !isCategoriesExpanded && (
              <CategoryButton
                key="more-categories"
                cat={`＋ ещё ${hiddenCount}`}
                count={0}
                isActive={false}
                color={'var(--light-light-gray-EDEDED)'}
                icon={null}
                onClick={() => {
                  setIsCategoriesExpanded(true);
                  if (windowWidth >= 1025 && windowWidth <= 1600) {
                    dispatch(setDesktopIsSearchExpanded(false));
                  }
                }}
                customStyle={{ padding: '0.875rem 1rem' }}
              />
            )}
          </div>
        </div>

        <div
          className={`${styles.searchContainer} ${
            windowWidth >= 1025 && windowWidth <= 1600 ? (isSearchExpanded ? styles.expanded : styles.collapsed) : ''
          }`}
          ref={searchContainerRef}
          onClick={() => {
            if (windowWidth >= 1025 && windowWidth <= 1600 && !isSearchExpanded) {
              dispatch(setDesktopIsSearchExpanded(true));
              setIsCategoriesExpanded(false);
            }
          }}>
          <SearchIcon className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Поиск"
            value={searchValue}
            maxLength={50}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchValue.trim() && filteredResults.length) {
                dispatch(setDesktopIsDropdownOpen(true));
              }
            }}
            onBlur={() => {
              if (!searchValue.trim() && windowWidth >= 1025 && windowWidth <= 1600) {
                dispatch(setDesktopIsSearchExpanded(false));
              }
            }}
          />
          {searchValue && (
            <CloseIcon
              className={styles.closeIcon}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            />
          )}
        </div>
      </div>
      {isDropdownOpen &&
        filteredResults.length > 0 &&
        ReactDOM.createPortal(
          <div className={styles.dropdown} style={dropdownStyle}>
            {filteredResults.slice(0, 4).map((journal) => (
              <div
                key={journal.id}
                className={styles.dropdownItem}
                onMouseDown={() => handleResultClick(journal.title)}>
                {highlightMatches(journal.title, searchValue)}
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export default memo(DesktopCategoryFilters);
