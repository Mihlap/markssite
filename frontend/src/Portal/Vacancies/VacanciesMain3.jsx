import React, { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import styles from "./VacanciesMain3.module.scss";
import "swiper/css";
import "swiper/css/navigation";

import Intro from "./Intro/Intro";
import RatingSwiper from './RatingSwiper/RatingSwiper';
import BenefitsGrid from './BenefitsGrid/BenefitsGrid';
import SocialsSwiper from './SocialsSwiper/SocialsSwiper';

import invite_1 from "./icons/invite-1.png";
import invite_2 from "./icons/invite-2.png";

import star_1 from "./icons/star-1.png";
import star_2 from "./icons/star-2.png";
import star_3 from "./icons/star-3.png";
import star_4 from "./icons/star-4.png";


const VacanciesMain3 = () => {
	
	const star1Ref = useRef(null);
	const star2Ref = useRef(null);
	const star3Ref = useRef(null);
	const star4Ref = useRef(null);


	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: `.${styles.invite}`,
				start: 'top bottom',
				end:'bottom top',
				scrub: true,
				markers: true,
			},
		});

		tl.from([star1Ref.current, star3Ref.current],
			{
				rotation: -180, duration: 0.3
			}
		).to([star1Ref.current, star3Ref.current],
			 {
				rotation: 180, duration: 0.3
			}
		)

		const tl2 = gsap.timeline({
			scrollTrigger: {
				trigger: `.${styles.invite}`,
				start: 'top bottom',
				end:'bottom top',
				scrub: true,
				markers: true,
			},
		});

		tl2.from([star2Ref.current, star4Ref.current],
				{
					rotation: 180, duration: 0.2
				}
		).to([star2Ref.current, star4Ref.current],
			{
			 rotation: -180, duration: 0.3
		 }
	 )
	}, []);

	return (
		<>
			<Intro />
			
			<section className={styles.rating}>
				<div className={styles.rating__header}>
					<h2>
						<span>Передовая компания</span><span>в сфере проектирования</span>
					</h2>
				</div>
				<RatingSwiper /> 
			</section>
			
			<BenefitsGrid />
			
			<section className={styles.invite}>
				<div
					className={`${styles.invite__star} ${styles.invite__star_1}`}
					style={{ backgroundImage: `url(${star_1})` }}
					ref={star1Ref}
				/>
				<div
					className={`${styles.invite__star} ${styles.invite__star_2}`}
					style={{ backgroundImage: `url(${star_2})` }}
					ref={star2Ref}
				/>
				<div
					className={`${styles.invite__star} ${styles.invite__star_3}`}
					style={{ backgroundImage: `url(${star_3})` }}
					ref={star3Ref}
				/>
				<div
					className={`${styles.invite__star} ${styles.invite__star_4}`}
					style={{ backgroundImage: `url(${star_4})` }}
					ref={star4Ref}
				/>
				<h2 className={styles.invite__title}>Приглашаем студентов на&nbsp;стажировку</h2>
				<div className={styles.invite__content}>
					<div className={styles.invite__photos}>
						<img src={invite_1}></img>
						<img src={invite_2}></img>
						<img src={invite_1}></img>
						<img src={invite_2}></img>
						<span></span>
					</div>
					<div className={styles.invite__desc}>Команда <span>молодых специалистов MARKSGROUP</span> помогает с адаптацией и&nbsp;погружением в команду
					</div>
					<a href="#" className={styles.invite__button}>Узнать больше</a>
				</div>
			</section>

			
			<section className={styles.socials}>
				<div className={styles.socials__header}>
					<h2>Подписывайся на <span>наши каналы в&nbsp;социальных сетях</span>, там всегда можно найти информации о лекциях, конференциях и ключевых объектах</h2>
				</div>
				<div className={styles.socials__slider}>
					<SocialsSwiper />
				</div>
			</section>

		</>
	);
};

export default VacanciesMain3;
