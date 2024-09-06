import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../Vacancies/VacanciesMain/VacanciesComponent/VacanciesComponent.module.css';
import 'swiper/css';
import { 
  getFetchForm, 
  getVacanciesByDirection,
} from '../../store/Slice/vacanciesSlice';
import { setPreviousPage } from '../../store/Slice/previousPageSlice';
import { setActivePage  } from '../../store/Slice/activePageSlice';
import VacanciesSectionRender from '../Vacancies/VacanciesMain/VacanciesSectionRender/VacanciesSectionRender';
import VacancyFormContact from '../../UI/VacancyFormContact/VacancyFormContact';
import RocketComponents from '../../UI/Rocket/RocketComponents';

const Internships = ({ handleMouseEnter, handleMouseLeave, handleMouseHover, hideVacancies }) => {
  const dispatch = useDispatch();
  const { vacancies, loading } = useSelector(
    (state) => state.vacancies
  );  
  const activePage = useSelector(state => state.activePage.page);
  const [showManyVacancies, setShowManyVacancies] = useState(false);
  const [totalDisplayedVacancies, setTotalDisplayedVacancies] = useState(6); 
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const vacanciesMain = useMemo(() => [...vacancies].reverse(), [vacancies]);

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(setPreviousPage('internships'));
    dispatch(setActivePage('internships'));
  }, [dispatch]);


  useEffect(() => {
    window.scrollTo(0, 0);
      dispatch(getVacanciesByDirection());
      dispatch(getFetchForm());
    }, [dispatch]);


  const toggleShowAllVacancies = useCallback(() => {
    setShowManyVacancies((prev) => !prev);
  }, []);


  const shouldDisplayVacancy = useCallback((vacancy) => {
    return !vacancy.hidden;
  }, []);

   const visibleVacancies = useMemo(
     () => vacanciesMain.filter((vacancy) => shouldDisplayVacancy(vacancy) && vacancy.type !== 'вакансия'),    
    [vacanciesMain, shouldDisplayVacancy]
  );
  
  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      {!hideVacancies && (
        <div className={styles.main_vacancies_block}>
          <div className={styles.wrapper_vacancies}>
            <div className={styles.rocket_model}>          
              <RocketComponents />
            </div>
            <div className={styles.vacancies_header_wrapper}>
              <span className={styles.vacancies_header1}>Ждём молодых и&nbsp;активных</span>
              <span className={styles.vacancies_header2}>Стажировки</span>
            </div>
          </div>         
          <VacanciesSectionRender
            loading={loading}
            visibleVacancies={visibleVacancies}
            shouldDisplayVacancy={shouldDisplayVacancy}
            showManyVacancies={showManyVacancies}
            toggleShowAllVacancies={toggleShowAllVacancies}
            totalDisplayedVacancies={totalDisplayedVacancies}
            windowWidth={windowWidth}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            isInternship={true} 
          />

          <div className={`${styles.temporaryText} ${styles.temporaryText_intership}`}>
            {/* {windowWidth > 1024 ? 'Не нашли подходящую вакансию?' : 'Мы ищем именно тебя!'} */}
            Хочешь пройти у&nbsp;нас&nbsp;стажировку,
            но&nbsp;не&nbsp;нашел подходящую?
          </div>
          <div className={styles.textUnderForm}>
            Присылай резюме, обсудим!
          </div>
          <div className={styles.vacancyFormWrapper}>
            <VacancyFormContact
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              handleMouseHover={handleMouseHover}
              centerButton={true}
              isInternship={true} 
              buttonText={activePage === 'internships' ? 'Откликнуться на стажировку' : 'Откликнуться на вакансию'}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Internships);
