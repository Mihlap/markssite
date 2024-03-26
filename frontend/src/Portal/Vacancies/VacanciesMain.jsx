import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Vacancies.module.css";
import { Link } from "react-router-dom";
import LoadingCircle from "../../Loading/LoadingCircle";
import { fetchVacancies } from "../../store/Slice/vacanciesSlice";
import VacancyFormContact from "../../UI/VacancyFormContact/VacancyFormContact";

const Vacancies = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
}) => {
  const dispatch = useDispatch();
  const { vacancies, loading } = useSelector((state) => state.vacancies);

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchVacancies());
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
              <div
                key={el}
                className={`${styles.button_wrapper} ${
                  showButton ? "" : index ? styles.hidden : ""
                }`}
              >
                <button
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className={`${styles.menu__button__allVacancy}`}
                  //  ${
                  //   !isModalProjectOpen &&
                  //   (el === selectedViewConstruction ||
                  //     (index === 0 && !selectedViewConstruction))
                  //     ? styles.active
                  //     : ""
                  //   }

                  // onClick={() => handleButtonClick(el)}
                >
                  <p className={styles.menu_button_items_vacancy}>{el}</p>
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
            {/* <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="icon">
                <path
                  id="Vector"
                  d="M8.00016 7.66665C7.55814 7.66665 7.13421 7.49105 6.82165 7.17849C6.50909 6.86593 6.3335 6.44201 6.3335 5.99998C6.3335 5.55795 6.50909 5.13403 6.82165 4.82147C7.13421 4.50891 7.55814 4.33331 8.00016 4.33331C8.44219 4.33331 8.86611 4.50891 9.17867 4.82147C9.49123 5.13403 9.66683 5.55795 9.66683 5.99998C9.66683 6.21885 9.62372 6.43558 9.53996 6.63779C9.4562 6.83999 9.33344 7.02373 9.17867 7.17849C9.02391 7.33326 8.84018 7.45602 8.63797 7.53978C8.43576 7.62354 8.21903 7.66665 8.00016 7.66665ZM8.00016 1.33331C6.76249 1.33331 5.5755 1.82498 4.70033 2.70015C3.82516 3.57532 3.3335 4.7623 3.3335 5.99998C3.3335 9.49998 8.00016 14.6666 8.00016 14.6666C8.00016 14.6666 12.6668 9.49998 12.6668 5.99998C12.6668 4.7623 12.1752 3.57532 11.3 2.70015C10.4248 1.82498 9.23784 1.33331 8.00016 1.33331Z"
                  fill="#1D2E43"
                />
              </g>
            </svg> */}
          </div>
          <div className={styles.button_choose_vacancyFilter}>Фильтр</div>
        </button>
      </div>
      {/* )} */}
      {/* <div className={styles.vacancy_section_block}>
        <div className={styles.vacancies_advertisingBlock}>
          <div className={styles.vacancies_advertisingBlock_text1}>
            Не отображаются вакансии?
          </div>
          <div className={styles.vacancies_advertisingBlock_text2}>
            Возможно у вас включен блокировщик рекламы
          </div>
        </div>
        {loading ? (
          <div className={styles.loader}>
            <LoadingCircle />
          </div>
          ) : (
          <section className={styles.vacancies_section}>
            <div className={styles.vacancies_list_container}>
              <div className={styles.vacancies_list}>
                {vacancies.map((vacancy) => (
                  <a
                    href={vacancy.alternate_url}
                    className={styles.vacancy_name}
                    key={vacancy.id}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {vacancy.name}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
        <div className={styles.vacancies_text_for_email}>
          Вы можете отправить резюме на&nbsp;почту:
          <Link
            className={styles.mail_link}
            to="mailto:ok@marksgroup.ru"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className={styles.span_mail_vacancies}>hr@marksgroup.ru</span>
          </Link>
        </div>
      </div>       */}
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
