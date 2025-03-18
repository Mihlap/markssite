import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournals } from '../../store/Slice/journalSlice';
import CategoryButton from './CategoryButton';
import styles from './CategoryFilters.module.scss';
import { categoriesConfig } from './categories.js';

import { ReactComponent as SearchIcon } from '../icons/search.svg';
import { ReactComponent as CloseIcon } from '../icons/close.svg';

function DesktopCategoryFilters() {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const [buttonsOffset, setButtonsOffset] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const wrapperRef = useRef(null);
  const buttonsWrapperRef = useRef(null);
  const buttonsRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchJournals());
  }, [dispatch]);

  // Собираем категории + количество
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

  // ==========================
  //   ОСНОВНАЯ ЛОГИКА
  // ==========================

  // (1) При выборе категории – сбрасываем поиск
  const handleCategoryClick = useCallback((cat) => {
    // Сбрасываем поиск
    setSearchValue('');
    setFilteredResults([]);
    setIsDropdownOpen(false);
    setIsManualSelection(false);
    setIsSearchExpanded(false);

    // Устанавливаем/снимаем выбранную категорию
    setSelectedCategory((prev) => (prev === cat ? null : cat));
  }, []);

  // (2) При вводе в поиск – сбрасываем выбранную категорию
  const handleSearchChange = useCallback((e) => {
    // Сбрасываем выбранную категорию
    setSelectedCategory(null);

    // Обновляем поиск
    setSearchValue(e.target.value);
    setIsManualSelection(false);
  }, []);

  // (3) Сбрасываем всё при нажатии на крестик
  const handleClear = useCallback(() => {
    setSearchValue('');
    setSelectedCategory(null); // Сбрасываем категорию тоже
    setFilteredResults([]);
    setIsDropdownOpen(false);
    setIsManualSelection(false);
    setIsSearchExpanded(false);
  }, []);

  // Следим, чтобы при клике вне компонента закрывать выпадающий список
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
        // Если строка поиска пустая, свернуть
        if (!searchValue.trim() && window.innerWidth >= 1025 && window.innerWidth <= 1600) {
          setIsSearchExpanded(false);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [searchValue]);

  // Фильтрация: если есть searchValue и не было ручного выбора
  useEffect(() => {
    if (searchValue.trim() && !isManualSelection) {
      const matches = journals.filter((journal) => journal.title.toLowerCase().includes(searchValue.toLowerCase()));
      setFilteredResults(matches);
      setIsDropdownOpen(matches.length > 0);
    } else {
      setFilteredResults([]);
      setIsDropdownOpen(false);
    }
  }, [searchValue, journals, isManualSelection]);

  // Подсветка совпадений
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

  // При выборе варианта из списка – заполняем поле и закрываем
  const handleResultClick = useCallback((title) => {
    setSearchValue(title);
    setIsDropdownOpen(false);
    setIsManualSelection(true);
  }, []);

  // ==========================
  //   КНОПКИ КАТЕГОРИЙ
  // ==========================
  const updateButtonsOffset = useCallback(() => {
    if (buttonsWrapperRef.current && buttonsRef.current) {
      const availableWidth = buttonsWrapperRef.current.offsetWidth;
      const totalButtonsWidth = buttonsRef.current.scrollWidth;
      const offset = availableWidth < totalButtonsWidth ? availableWidth - totalButtonsWidth : 0;
      setButtonsOffset(offset);
    }
  }, []);

  useEffect(() => {
    if (!buttonsWrapperRef.current) return;
    const observer = new ResizeObserver(() => {
      updateButtonsOffset();
    });
    observer.observe(buttonsWrapperRef.current);
    return () => observer.disconnect();
  }, [updateButtonsOffset]);

  // ==========================
  //   ВЫПАДАЮЩИЙ СПИСОК
  // ==========================
  const updateDropdownPosition = useCallback(() => {
    if (searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 2,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 1000,
      });
    }
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      updateDropdownPosition();
      window.addEventListener('resize', updateDropdownPosition);
      return () => {
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isDropdownOpen, updateDropdownPosition]);

  // ==========================
  //   РЕНДЕР
  // ==========================
  return (
    <div className={styles.categoryFiltersMain}>
      <div className={styles.categoryFilters} ref={wrapperRef}>
        <div className={styles.categoryButtonsWrapper} ref={buttonsWrapperRef}>
          <div
            className={styles.categoryButtons}
            ref={buttonsRef}
            style={{ transform: `translateX(${buttonsOffset}px)` }}>
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
        </div>

        <div
          className={`${styles.searchContainer} ${isSearchExpanded ? styles.expanded : styles.collapsed}`}
          ref={searchContainerRef}
          onClick={() => {
            if (window.innerWidth >= 1025 && window.innerWidth <= 1600 && !isSearchExpanded) {
              setIsSearchExpanded(true);
            }
          }}>
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
            onBlur={() => {
              if (!searchValue.trim() && window.innerWidth >= 1025 && window.innerWidth <= 1600) {
                setIsSearchExpanded(false);
              }
            }}
          />
          {searchValue && (
            <CloseIcon
              className={styles.closeIcon}
              onClick={() => {
                // Сбрасываем и поиск, и категорию
                handleClear();
                // Дополнительно сворачиваем, если нужно
                if (window.innerWidth >= 1025 && window.innerWidth <= 1600) {
                  setIsSearchExpanded(false);
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Портал с выпадающим списком, если есть результаты */}
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

export default React.memo(DesktopCategoryFilters);
