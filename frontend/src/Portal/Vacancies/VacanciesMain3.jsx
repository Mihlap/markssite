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
import StarsFour3d from './StarsFour3d/StarsFour3d';
import VideoScroll from './VideoScroll/VideoScroll';

import invite_1 from "./icons/invite-1.png";
import invite_2 from "./icons/invite-2.png";

const VacanciesMain3 = () => {
	const star1Ref = useRef(null);
	const star2Ref = useRef(null);
	const star3Ref = useRef(null);
	const star4Ref = useRef(null);

	const rotationDeg = 60;
	const opacity = 0.4;

	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: `.${styles.invite}`,
				start: '11% bottom',
				end:'bottom top',
				scrub: true,
			},
		});

		tl.to([star1Ref.current, star3Ref.current],
			 {
				rotation: rotationDeg,
			}
		)

		const tl2 = gsap.timeline({
			scrollTrigger: {
				trigger: `.${styles.invite}`,
				start: '11% bottom',
				end:'bottom top',
				scrub: true,
			},
		});

		tl2.to([star2Ref.current, star4Ref.current],
			{
			 rotation: -(rotationDeg),
		 }
	 )

	 const tl3 = gsap.timeline({
		scrollTrigger: {
			trigger: `.${styles.invite}`,
			start: '11% bottom',
			end:'bottom top',
			scrub: true,
		},
	});
	
	tl3.to([star3Ref.current, star4Ref.current],
		{
			opacity: opacity
		}
	)
	}, []);

	return (
		<>
			<Intro />

			<VideoScroll />

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
				<StarsFour3d 
					section='invite' 
					styles={styles} 
					star1Ref={star1Ref} 
					star2Ref={star2Ref} 
					star3Ref={star3Ref} 
					star4Ref={star4Ref} 
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
