import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Vacancies.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import {
  fetchFilteredVacancies,
  getFetchForm,
  getFetchFormFilter,
  getVacanciesByDirection,
  setSelectedFilter,
  setActiveFilters,
  setFilteredVacancies,
} from '../../../store/Slice/vacanciesSlice';
import { setPreviousPage } from '../../../store/Slice/previousPageSlice';
import VacanciesSectionRender from './VacanciesSectionRender/VacanciesSectionRender';
import FilterModalVacancies from '../FilterModalVacancies/FilterModalVacancies';
import VacancyFormContact from '../../../UI/VacancyFormContact/VacancyFormContact';
import RocketComponent from '../../../UI/Rocket/RocketComponents';

import iconFilter from '../icons/filter.svg';
import iconFilterRed from '../icons/filterRed.svg';
import iconFilterWhiterRed from '../icons/filterWhiteRed.svg';
import clearAll from '../icons/clearAll.svg';

const VacanciesMain = ({ handleMouseEnter, handleMouseLeave, handleMouseHover, hideVacancies }) => {
  const dispatch = useDispatch();
  const { vacancies, loading, vacancyCountsByDirection, filteredVacancies, activeFilters } = useSelector(
    (state) => state.vacancies
  );
  const selectedFilter = useSelector((state) => state.vacancies.selectedFilter);

  const filterKeyForSpecialty = 'direction';
  const [showManyVacancies, setShowManyVacancies] = useState(false);
  const [totalDisplayedVacancies, setTotalDisplayedVacancies] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [modalFiltersActive, setModalFiltersActive] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isIpadMobile = windowWidth <= 1024;

  const buttonVacancyChoose = [
    'Все',
    'Архитектура',
    'Конструктив',
    'Инженерия',
    'Научно-техническое сопровождение',
    'BIM',
    'Аналитика',
    'Финансы',
    'Дизайн',
    'IT',
    'Администрирование',
    'Бэк офис',
    'Управление',
    // 'Стажировки',
  ];

  const filterMappings = {
    'Требуемый опыт работы': 'experience',
    'Локация': 'locationStaff',
    'Режим работы': 'modeOperating',
    'Занятость': 'busyness',
  };

  const vacanciesMain = useMemo(() => [...filteredVacancies].reverse(), [filteredVacancies]);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    dispatch(setPreviousPage('vacancies'));
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getVacanciesByDirection());
    dispatch(getFetchForm());
    dispatch(fetchFilteredVacancies(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    const filteredVacancies = applyFilters(vacancies, activeFilters);
    dispatch(setFilteredVacancies(filteredVacancies));
    setFilters(activeFilters);
  }, [dispatch, vacancies, activeFilters]);

  useEffect(() => {
    if (selectedFilter === 'Все') {
      setFilters({});
      dispatch(setActiveFilters({}));
    }
  }, [selectedFilter, dispatch]);

  useEffect(() => {
    const anyActiveFilters = Object.keys(filters).some((key) => filters[key].length > 0);
    setModalFiltersActive(anyActiveFilters);
  }, [filters]);

  useEffect(() => {
    const hasActiveFilters = Object.entries(filters).some(([key, values]) => {
      return values.length > 0 && !(key === filterKeyForSpecialty && values.includes(selectedFilter));
    });
    setModalFiltersActive(hasActiveFilters);
  }, [filters, selectedFilter, filterKeyForSpecialty]);

  const applyFilters = useCallback(
    (vacancies, filters) => {
      return vacancies.filter((vacancy) => {      
        return Object.keys(filters).every((filterKey) => {
          const mappedKey = filterMappings[filterKey] || filterKey;
          const filterValues = filters[filterKey];

          if (filterValues.length === 0) return true;
          const vacancyValue = vacancy[mappedKey];

          return filterValues.includes(vacancyValue);
        });
      });
    },
    [filterMappings]
  );

  const handleButtonClick = useCallback(
    (direction) => {
      dispatch(setSelectedFilter(direction));
      if (direction === 'Все') {
        dispatch(setActiveFilters({}));
        dispatch(fetchFilteredVacancies({}));
      } else {
        dispatch(getFetchFormFilter(direction));
        const newFilters = { ...filters, [filterKeyForSpecialty]: [direction] };
        dispatch(setActiveFilters(newFilters));
        const filteredVacancies = applyFilters(vacancies, newFilters);
        dispatch(setFilteredVacancies(filteredVacancies));
      }
      setShowManyVacancies(false);
    },
    [dispatch, filters, vacancies]
  );

  const toggleShowAllVacancies = useCallback(() => {
    setShowManyVacancies((prev) => !prev);
  }, []);

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const shouldDisplayVacancy = useCallback((vacancy) => {
    return !vacancy.hidden;
  }, []);

  // const visibleVacancies = useMemo(
  //   () => vacanciesMain.filter((vacancy) => shouldDisplayVacancy(vacancy)),
  //   [vacanciesMain, shouldDisplayVacancy]
  // );

  const visibleVacancies = useMemo(
    () => vacanciesMain.filter((vacancy) => shouldDisplayVacancy(vacancy) && vacancy.type !== 'стажировка'),
    [vacanciesMain, shouldDisplayVacancy]
  );
  

  const removeFilter = useCallback(
    (filterCategory, filterValue) => {
      const newFilters = { ...filters };
      if (Array.isArray(newFilters[filterCategory])) {
        newFilters[filterCategory] = newFilters[filterCategory].filter((value) => value !== filterValue);
        if (newFilters[filterCategory].length === 0) {
          delete newFilters[filterCategory];
        }
      } else {
        delete newFilters[filterCategory];
      }
      dispatch(fetchFilteredVacancies(newFilters));
      setFilters(newFilters);
      dispatch(setActiveFilters(newFilters));
    },
    [filters, dispatch]
  );

  const clearAllFilters = useCallback(() => {
    const resetFilters = selectedFilter !== 'Все' ? { [filterKeyForSpecialty]: [selectedFilter] } : {};
    setFilters(resetFilters);
    dispatch(setActiveFilters(resetFilters));
    dispatch(fetchFilteredVacancies(resetFilters));
    setModalFiltersActive(Object.keys(resetFilters)?.length > 0 && resetFilters[filterKeyForSpecialty]?.length > 0);
  }, [selectedFilter, filterKeyForSpecialty, dispatch]);

  const clearAllFiltersMobile = useCallback(() => {
    const resetFilters = {};

    setFilters(resetFilters);
    dispatch(setActiveFilters(resetFilters));
    dispatch(fetchFilteredVacancies(resetFilters));
    dispatch(setSelectedFilter('Все'));
    setModalFiltersActive(false);
  }, [dispatch]);

  const activeFiltersArray = useMemo(
    () =>
      Object.entries(filters).flatMap(([key, values]) => {
        if (Array.isArray(values)) {
          if (key === filterKeyForSpecialty && values.includes(selectedFilter) && values.length === 1) {
            return [];
          }
          return values.map((value) => ({ category: key, value }));
        }
        return [];
      }),
    [filters, filterKeyForSpecialty, selectedFilter]
  );

  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      {!hideVacancies && (
        <div className={styles.main_vacancies_block}>
          <div className={styles.wrapper_vacancies}>
            <div className={styles.rocket_model}>
              {/* <div className={styles.rocket_image}> */}
              {/* <img src="/assets/rocket.png" alt="rocket.png" /> */}
              <RocketComponent />
            </div>
            <div className={styles.vacancies_header_wrapper}>
              <span className={styles.vacancies_header1}>Мы ищем специалистов в&nbsp;наш дружный коллектив</span>
              <span className={styles.vacancies_header2}>Работа у нас</span>
            </div>
          </div>
          <div className={styles.menu_button_group_vacancy_wrapper_main}>
            <div className={styles.menu_button_group_vacancy_wrapper}>
              <div className={styles.menu_button_group_vacancy}>
                {buttonVacancyChoose.map((el, index) => (
                  <div key={`${index}-${el}`} className={styles.button_wrapper}>
                    <button
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className={`${styles.menu__button__allVacancy} ${selectedFilter === el ? styles.active : ''}`}
                      onClick={() => handleButtonClick(el)}>
                      <span className={styles.menu_button_items_vacancyText}>{el}</span>
                      <span className={styles.menu_button_items_vacancyCount}>
                        {el !== 'Все' && vacancyCountsByDirection ? vacancyCountsByDirection[el] || 0 : ''}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={styles.menu__button__choose__vacancyFilter}
              onClick={handleModalOpen}>
              <div className={styles.icon__svg_button__choose__vacancyFilter_}>
                <img src={modalFiltersActive ? iconFilterRed : iconFilter} alt="IconFilter" />
              </div>
              <div className={styles.button_choose_vacancyFilter}>Фильтр</div>
            </button>
            <FilterModalVacancies
              isOpen={isModalOpen}
              onClose={handleModalClose}
              setFilters={setFilters}
              activeFilters={filters}
              selectedFilter={selectedFilter}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              handleMouseHover={handleMouseHover}
            />
          </div>
          <div className={styles.menu_button_group_vacancy_wrapper_main_swiper}>
            {windowWidth && (
              <Swiper
                onSwiper={setSwiper}
                slidesPerView="auto"
                spaceBetween={8}
                className={styles.menu_button_group_vacancy_swiper_mobile}
                touch="true">
                {(activeFiltersArray?.length > 0 ||
                  buttonVacancyChoose.some((el) => selectedFilter === el && el !== 'Все')) && (
                  <div className={styles.menu__button__choose__vacancyFilter_mobile}>
                    <SwiperSlide className={styles.menu_button_items_vacancyTex_clear} onClick={clearAllFiltersMobile}>
                      {/* ✕ */}
                      <img src={clearAll} alt="clearAll" />
                    </SwiperSlide>
                  </div>
                )}
                <SwiperSlide
                  className={`${styles.menu__button__choose__vacancyFilter_mobile}
                      ${modalFiltersActive ? styles.filterWhiterBackground : ''}`}
                  onClick={handleModalOpen}>
                  <div className={styles.icon__svg_button__choose__vacancyFilter_mobile}>
                    <img src={modalFiltersActive ? iconFilterWhiterRed : iconFilter} alt="IconFilter" />
                  </div>
                </SwiperSlide>
                {activeFiltersArray.length > 0 &&
                  activeFiltersArray.map(
                    (filter, index) =>
                      isIpadMobile && (
                        <SwiperSlide
                          key={`${filter.category}-${index}`}
                          className={styles.menu__button__choose__vacancyFilter_mobile_dop}>
                          <div onClick={() => removeFilter(filter.category, filter.value)}>
                            <div
                              // className={styles.menu__button__choose__vacancyFilter_mobile}
                              style={{ display: 'flex' }}>
                              <p className={styles.menu_button_items_vacancyText}>{filter.value}</p>
                              <span className={styles.xSpan}>✕</span>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                  )}
                {buttonVacancyChoose.map((el, index) =>
                  isIpadMobile && el === 'Все' ? null : (
                    <SwiperSlide
                      key={`${index}-${el}`}
                      className={`${styles.menu__button__choose__vacancyFilter_mobile} ${
                        selectedFilter === el ? styles.active : ''
                      }`}
                      onClick={() => handleButtonClick(el)}>
                      <span className={styles.menu_button_items_vacancyText}>{el}</span>
                      <span className={styles.menu_button_items_vacancyCount}>
                        {el !== 'Все' && vacancyCountsByDirection ? vacancyCountsByDirection[el] || 0 : ''}
                      </span>
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            )}
          </div>
          {!isIpadMobile && activeFiltersArray.length > 0 && (
            <div>
              <div className={styles.dopFilterName}>Доп. фильтры</div>
              <div className={styles.activeFiltersContainer}>
                {activeFiltersArray.map((filter, index) => (
                  <div key={`${filter.category}-${index}`} className={styles.activeFilterTag}>
                    <p className={styles.dopFilterButtonName}>{filter.value}</p>
                    <button
                      onClick={() => removeFilter(filter.category, filter.value)}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}>
                      <span className={styles.xSpan}>✕</span>
                    </button>
                  </div>
                ))}
                {activeFiltersArray.length > 1 && (
                  <button
                    className={styles.clearAllFiltersButton}
                    onClick={clearAllFilters}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}>
                    <p className={styles.dopFilterButtonNameClear}>Очистить все</p>
                    <span className={styles.xSpanClear}>✕</span>
                  </button>
                )}
              </div>
            </div>
          )}
          <VacanciesSectionRender
            loading={loading}
            visibleVacancies={visibleVacancies}
            shouldDisplayVacancy={shouldDisplayVacancy}
            showManyVacancies={showManyVacancies}
            toggleShowAllVacancies={toggleShowAllVacancies}
            totalDisplayedVacancies={totalDisplayedVacancies}
            windowWidth={windowWidth}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />

          <div className={styles.temporaryText}>
            {windowWidth > 1024 ? 'Не нашли подходящую вакансию?' : 'Мы ищем именно тебя!'}
          </div>
          <div className={styles.textUnderForm}>
            Оставьте ваши контакты, мы всегда в поиске талантливых профессионалов
          </div>
          <div className={styles.vacancyFormWrapper}>
            <VacancyFormContact
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              handleMouseHover={handleMouseHover}
              centerButton={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(VacanciesMain);
