import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import styles from "./VacanciesMainCard.module.scss";
import AllVacancyButton from "../../UI/ButtonVacancy/AllVacancyButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployees } from "../../store/Slice/vacanciesSlice";
import { useParams } from "react-router-dom";
import Error from "../../Loading/Error/Error";
import LoadingCircle from "../../Loading/LoadingCircle";

const VacanciesMainCard = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const vacancies = useSelector((state) => state.vacancies.vacancies);
  const loading = useSelector((state) => state.vacancies.loading);
  const error = useSelector((state) => state.vacancies.error);

  useEffect(() => {
    dispatch(fetchEmployees(id));
  }, [dispatch, id]);

  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      <div className={styles.main_vacancy_block}>
        <div className={styles.main_vacancy_block__wrapper}>
          {vacancies?.map((vacancy) => (
            <div key={vacancy.id} className={styles.main_vacancy_block__item}>
              <div className={styles.main_vacancy_block__blockLeft}>
                <div className={styles.main_vacancy_block__vacancyTitle}>
                  {vacancy.title}
                </div>
                <div className={styles.main_vacancy_block__vacancyDetails}>
                  <ul className={styles.main_vacancy_block__vacancyTitle1}>
                    <li
                      className={
                        styles.main_vacancy_block__vacancyTitle1__titleKey
                      }
                    >
                      Мы ищем:
                    </li>
                    <li
                      className={
                        styles.main_vacancy_block__vacancyTitle1__titleValue1
                      }
                      dangerouslySetInnerHTML={{ __html: vacancy.searchStaff }}
                    ></li>
                  </ul>
                </div>
              </div>{" "}
              <div className={styles.main_vacancy_block__blockRight}>
                <div
                  className={`${styles.main_vacancy_block__detailItem} ${styles.topLeftSquare}`}
                >
                  <span className={styles.main_vacancy_block__detailKey}>
                    Опыт работы:
                  </span>
                  <span className={styles.main_vacancy_block__detailValue}>
                    {vacancy.experience}
                  </span>
                </div>
                <div
                  className={`${styles.main_vacancy_block__detailItem} ${styles.topRightSquare}`}
                >
                  <span className={styles.main_vacancy_block__detailKey}>
                    Локация:
                  </span>
                  <span className={styles.main_vacancy_block__detailValue}>
                    {vacancy.locationStaff}
                  </span>
                </div>
                <div
                  className={`${styles.main_vacancy_block__detailItem} ${styles.bottomLeftSquare}`}
                >
                  <span className={styles.main_vacancy_block__detailKey}>
                    Занятость:
                  </span>
                  <span className={styles.main_vacancy_block__detailValue}>
                    {vacancy.busyness}
                  </span>
                </div>
                <div
                  className={`${styles.main_vacancy_block__detailItem} ${styles.bottomRightSquare}`}
                >
                  <span className={styles.main_vacancy_block__detailKey}>
                    Режим работы:
                  </span>
                  <span className={styles.main_vacancy_block__detailValue}>
                    {vacancy.modeOperating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={styles.main_vacancy_block__all_button}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AllVacancyButton />
        </div>
      </div>
    </>
  );
};

export default VacanciesMainCard;
