import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Vacancies.module.css";
// import { Link } from "react-router-dom";
import LoadingCircle from "../../Loading/LoadingCircle";
import {
  getFetchForm,
  getFetchFormFilter,
  getVacanciesByDirection,
  setSelectedFilter,
  setVacancyCountsByDirection,
} from "../../store/Slice/vacanciesSlice";
import VacancyFormContact from "../../UI/VacancyFormContact/VacancyFormContact";

import iconFilter from "./icons/filter.svg";

const Vacancies = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
}) => {
  const dispatch = useDispatch();
  const { vacancies, loading, vacancyCountsByDirection } = useSelector(
    (state) => state.vacancies
  );
  const selectedFilter = useSelector((state) => state.vacancies.selectedFilter);

  const [showManyVacancies, setShowManyVacancies] = useState(false);
  const [totalDisplayedVacancies, setTotalDisplayedVacancies] = useState(6);

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

  const vacanciesList = [
    {title: "Специальность", field: "title", className: styles.vacancy_item},
    {title: "Направление", field1: "direction", className: styles.vacancy_item2},
    {title: "Занятость", field1: "busyness", className: styles.vacancy_item2},
    {title: "Локация", field1: "locationStaff", className: styles.vacancy_item2},
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getFetchForm());
    dispatch(getVacanciesByDirection());
  }, [dispatch]);

  useEffect(() => {
    setTotalDisplayedVacancies(showManyVacancies ? vacancies.length : 6);
  }, [showManyVacancies, vacancies]);

  
  const handleButtonClick = (direction) => {
    dispatch(setSelectedFilter(direction));
    dispatch(getFetchFormFilter(direction));
    setTotalDisplayedVacancies(6);
  };

  const toggleShowAllVacancies = () => {
    setShowManyVacancies((prev) => !prev);
  };

  return (
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
      {/* {!isActive && ( */}
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
                    <span className={styles.menu_button_items_vacancyCount}>
                      {el !== "Все" && vacancyCountsByDirection
                        ? vacancyCountsByDirection[el] || 0
                        : ""}
                    </span>
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
          // onClick={handleSelectCityClick}
        >
          <div className={styles.icon__svg_button__choose__vacancyFilter}>
            <img src={iconFilter} alt="IconFilter" />
          </div>
          <div className={styles.button_choose_vacancyFilter}>Фильтр</div>
        </button>
      </div>
      {loading ? (
        <div className={styles.loader}>
          <LoadingCircle />
        </div>
      ) : (
      //   <div className={styles.section_block_vacancy}>
      //   <div className={styles.vacancy_item_container_title}>
      //     <div className={styles.vacancy_item_title}>Специальность</div>
      //     <div className={styles.vacancy_item_title}>Направление</div>
      //     <div className={styles.vacancy_item_title}>Занятость</div>
      //     <div className={styles.vacancy_item_title}>Локация</div>
      //   </div>
      //   {vacancies.slice(0, showManyVacancies ? vacancies.length : 6).map((vacancy) => (
      //     <div key={vacancy.id} className={styles.vacancy_item_container_content}>
      //       <div className={styles.vacancy_item_content}>{vacancy.title}</div>
      //       <div className={styles.vacancy_item_content}>{vacancy.direction}</div>
      //       <div className={styles.vacancy_item_content}>{vacancy.busyness}</div>
      //       <div className={styles.vacancy_item_content}>{vacancy.locationStaff}</div>
      //     </div>
      //   ))}
      // </div>
        <div className={styles.vacancy_section_block_vacancy}>
          <div className={styles.section_block_vacancy}>
            {vacanciesList.map((item, index) => (
              <div key={index} className={`${item.className} ${styles.vacancy_item_container}`}>
                <div className={styles.vacancy_item_title}>{item.title}</div>
                {vacancies.slice(0, showManyVacancies ? vacancies.length : 6).map((vacancy) => (
                  <div key={vacancy.id} className={styles.vacancy_item_content_wrapper}      >
                    <div className={styles.vacancy_item_content}>
                      {vacancy[item.field]}
                    </div>
                    <div className={styles.vacancy_item_content2}>
                      {vacancy[item.field1]}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.showVacanciesOfTotalVacancies}> 
           {!showManyVacancies && vacancies.length > 6 && (
    <span className={styles.showManyVacanciesCount}>
      {totalDisplayedVacancies} вакансий из {vacancies.length}
      </span>
  )}
  </div>
      <div className={styles.showManyButtonWrapper}> 
  <button className={styles.showManyButton} onClick={toggleShowAllVacancies}>
    {showManyVacancies ? "Скрыть вакансии" : "Показать все вакансии"}
  </button>
</div>
      <div className={styles.temporaryText}>Не нашли подходящую вакансию?</div>
      <div className={styles.textUnderForm}>
        Оставьте ваши контакты, мы всегда в поиске талантливых профессионалов
      </div>
      <div className={styles.vacancyFormWrapper}>
        <VacancyFormContact
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleMouseHover={handleMouseHover}
        />
      </div>
    </div>
  );
};

export default Vacancies;
