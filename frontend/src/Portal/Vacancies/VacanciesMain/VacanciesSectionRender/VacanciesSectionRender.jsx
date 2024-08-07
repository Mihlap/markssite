import React from "react";
import { Link } from "react-router-dom";
import styles from "./VacanciesSectionRender.module.scss";
import LoadingCircle from "../../../../Loading/LoadingCircle";

import buttonLink from "../../icons/buttonLink.svg";
import buttonLink_ipad from "../../icons/buttonLink1.svg";

const VacanciesSectionRender = ({
  loading,
  visibleVacancies,
  shouldDisplayVacancy,
  showManyVacancies,
  toggleShowAllVacancies,
  totalDisplayedVacancies,
  windowWidth,
  handleMouseEnter,
  handleMouseLeave,
  isInternship = false
}) => {
  return loading ? (
    <div className={styles.loader}>
      <LoadingCircle />
    </div>
  ) : visibleVacancies.length > 0 ? (
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
      {visibleVacancies
        .filter(shouldDisplayVacancy)
        .slice(
          0,
          showManyVacancies ? visibleVacancies.length : totalDisplayedVacancies
        )
        .map((vacancy) => (
          <Link
            key={vacancy.id}
            to={`/portal/vacancy/${vacancy.id}`}
            className={styles.vacancyContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {windowWidth > 1024 ? (
              <>
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
              </>
            ) : (
              <>
                <div className={styles.vacancyContainer111}>
                  <div
                    className={`${styles.vacancyCell1} ${styles.vacancyCell_title}`}
                  >
                    {vacancy.title}
                  </div>
                  <div className={styles.vacancyCell_buttonLink_ipad}>
                    <img src={buttonLink_ipad} alt="buttonLink_ipad" />
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
          </Link>
        ))}
      {visibleVacancies.length > 6 && (
        <div className={styles.showVacanciesOfTotalVacanciesContainer}>
          <div className={styles.showVacanciesOfTotalVacancies}>
            {!showManyVacancies && visibleVacancies.length > 6 && (
              <span className={styles.showManyVacanciesCount}>
               {totalDisplayedVacancies} из {visibleVacancies.length} {isInternship ? 'стажировок' : 'вакансий'}
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
                {showManyVacancies ? (isInternship ?
                  "Скрыть стажировки" : "Скрыть вакансии")
                  :
                  (isInternship ? "Показать все стажировки" : "Показать все вакансии")}
            </button>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className={styles.vacancy_content_massage}>
       {isInternship ? 'Скоро здесь появятся стажировки' : 'Скоро здесь появятся вакансии'}
    </div>
  );
};

export default VacanciesSectionRender;
