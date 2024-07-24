import React, { useEffect, useState, useCallback, useMemo } from 'react';

import { useSelector } from 'react-redux';
import Intro from '../Intro/Intro';
import TextCenter from '../TextCenter/TextCenter';
import RatingSwiper from '../RatingSwiper/RatingSwiper';
import CountRows from '../CountRows/CountRows';
import DirectionsGrid from '../DirectionsGrid/DirectionsGrid';
import VacanciesMap from '../VacanciesMap/VacanciesMap';
import BenefitsGrid from '../BenefitsGrid/BenefitsGrid';
import VacanciesInvite from '../VacanciesInvite/VacanciesInvite';
import SocialsSwiper from '../SocialsSwiper/SocialsSwiper';
import GalleryTabs from '../GalleryTabs/GalleryTabs';
import VacanciesList from '../VacanciesList/VacanciesList';
import VacancyFormContact from '../../../UI/VacancyFormContact/VacancyFormContact';

import styles from './VacanciesMain3.module.scss';
import VacanciesSectionRender from './VacanciesSectionRender/VacanciesSectionRender';

const VacanciesMain3 = ({ handleMouseEnter, handleMouseLeave, handleMouseHover }) => {
  const [windowWidth] = useState(window.innerWidth);
  const [showManyVacancies, setShowManyVacancies] = useState(false);

  const [totalDisplayedVacancies, setTotalDisplayedVacancies] = useState(6);
  const { vacancies, loading, vacancyCountsByDirection, filteredVacancies, activeFilters } = useSelector(
    (state) => state.vacancies
  );

  const shouldDisplayVacancy = useCallback((vacancy) => {
    return !vacancy.hidden;
  }, []);

  const vacanciesMain = useMemo(() => [...filteredVacancies].reverse(), [filteredVacancies]);

  const visibleVacancies = useMemo(
    () => vacanciesMain.filter((vacancy) => shouldDisplayVacancy(vacancy)),
    [vacanciesMain, shouldDisplayVacancy]
  );

  const toggleShowAllVacancies = useCallback(() => {
    setShowManyVacancies((prev) => !prev);
  }, []);

  return (
    <>
      <Intro />
      <TextCenter />
      <RatingSwiper />
      <CountRows />
      <DirectionsGrid />
      <VacanciesMap />
      <BenefitsGrid />
      <VacanciesList />

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
      />

      <VacanciesInvite />
      <SocialsSwiper />
      <GalleryTabs
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handleMouseHover={handleMouseHover}
      />
      <div className={styles.temporaryText}>
        {windowWidth > 1024 ? 'Не нашли подходящую вакансию?' : 'Мы ищем именно тебя!'}
      </div>
      <div className={styles.textUnderForm}>Оставьте ваши контакты, мы всегда в поиске талантливых профессионалов</div>
      <div className={styles.vacancyFormWrapper}>
        <VacancyFormContact
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleMouseHover={handleMouseHover}
        />
      </div>
    </>
  );
};

export default VacanciesMain3;
