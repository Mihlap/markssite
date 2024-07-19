import React, { useState } from 'react';

import Intro from '../Intro/Intro';
import VideoScroll from '../VideoScroll/VideoScroll';
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

const VacanciesMain3 = ({ handleMouseEnter, handleMouseLeave, handleMouseHover }) => {
  const [windowWidth] = useState(window.innerWidth);

  return (
    <>
      <Intro />
      <VideoScroll />
      <TextCenter />
      <RatingSwiper />
      <CountRows />
      <DirectionsGrid />
      <VacanciesMap />
      <BenefitsGrid />
      <VacanciesList />
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
