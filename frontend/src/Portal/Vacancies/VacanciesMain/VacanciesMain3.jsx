import React from 'react';

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

const VacanciesMain3 = ({ handleMouseEnter, handleMouseLeave, handleMouseHover }) => {
	return (
		<>
			<Intro />
			{/* <VideoScroll />
			<TextCenter />
			<RatingSwiper />
			<CountRows />
			<DirectionsGrid /> */}
			<VacanciesMap />
			{/* <BenefitsGrid />
			<VacanciesList />
			<VacanciesInvite />
			<SocialsSwiper />
			<GalleryTabs
   handleMouseEnter={handleMouseEnter}
	 handleMouseLeave={handleMouseLeave}
	 handleMouseHover={handleMouseHover}
			/> */}
		</>
	);
};

export default VacanciesMain3;
