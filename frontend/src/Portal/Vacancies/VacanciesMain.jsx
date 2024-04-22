import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Vacancies.module.css";
import { Link } from "react-router-dom";
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
import buttonLink from "./icons/buttonLink.svg";
import FilterModalVacancies from "./FilterModalVacancies";

const Vacancies = ({
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
    activeFilters
  } = useSelector(
    (state) => state.vacancies
  );
  const selectedFilter = useSelector((state) => state.vacancies.selectedFilter);

  const [showManyVacancies, setShowManyVacancies] = useState(false);
  const [totalDisplayedVacancies, setTotalDisplayedVacancies] = useState(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});


  const buttonVacancyChoose = [
    "Все",
    "Архитектура",
    "Конструкции",
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
    "Локация": "locationStaff",
    "Режим работы": "modeOperating",
    "Занятость": "busyness",
  };
  

  const vacanciesMain = [...filteredVacancies].reverse();

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getFetchForm());
    dispatch(fetchFilteredVacancies(filters));
    dispatch(getVacanciesByDirection());
  }, [dispatch, filters]);

  useEffect(() => {
    const filteredVacancies = applyFilters(vacancies, activeFilters);
     dispatch(setFilteredVacancies(filteredVacancies));
  }, [activeFilters, dispatch, vacancies]);
  
  

  function applyFilters(vacancies, filters) {
    return vacancies.filter(vacancy => {
      return Object.keys(filters).every(filterKey => {
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

  const clearAllFilters = () => {
    setActiveFilters([]);
    setFilters({});
    dispatch(setFilteredVacancies(vacancies)); // сбрасываем фильтрованные вакансии
  };

  // Обработчик для удаления конкретного фильтра
  const removeFilter = (category, value) => {
    const newActiveFilters = activeFilters.filter(
      (filter) => filter.category !== category || filter.value !== value
    );
    setActiveFilters(newActiveFilters);
    
    // Здесь обновляем `filters` для модального окна, если требуется
    // и перефильтровываем вакансии
  };

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
                  <div key={el} className={styles.button_wrapper}>
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
            <button
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={styles.menu__button__choose__vacancyFilter}
              onClick={handleModalOpen}
            >
              <div className={styles.icon__svg_button__choose__vacancyFilter}>
                <img src={iconFilter} alt="IconFilter" />
              </div>
              <div className={styles.button_choose_vacancyFilter}>
                Фильтр
                </div>
            </button>
            <FilterModalVacancies
              isOpen={isModalOpen}
              onClose={handleModalClose}
              setFilters={setFilters}
              filters={filters}
            />
          </div>
          {/* <div className={styles.activeFiltersContainer}>
        {activeFilters.map((filter, index) => (
          <div key={index} className={styles.activeFilterTag}>
            {filter.label}
            <button onClick={() => removeFilter(filter.category, filter.value)}>
              &times;
            </button>
          </div>
        ))}
        {activeFilters.length > 0 && (
          <button onClick={clearAllFilters}>
            Очистить все
          </button>
        )}
      </div> */}
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
                  <Link
                    key={vacancy.id}
                    to={`/vacancy/${vacancy.id}`}
                    className={styles.vacancyContainer}
                  >
                    <div
                      className={`${styles.vacancyCell1} ${styles.vacancyCell_title}`}
                    >
                      {vacancy.title}
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
                  </Link>
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
           ${showManyVacancies ? styles.showManyButtonWrapperShifted : ""}`}
              >
                <button
                  className={styles.showManyButton}
                  onClick={toggleShowAllVacancies}
                >
                  {showManyVacancies
                    ? "Скрыть вакансии"
                    : "Показать все вакансии"}
                </button>
              </div>
            </div>
          )}
          <div className={styles.temporaryText}>
            Не нашли подходящую вакансию?
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

export default Vacancies;
