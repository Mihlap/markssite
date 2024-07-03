import React from 'react';

import Intro from "../Intro/Intro";
import VideoScroll from '../VideoScroll/VideoScroll';
import RatingSwiper from '../RatingSwiper/RatingSwiper';
import BenefitsGrid from '../BenefitsGrid/BenefitsGrid';
import SocialsSwiper from '../SocialsSwiper/SocialsSwiper';
import VacanciesMap from '../VacanciesMap/VacanciesMap';
import VacanciesInvite from '../VacanciesInvite/VacanciesInvite';
import TextCenter from '../TextCenter/TextCenter';

const VacanciesMain3 = () => {
	return (
		<>
			<Intro />
			<VideoScroll />
			<TextCenter />
			<RatingSwiper />
			<VacanciesMap />
			<BenefitsGrid />
			<VacanciesInvite />
			<SocialsSwiper />
		</>
	);
};

export default VacanciesMain3;
