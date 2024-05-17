import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Vacancies.module.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import LoadingCircle from "../../Loading/LoadingCircle";
import {
  fetchFilteredVacancies,
  getFetchForm,
  getFetchFormFilter,
  getVacanciesByDirection,
  setSelectedFilter,
  setActiveFilters,
  setFilteredVacancies,
} from "../../store/Slice/vacanciesSlice";
import VacancyFormContact from "../../UI/VacancyFormContact/VacancyFormContact";

import iconFilter from "./icons/filter.svg";
import iconFilterRed from "./icons/filterRed.svg";
import iconFilterWhiterRed from "./icons/filterWhiteRed.svg";
import buttonLink from "./icons/buttonLink.svg";
import buttonLink_ipad from "./icons/buttonLink1.svg";
import clearAll from "./icons/clearAll.svg";
import FilterModalVacancies from "./FilterModalVacancies";
import RocketComponent from "../../UI/Rocket/RocketComponents";

const VacanciesMain = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
  hideVacancies,
}) => {
  const dispatch = useDispatch();
  const {
    vacancies,
    loading,
    vacancyCountsByDirection,
    filteredVacancies,
    activeFilters,
  } = useSelector((state) => state.vacancies);
  const selectedFilter = useSelector((state) => state.vacancies.selectedFilter);

  const filterKeyForSpecialty = "direction";
  const [showManyVacancies, setShowManyVacancies] = useState(false);
  const [totalDisplayedVacancies, setTotalDisplayedVacancies] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [modalFiltersActive, setModalFiltersActive] = useState(false);
  const [swiper, setSwiper] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isIpadMobile = windowWidth <= 1024;

  const buttonVacancyChoose = [
    "Все",
    "Архитектура",
    "Конструктив",
    "Инженерия",
    "Научно-техническое сопровождение",
    "BIM",
    "Аналитика",
    "Финансы",
    "Дизайн",
    "it",
    "Администрирование",
    "Бэк офис",
    "Стажировки",
  ];

  const filterMappings = {
    "Требуемый опыт работы": "experience",
    Локация: "locationStaff",
    "Режим работы": "modeOperating",
    Занятость: "busyness",
  };

  const vacanciesMain = [...filteredVacancies].reverse();

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getFetchForm());
    dispatch(fetchFilteredVacancies(filters));
    dispatch(getVacanciesByDirection());
  }, [dispatch, filters]);

  useEffect(() => {
    const filteredVacancies = applyFilters(vacancies, activeFilters);
    dispatch(setFilteredVacancies(filteredVacancies));
    setFilters(activeFilters);
  }, [dispatch, vacancies]);

  useEffect(() => {
    if (selectedFilter === "Все") {
      setFilters({});
      dispatch(setActiveFilters({}));
    }
  }, [selectedFilter, dispatch]);

  useEffect(() => {
    const anyActiveFilters = Object.keys(filters).some(
      (key) => filters[key].length > 0
    );
    setModalFiltersActive(anyActiveFilters);
  }, [filters]);

  useEffect(() => {
    const hasActiveFilters = Object.entries(filters).some(([key, values]) => {
      return (
        values.length > 0 &&
        !(key === filterKeyForSpecialty && values.includes(selectedFilter))
      );
    });
    setModalFiltersActive(hasActiveFilters);
  }, [filters, selectedFilter, filterKeyForSpecialty]);

  function applyFilters(vacancies, filters) {
    return vacancies.filter((vacancy) => {
      return Object.keys(filters).every((filterKey) => {
        const mappedKey = filterMappings[filterKey] || filterKey;
        const filterValues = filters[filterKey];

        if (filterValues.length === 0) return true;
        const vacancyValue = vacancy[mappedKey];

        return filterValues.includes(vacancyValue);
      });
    });
  }

  const handleButtonClick = (direction) => {
    dispatch(setSelectedFilter(direction));
    dispatch(getFetchFormFilter(direction));
    setShowManyVacancies(false);
  };

  const toggleShowAllVacancies = () => {
    setShowManyVacancies((prev) => !prev);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const shouldDisplayVacancy = (vacancy) => {
    return !vacancy.hidden;
  };

  const visibleVacancies = vacanciesMain.filter((vacancy) =>
    shouldDisplayVacancy(vacancy)
  );

  const removeFilter = (filterCategory, filterValue) => {
    const newFilters = { ...filters };
    if (Array.isArray(newFilters[filterCategory])) {
      newFilters[filterCategory] = newFilters[filterCategory].filter(
        (value) => value !== filterValue
      );
      if (newFilters[filterCategory].length === 0) {
        delete newFilters[filterCategory];
      }
    } else {
      delete newFilters[filterCategory];
    }
    dispatch(fetchFilteredVacancies(newFilters));
    setFilters(newFilters);
    dispatch(setActiveFilters(newFilters));
  };

  const clearAllFilters = () => {
    const resetFilters =
      selectedFilter !== "Все"
        ? { [filterKeyForSpecialty]: [selectedFilter] }
        : {};
    setFilters(resetFilters);
    dispatch(setActiveFilters(resetFilters));
    dispatch(fetchFilteredVacancies(resetFilters));
    setModalFiltersActive(
      Object.keys(resetFilters)?.length > 0 &&
        resetFilters[filterKeyForSpecialty]?.length > 0
    );
  };

  const clearAllFiltersMobile = () => {
    const resetFilters = {};

    setFilters(resetFilters);
    dispatch(setActiveFilters(resetFilters));
    dispatch(fetchFilteredVacancies(resetFilters));
    dispatch(setSelectedFilter("Все"));
    setModalFiltersActive(false);
  };

  const activeFiltersArray = Object.entries(filters).flatMap(
    ([key, values]) => {
      if (Array.isArray(values)) {
        if (
          key === filterKeyForSpecialty &&
          values.includes(selectedFilter) &&
          values.length === 1
        ) {
          return [];
        }
        return values.map((value) => ({ category: key, value }));
      }
      return [];
    }
  );

  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      {!hideVacancies && (
        <div className={styles.main_vacancies_block}>
          <div className={styles.wrapper_vacancies}>
            <div className={styles.rocket_image}>
              <img src="/assets/rocket.png" alt="rocket.png" />
              {/* <RocketComponent /> */}
            </div>
            <div className={styles.vacancies_header_wrapper}>
              <span className={styles.vacancies_header1}>
                Мы ищем специалистов в&nbsp;наш дружный коллектив
              </span>
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
                      className={`${styles.menu__button__allVacancy} ${
                        selectedFilter === el ? styles.active : ""
                      }`}
                      onClick={() => handleButtonClick(el)}
                    >
                      <span className={styles.menu_button_items_vacancyText}>
                        {el}
                      </span>
                      <span className={styles.menu_button_items_vacancyCount}>
                        {el !== "Все" && vacancyCountsByDirection
                          ? vacancyCountsByDirection[el] || 0
                          : ""}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* <button
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={styles.menu__button__choose__vacancyFilter}
              onClick={handleModalOpen}
            >
              <div className={styles.icon__svg_button__choose__vacancyFilter_}>
                <img
                  src={modalFiltersActive ? iconFilterRed : iconFilter}
                  alt="IconFilter"
                />
              </div>
              <div className={styles.button_choose_vacancyFilter}>Фильтр</div>
            </button> */}
            {/* <FilterModalVacancies
              isOpen={isModalOpen}
              onClose={handleModalClose}
              setFilters={setFilters}
              activeFilters={filters}
              selectedFilter={selectedFilter}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              handleMouseHover={handleMouseHover}
            /> */}
          </div>
          <div className={styles.menu_button_group_vacancy_wrapper_main_swiper}>
            {windowWidth && (
              <Swiper
                onSwiper={setSwiper}
                slidesPerView="auto"
                spaceBetween={8}
                className={styles.menu_button_group_vacancy_swiper_mobile}
                touch="true"
              >
                {(activeFiltersArray?.length > 0 ||
                  buttonVacancyChoose.some(
                    (el) => selectedFilter === el && el !== "Все"
                  )) && (
                  <div
                    className={
                      styles.menu__button__choose__vacancyFilter_mobile
                    }
                  >
                    <SwiperSlide
                      className={styles.menu_button_items_vacancyTex_clear}
                      onClick={clearAllFiltersMobile}
                    >
                      {/* ✕ */}
                      <img src={clearAll} alt="clearAll" />
                    </SwiperSlide>
                  </div>
                )}
                {/* <SwiperSlide
                  className={`${
                    styles.menu__button__choose__vacancyFilter_mobile
                  }
                      ${
                        modalFiltersActive ? styles.filterWhiterBackground : ""
                      }`}
                  onClick={handleModalOpen}
                >
                  <div
                    className={
                      styles.icon__svg_button__choose__vacancyFilter_mobile
                    }
                  >
                    <img
                      src={
                        modalFiltersActive ? iconFilterWhiterRed : iconFilter
                      }
                      alt="IconFilter"
                    />
                  </div>
                </SwiperSlide> */}
                {activeFiltersArray.length > 0 &&
                  activeFiltersArray.map(
                    (filter, index) =>
                      isIpadMobile && (
                        <SwiperSlide
                          key={`${filter.category}-${index}`}
                          className={
                            styles.menu__button__choose__vacancyFilter_mobile_dop
                          }
                        >
                          <div
                            onClick={() =>
                              removeFilter(filter.category, filter.value)
                            }
                          >
                            <div
                              // className={styles.menu__button__choose__vacancyFilter_mobile}
                              style={{ display: "flex" }}
                            >
                              <p
                                className={styles.menu_button_items_vacancyText}
                              >
                                {filter.value}
                              </p>
                              <span className={styles.xSpan}>✕</span>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                  )}
                {buttonVacancyChoose.map((el, index) =>
                  isIpadMobile && el === "Все" ? null : (
                    <SwiperSlide
                      key={`${index}-${el}`}
                      className={`${
                        styles.menu__button__choose__vacancyFilter_mobile
                      } ${selectedFilter === el ? styles.active : ""}`}
                      onClick={() => handleButtonClick(el)}
                    >
                      <span className={styles.menu_button_items_vacancyText}>
                        {el}
                      </span>
                      <span className={styles.menu_button_items_vacancyCount}>
                        {el !== "Все" && vacancyCountsByDirection
                          ? vacancyCountsByDirection[el] || 0
                          : ""}
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
                      onClick={() =>
                        removeFilter(filter.category, filter.value)
                      }
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <span className={styles.xSpan}>✕</span>
                    </button>
                  </div>
                ))}
                {activeFiltersArray.length > 1 && (
                  <button
                    className={styles.clearAllFiltersButton}
                    onClick={clearAllFilters}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <p className={styles.dopFilterButtonNameClear}>
                      Очистить все
                    </p>
                    <span className={styles.xSpanClear}>✕</span>
                  </button>
                )}
              </div>
            </div>
          )}
          {loading ? (
            <div className={styles.loader}>
              <LoadingCircle />
            </div>
          ) : visibleVacancies.length > 0 ? (
            <>
              <div className={styles.vacanciesHeaders}>
                <div className={styles.headerCell_specialization}>
                  Специальность
                </div>
                <div
                  className={`${styles.headerCell} ${styles.headerCell_direction}`}
                >
                  Направление
                </div>
                <div
                  className={`${styles.headerCell} ${styles.headerCell_busyness}`}
                >
                  Занятость
                </div>
                <div
                  className={`${styles.headerCell} ${styles.headerCell_location}`}
                >
                  Локация
                </div>
              </div>
              {visibleVacancies
                .filter(shouldDisplayVacancy)
                .slice(
                  0,
                  showManyVacancies
                    ? vacanciesMain.length
                    : totalDisplayedVacancies
                )
                .map((vacancy) => (
                  <div
                    key={vacancy.id}
                    to={`/vacancy/${vacancy.id}`}
                    className={styles.vacancyContainer}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {windowWidth > 1024 && (
                      <>
                        <div
                          className={`${styles.vacancyCell1} ${styles.vacancyCell_title}`}
                        >
                          {vacancy.title}
                          <div className={styles.titleZone}></div>
                        </div>
                        <div
                          className={`${styles.vacancyCell} ${styles.vacancyCell_direction}`}
                        >
                          {vacancy.direction}
                        </div>
                        <div
                          className={`${styles.vacancyCell} ${styles.vacancyCell_busyness}`}
                        >
                          {vacancy.busyness}
                        </div>
                        <div
                          className={`${styles.vacancyCell} ${styles.vacancyCell_locationStaff}`}
                        >
                          {vacancy.locationStaff}
                        </div>
                        <div className={styles.vacancyCell_buttonLink}>
                          <img src={buttonLink} alt="buttonLink" />
                        </div>
                      </>
                    )}
                    {windowWidth <= 1024 && (
                      <>
                        <div className={styles.vacancyContainer111}>
                          <div
                            className={`${styles.vacancyCell1} ${styles.vacancyCell_title}`}
                          >
                            {vacancy.title}
                          </div>
                          <div className={styles.vacancyCell_buttonLink_ipad}>
                            {/* <img src={buttonLink_ipad} alt="buttonLink_ipad" /> */}
                          </div>
                        </div>
                        <div className={styles.vacancyContainer222}>
                          <div
                            className={`${styles.vacancyCell} ${styles.vacancyCell_direction}`}
                          >
                            {vacancy.direction}
                          </div>
                          <div
                            className={`${styles.vacancyCell} ${styles.vacancyCell_busyness}`}
                          >
                            {vacancy.busyness}
                          </div>
                          <div
                            className={`${styles.vacancyCell} ${styles.vacancyCell_locationStaff}`}
                          >
                            {vacancy.locationStaff}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </>
          ) : (
            <div className={styles.vacancy_content_massage}>
              Скоро здесь появятся вакансии
            </div>
          )}
          {visibleVacancies.length > 6 && (
            <div className={styles.showVacanciesOfTotalVacanciesContainer}>
              <div className={styles.showVacanciesOfTotalVacancies}>
                {!showManyVacancies && visibleVacancies.length > 6 && (
                  <span className={styles.showManyVacanciesCount}>
                    {totalDisplayedVacancies} вакансий из{" "}
                    {visibleVacancies.length}
                  </span>
                )}
              </div>
              <div
                className={`${styles.showManyButtonWrapper}
                ${
                  showManyVacancies ? styles.showManyButtonWrapperShifted : ""
                }`}
              >
                <button
                  className={styles.showManyButton}
                  onClick={toggleShowAllVacancies}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {showManyVacancies
                    ? "Скрыть вакансии"
                    : "Показать все вакансии"}
                </button>
              </div>
            </div>
          )}
          <div className={styles.temporaryText}>
            {windowWidth > 1024
              ? "Не нашли подходящую вакансию?"
              : "Мы ищем именно тебя!"}
          </div>
          <div className={styles.textUnderForm}>
            Оставьте ваши контакты, мы всегда в поиске талантливых
            профессионалов
          </div>
          <div className={styles.vacancyFormWrapper}>
            <VacancyFormContact
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              handleMouseHover={handleMouseHover}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VacanciesMain;
