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
    <ul className={styles.main_vacancy_block__wrapper__blockWrapper}>
      {vacancies?.map((vacancy) => (
        <li key={vacancy.id} className={styles.main_vacancy_block__wrapper__blockWrapper__1}>
          <div className={styles.main_vacancy_block__wrapper__left}>
            <div className={styles.main_vacancy_block__wrapper__vacancyTitle}>
              {vacancy.title}
            </div>
            <div className={styles.main_vacancy_block__wrapper__vacancyDetails}>
              <ul className={styles.main_vacancy_block__wrapper__vacancyTitle1}>
                <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleKey}>Мы ищем:</li>
                <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleValue} dangerouslySetInnerHTML={{ __html: vacancy.searchStaff }}></li>
              </ul>
            </div>
          </div>
          <div className={styles.main_vacancy_block__wrapper__blockRight}>
            <ul className={styles.main_vacancy_block__wrapper__vacancyTitle1}>
              <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleKey}>Опыт работы:</li>
              <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleValue}>{vacancy.experience}</li>
            </ul>
            <ul className={styles.main_vacancy_block__wrapper__vacancyTitle1}>
              <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleKey}>Локация:</li>
              <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleValue}>{vacancy.location}</li>
            </ul>
            <ul className={styles.main_vacancy_block__wrapper__vacancyTitle1}>
              <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleKey}>Занятость:</li>
              <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleValue}>{vacancy.employment}</li>
            </ul>
            <ul className={styles.main_vacancy_block__wrapper__vacancyTitle1}>
              <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleKey}>Режим работы:</li>
              <li className={styles.main_vacancy_block__wrapper__vacancyTitle1__titleValue}>{vacancy.workingMode}</li>
            </ul>
          </div>
        </li>
      ))}
    </ul>
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
