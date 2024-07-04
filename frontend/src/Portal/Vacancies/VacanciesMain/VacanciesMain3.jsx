import React from 'react';

import Intro from "../Intro/Intro";
import VideoScroll from '../VideoScroll/VideoScroll';
import TextCenter from '../TextCenter/TextCenter';
import RatingSwiper from '../RatingSwiper/RatingSwiper';
import CountRows from '../CountRows/CountRows';
import DirectionsGrid from '../DirectionsGrid/DirectionsGrid';
import VacanciesMap from '../VacanciesMap/VacanciesMap';
import BenefitsGrid from '../BenefitsGrid/BenefitsGrid';
import VacanciesInvite from '../VacanciesInvite/VacanciesInvite';
import SocialsSwiper from '../SocialsSwiper/SocialsSwiper';

const VacanciesMain3 = () => {
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
			<VacanciesInvite />
			<SocialsSwiper />
		</>
	);
};

export default VacanciesMain3;
