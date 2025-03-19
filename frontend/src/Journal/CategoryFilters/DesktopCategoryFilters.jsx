import { useEffect, useCallback, useRef, memo } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  setDesktopSelectedCategory,
  setDesktopSearchValue,
  setDesktopFilteredResults,
  setDesktopIsDropdownOpen,
  setDesktopIsManualSelection,
  setDesktopButtonsOffset,
  setDesktopDropdownStyle,
  setDesktopIsSearchExpanded,
} from '../../store/Slice/journal_categoryFiltersSlice.js';
import CategoryButton from './CategoryButton';
import styles from './CategoryFilters.module.scss';
import { categoriesConfig } from './categories.js';
import { ReactComponent as SearchIcon } from '../icons/search.svg';
import { ReactComponent as CloseIcon } from '../icons/close.svg';

function DesktopCategoryFilters({ categoriesList }) {
  const dispatch = useDispatch();
  const {
    selectedCategory,
    searchValue,
    filteredResults,
    isDropdownOpen,
    isManualSelection,
    buttonsOffset,
    dropdownStyle,
    isSearchExpanded,
  } = useSelector((state) => state.categoryFilters.desktop, shallowEqual);
  const journals = useSelector((state) => state.journal.journals, shallowEqual);

  const wrapperRef = useRef(null);
  const buttonsWrapperRef = useRef(null);
  const buttonsRef = useRef(null);
  const searchContainerRef = useRef(null);

  const resetDesktopSearch = useCallback(() => {
    dispatch(setDesktopSearchValue(''));
    dispatch(setDesktopSelectedCategory(null));
    dispatch(setDesktopFilteredResults([]));
    dispatch(setDesktopIsDropdownOpen(false));
    dispatch(setDesktopIsManualSelection(false));
    dispatch(setDesktopIsSearchExpanded(false));
  }, [dispatch]);

  const handleCategoryClick = useCallback(
    (cat) => {
      resetDesktopSearch();
      dispatch(setDesktopSelectedCategory(selectedCategory === cat ? null : cat));
    },
    [dispatch, selectedCategory, resetDesktopSearch]
  );

  const handleSearchChange = useCallback(
    (e) => {
      dispatch(setDesktopSelectedCategory(null));
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
        if (!searchValue.trim() && window.innerWidth >= 1025 && window.innerWidth <= 1600) {
          dispatch(setDesktopIsSearchExpanded(false));
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [dispatch, searchValue]);

  useEffect(() => {
    if (searchValue.trim() && !isManualSelection) {
      const matches = journals.filter((journal) => journal.title.toLowerCase().includes(searchValue.toLowerCase()));
      dispatch(setDesktopFilteredResults(matches));
      dispatch(setDesktopIsDropdownOpen(matches.length > 0));
    } else {
      dispatch(setDesktopFilteredResults([]));
      dispatch(setDesktopIsDropdownOpen(false));
    }
  }, [dispatch, searchValue, journals, isManualSelection]);

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
    },
    [dispatch]
  );

  const updateButtonsOffset = useCallback(() => {
    if (buttonsWrapperRef.current && buttonsRef.current) {
      const availableWidth = buttonsWrapperRef.current.offsetWidth;
      const totalButtonsWidth = buttonsRef.current.scrollWidth;
      const offset = availableWidth < totalButtonsWidth ? availableWidth - totalButtonsWidth : 0;
      dispatch(setDesktopButtonsOffset(offset));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!buttonsWrapperRef.current) return;
    const observer = new ResizeObserver(() => {
      updateButtonsOffset();
    });
    observer.observe(buttonsWrapperRef.current);
    return () => observer.disconnect();
  }, [updateButtonsOffset]);

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
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isDropdownOpen, updateDropdownPosition]);

  return (
    <div className={styles.categoryFiltersMain}>
      <div className={styles.categoryFilters} ref={wrapperRef}>
        <div className={styles.categoryButtonsWrapper} ref={buttonsWrapperRef}>
          <div
            className={styles.categoryButtons}
            ref={buttonsRef}
            style={{ transform: `translateX(${buttonsOffset}px)` }}>
            {categoriesList.map(({ cat, count }) => {
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
          </div>
        </div>

        <div
          className={`${styles.searchContainer} ${isSearchExpanded ? styles.expanded : styles.collapsed}`}
          ref={searchContainerRef}
          onClick={() => {
            if (window.innerWidth >= 1025 && window.innerWidth <= 1600 && !isSearchExpanded) {
              dispatch(setDesktopIsSearchExpanded(true));
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
              if (!searchValue.trim() && window.innerWidth >= 1025 && window.innerWidth <= 1600) {
                dispatch(setDesktopIsSearchExpanded(false));
              }
            }}
          />
          {searchValue && (
            <CloseIcon
              className={styles.closeIcon}
              onClick={() => {
                handleClear();
                if (window.innerWidth >= 1025 && window.innerWidth <= 1600) {
                  dispatch(setDesktopIsSearchExpanded(false));
                }
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
