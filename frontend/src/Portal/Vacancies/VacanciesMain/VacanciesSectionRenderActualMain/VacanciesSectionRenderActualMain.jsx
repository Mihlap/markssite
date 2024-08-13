import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../VacanciesSectionRender/VacanciesSectionRender.module.scss';
import LoadingCircle from '../../../../Loading/LoadingCircle';
import buttonLink from '../../icons/buttonLink.svg';
import buttonLink_ipad from '../../icons/buttonLink1.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getZaprosData } from '../../../../store/Slice/searchVacancyMainSlice';
import { getFetchForm } from '../../../../store/Slice/vacanciesSlice';

const VacanciesSectionRenderActualMain = ({
  handleMouseEnter,
  handleMouseLeave, 
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const dispatch = useDispatch();
  const { vacancies, loading } = useSelector((state) => state.searchvacancy);
  const vacanciesСount = useSelector((state) => state.vacancies.vacancies); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getZaprosData());
    dispatch(getFetchForm());
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      // ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const displayedVacancies = useMemo(() => {
    return vacancies?.slice(0, 6);
  }, [vacancies]);

  const getAnnouncementText = () => {
    const count = vacanciesСount.length; 
    if (count === 0) {
      return null;
    }
    if (count < 10) {
      return "Мы ищем уникальных специалистов";
    }
     return `Мы ищем более ${Math.floor(count / 10) * 10} специалистов`;
};
  
  return (
    <div>
      {loading ? (
        <div className={styles.loader}>
          <LoadingCircle />
        </div>
        ) : vacancies.length === 0 ? (
          <div className={styles.vacancy_content_massage} style={{paddingBottom: "3rem"}}>
            Скоро здесь появятся актуальные вакансии
          </div>
        ) : (
          <>
          <div className={styles.currentVacanciesTitle}></div>
          <div className={styles.vacanciesHeaders}>
            <div className={styles.headerCell_specialization}>Специальность</div>
            <div className={`${styles.headerCell} ${styles.headerCell_direction}`}>Направление</div>
            <div className={`${styles.headerCell} ${styles.headerCell_busyness}`}>Занятость</div>
            <div className={`${styles.headerCell} ${styles.headerCell_location}`}>Локация</div>
          </div>
          {displayedVacancies.map((vacancy) => (
              <Link
                key={vacancy.id}
                to={`/portal/vacancy/${vacancy?.IdVacancy}`}
                className={styles.vacancyContainer}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                {windowWidth > 1024 ? (
                  <>
                    <div className={`${styles.vacancyCell1} ${styles.vacancyCell_title}`}>
                      {vacancy?.vacancy?.title}
                    </div>
                    <div className={`${styles.vacancyCell} ${styles.vacancyCell_direction}`}>
                      {vacancy?.vacancy?.direction}
                    </div>
                    <div className={`${styles.vacancyCell} ${styles.vacancyCell_busyness}`}>
                      {vacancy?.vacancy?.busyness}
                    </div>
                    <div className={`${styles.vacancyCell} ${styles.vacancyCell_locationStaff}`}>
                      {vacancy?.vacancy?.locationStaff}
                    </div>
                    <div className={styles.vacancyCell_buttonLink}>
                      <img src={buttonLink} alt="buttonLink" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.vacancyContainer111}>
                      <div className={`${styles.vacancyCell1} ${styles.vacancyCell_title}`}>
                        {vacancy?.vacancy?.title}
                      </div>
                      <div className={styles.vacancyCell_buttonLink_ipad}>
                        <img src={buttonLink_ipad} alt="buttonLink_ipad" />
                      </div>
                    </div>
                    <div className={styles.vacancyContainer222}>
                      <div className={`${styles.vacancyCell} ${styles.vacancyCell_direction}`}>
                        {vacancy?.vacancy?.direction}
                      </div>
                      <div className={`${styles.vacancyCell} ${styles.vacancyCell_busyness}`}>
                        {vacancy?.vacancy?.busyness}
                      </div>
                      <div className={`${styles.vacancyCell} ${styles.vacancyCell_locationStaff}`}>
                        {vacancy?.vacancy?.locationStaff}
                      </div>
                    </div>
                  </>
                )}
              </Link>
           ))}          
             <div className={`${styles.showVacanciesOfTotalVacancies} ${styles.actualMain}`}>
            {getAnnouncementText() && (
              <div className={styles.vacancyAnnouncement}>{getAnnouncementText()}</div>
            )}
                <Link
                  to="/portal/vacancies"
                  className={styles.showManyButton}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}>
                  Смотреть все вакансии
                </Link>
             </div>
         </>
      )}
    </div>
  );
};

export default VacanciesSectionRenderActualMain;
