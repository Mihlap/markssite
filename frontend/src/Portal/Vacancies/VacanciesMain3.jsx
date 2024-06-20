import React, { useRef, useEffect } from 'react';
import styles from "./VacanciesMain3.module.scss";
import Intro from "./Intro/Intro";
import RatingSwiper from './RatingSwiper/RatingSwiper';
import BenefitsGrid from './BenefitsGrid/BenefitsGrid';
import SocialsSwiper from './SocialsSwiper/SocialsSwiper';

import "swiper/css";
import "swiper/css/navigation";


import invite_1 from "./icons/invite-1.png";
import invite_2 from "./icons/invite-2.png";


const VacanciesMain3 = () => {
	return (
		<>
			<Intro />
		
			<section className={styles.socials}>
				<div className={styles.socials__header}>
					<h2>Подписывайся на <span>наши каналы в&nbsp;социальных сетях</span>, там всегда можно найти информации о лекциях, конференциях и ключевых объектах</h2>
				</div>
				<div className={styles.socials__slider}>
					<SocialsSwiper />
				</div>
			</section>

			
			<section className={styles.rating}>
				<div className={styles.rating__header}>
					<h2>
						<span>Передовая компания</span><span>в сфере проектирования</span>
					</h2>
				</div>
				<RatingSwiper />
			</section>
			
			<BenefitsGrid />
			
			{/* <section className={styles.invite}>
				<h2>Приглашаем студентов на стажировку</h2>
				<div className={styles.invite__content}>
					<div className={styles.invite__content}>
						<div className={styles.invite__photos}>
							<img src={invite_1}></img>
							<img src={invite_2}></img>
							<img src={invite_1}></img>
							<img src={invite_1}></img>
							<div className={styles.invite__photohh}></div>
						</div>
						<div className={styles.invite__desc}>Команда <span>молодых специалистов MARKSGROUP</span> помогает с адаптацией и погружением в команду
						</div>
						<a href="#" className={styles.invite__button}>Узнать больше</a>
					</div>
				</div>
			</section> */}
		</>
	);
};

export default VacanciesMain3;
