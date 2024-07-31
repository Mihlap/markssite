import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../VacanciesSectionRender/VacanciesSectionRender.module.scss";
import LoadingCircle from "../../../../Loading/LoadingCircle";

import buttonLink from "../../icons/buttonLink.svg";
import buttonLink_ipad from "../../icons/buttonLink1.svg";
import { useDispatch, useSelector } from "react-redux";
import { getZaprosData } from "../../../../store/Slice/searchVacancyMainSlice";

const VacanciesSectionRenderActualMain = ({
  showManyVacancies,
  toggleShowAllVacancies,
  totalDisplayedVacancies,
  windowWidth,
  handleMouseEnter,
  handleMouseLeave,
}) => {

  const dispatch = useDispatch();
  const { vacancies, loading } = useSelector((state) => state.searchvacancy);
 
  useEffect(() => {
      dispatch(getZaprosData());
  }, [dispatch]);


  return loading ? (
    <div className={styles.loader}>
      <LoadingCircle />
    </div>
  ) : vacancies.length > 0 ? (
    <>
      <div className={styles.vacanciesHeaders}>
        <div className={styles.headerCell_specialization}>Специальность</div>
        <div className={`${styles.headerCell} ${styles.headerCell_direction}`}>
          Направление
        </div>
        <div className={`${styles.headerCell} ${styles.headerCell_busyness}`}>
          Занятость
        </div>
        <div className={`${styles.headerCell} ${styles.headerCell_location}`}>
          Локация
        </div>
      </div>
      {vacancies?.map((item) => (
          <Link
            key={item.id}
            to={`/vacancy/${item.vacancy.IdVacancy}`}
            className={styles.vacancyContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {windowWidth > 1024 ? (
              <>
                <div
                  className={`${styles.vacancyCell1} ${styles.vacancyCell_title}`}
                >
                      {item.vacancy.vacancy.title}
                </div>
                <div
                  className={`${styles.vacancyCell} ${styles.vacancyCell_direction}`}
                >
                 {item.vacancy.vacancy.direction}
                </div>
                <div
                  className={`${styles.vacancyCell} ${styles.vacancyCell_busyness}`}
                >
                    {item.vacancy.vacancy.busyness}
                </div>
                <div
                  className={`${styles.vacancyCell} ${styles.vacancyCell_locationStaff}`}
                >
                 {item.vacancy.vacancy.locationStaff}
                </div>
                <div className={styles.vacancyCell_buttonLink}>
                  <img src={buttonLink} alt="buttonLink" />
                </div>
              </>
            ) : (
              <>
                <div className={styles.vacancyContainer111}>
                  <div
                    className={`${styles.vacancyCell1} ${styles.vacancyCell_title}`}
                  >
                    {item.vacancy.vacancy.title}
                  </div>
                  <div className={styles.vacancyCell_buttonLink_ipad}>
                    <img src={buttonLink_ipad} alt="buttonLink_ipad" />
                  </div>
                </div>
                <div className={styles.vacancyContainer222}>
                  <div
                    className={`${styles.vacancyCell} ${styles.vacancyCell_direction}`}
                  >
                   {item.vacancy.vacancy.direction}
                  </div>
                  <div
                    className={`${styles.vacancyCell} ${styles.vacancyCell_busyness}`}
                  >
                      {item.vacancy.vacancy.busyness}
                  </div>
                  <div
                    className={`${styles.vacancyCell} ${styles.vacancyCell_locationStaff}`}
                  >
                    {item.vacancy.vacancy.locationStaff}
                  </div>
                </div>
              </>
            )}
          </Link>
        ))}
      {vacancies.length > 6 && (
        <div className={styles.showVacanciesOfTotalVacanciesContainer}>
          <div className={styles.showVacanciesOfTotalVacancies}>
            {!showManyVacancies && vacancies.length > 6 && (
              <span className={styles.showManyVacanciesCount}>
                {totalDisplayedVacancies} вакансий из {vacancies.length}
              </span>
            )}
          </div>
          <div
            className={`${styles.showManyButtonWrapper} ${
              showManyVacancies ? styles.showManyButtonWrapperShifted : ""
            }`}
          >
            <button
              className={styles.showManyButton}
              onClick={toggleShowAllVacancies}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {showManyVacancies ? "Скрыть вакансии" : "Показать все вакансии"}
            </button>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className={styles.vacancy_content_massage}>
      Скоро здесь появятся вакансии
    </div>
  );
};

export default VacanciesSectionRenderActualMain;
