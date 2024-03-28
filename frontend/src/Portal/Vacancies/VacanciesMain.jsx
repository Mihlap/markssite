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

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getFetchForm());
    dispatch(getVacanciesByDirection());
  }, [dispatch]);

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

  const handleButtonClick = (direction) => {
    dispatch(setSelectedFilter(direction));
    dispatch(getFetchFormFilter(direction));
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
        <div className={styles.vacancy_section_block_vacancy}>
          <div className={styles.section_block_vacancy}>
            <div className={styles.vacancy_item}>
              <div className={styles.vacancy_item_title}>Специальность</div>
              {vacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className={styles.vacancy_item_content_wrapper}
                >
                  <div className={styles.vacancy_item_content}>
                    {vacancy.title}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.vacancy_item2}>
              <div className={styles.vacancy_item_title2}>Направление</div>
              {vacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className={styles.vacancy_item_content_wrapper}
                >
                  <div className={styles.vacancy_item_content2}>
                    {vacancy.direction}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.vacancy_item2}>
              <div className={styles.vacancy_item_title2}>Занятость</div>
              {vacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className={styles.vacancy_item_content_wrapper}
                >
                  <div className={styles.vacancy_item_content2}>
                    {vacancy.busyness}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.vacancy_item2}>
              <div className={styles.vacancy_item_title2}>Локация</div>
              {vacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className={styles.vacancy_item_content_wrapper}
                >
                  <div className={styles.vacancy_item_content2}>
                    {vacancy.locationStaff}
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
          
        //   <div className={styles.vacancy_section_block_vacancy}>
        //   <div className={styles.section_block_vacancy}>
        //     {[
        //       {
        //         title: "Специальность",
        //         field: "title",
        //         className: styles.vacancy_item,
        //       },
        //       {
        //         title: "Направление",
        //         field: "direction",
        //         className: styles.vacancy_item2,
        //       },
        //       {
        //         title: "Занятость",
        //         field: "busyness",
        //         className: styles.vacancy_item2,
        //       },
        //       {
        //         title: "Локация",
        //         field: "locationStaff",
        //         className: styles.vacancy_item2,
        //       },
        //     ].map((item, index) => (
        //       <div key={index} className={item.className}>
        //         <div className={styles.vacancy_item_title}>{item.title}</div>
        //         {vacancies.map((vacancy) => (
        //           <div
        //             key={vacancy.id}
        //             className={styles.vacancy_item_content_wrapper}
        //           >
        //             <div className={styles.vacancy_item_content}>
        //               {vacancy[item.field]}
        //             </div>
        //           </div>
        //         ))}
        //       </div>
        //     ))}
        //   </div>
        // </div>

      )}
      {!showManyVacancies && (
        <button
          className={styles.showManyButton}
          onClick={toggleShowAllVacancies}
        >
          Показать все вакансии
        </button>
      )}
      {/* <div className={styles.vacancy_section_block_vacancy}>
  <div className={styles.section_block_vacancy}>
    <div className={styles.vacancy_item}>
      <div className={styles.vacancy_item_title}>Специальность</div>
      <div className={styles.vacancy_item_title2}>Направление</div>
      <div className={styles.vacancy_item_title2}>Занятость</div>
      <div className={styles.vacancy_item_title2}>Локация</div>
    </div>

    {vacancies.map((vacancy) => (
      <div key={vacancy.id} className={styles.vacancy_item}>
        <div className={styles.vacancy_item_content_wrapper}>
          <div className={styles.vacancy_item_content}>{vacancy.title}</div>
        </div>

        <div className={styles.vacancy_item_content_wrapper}>
          <div className={styles.vacancy_item_content2}>{vacancy.direction}</div>
        </div>

        <div className={styles.vacancy_item_content_wrapper}>
          <div className={styles.vacancy_item_content2}>{vacancy.busyness}</div>
        </div>

        <div className={styles.vacancy_item_content_wrapper}>
          <div className={styles.vacancy_item_content2}>{vacancy.locationStaff}</div>
        </div>
      </div>
    ))}
  </div>
</div> */}
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
