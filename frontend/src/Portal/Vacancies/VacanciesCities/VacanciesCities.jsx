
import React, { useLayoutEffect, useRef }  from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from 'gsap';

import styles from "./VacanciesCities.module.scss";
import map from "../icons/vacancies-cities.png";


const VacanciesCities = () => {
	
	const city = useRef(null);

	gsap.registerPlugin(ScrollTrigger);

	useLayoutEffect(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: `.${styles.VacanciesCities}`,
				start: 'top bottom',
				end:'bottom top',
				markers: true,
				scrub: true,
			},
		});

	
	}, []);
	
	return (
		<section className={styles.VacanciesCities}>
			<div className={styles.VacanciesCities__text}>
				<h2>Ищем сотрудников по всей Стране!</h2>
				<p>У нашей компании 3 офиса в России и один в Ташкенте. Если ты крутой специалист, мы готовы помочь с переездом и поиском квартиры</p>
				<a href="#">Взглянуть на офис</a>
			</div>
			<div className={styles.VacanciesCities__map}>
				<img src={map} alt="Карта офисов" />
				<div className={`${styles.VacanciesCities__city} ${styles.VacanciesCities__city_msk}`}>
						<div className={styles.VacanciesCities__box}>
							<span>Москва</span>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_xl}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_l}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_m}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_s}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_xs}`}></div>
						</div>
				</div>
				<div className={`${styles.VacanciesCities__city} ${styles.VacanciesCities__city_obg}`}>
						<div className={styles.VacanciesCities__box}>
							<span>Оренбург</span>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_m}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_s}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_xs}`}></div>
						</div>
				</div>
				<div className={`${styles.VacanciesCities__city} ${styles.VacanciesCities__city_chbk}`}>
						<div className={styles.VacanciesCities__box}>
							<span>Челябинск</span>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_m}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_s}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_xs}`}></div>
						</div>
				</div>
				<div className={`${styles.VacanciesCities__city} ${styles.VacanciesCities__city_tsht}`}>
						<div className={styles.VacanciesCities__box}>
							<span>Ташкент</span>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_m}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_s}`}></div>
							<div className={`${styles.VacanciesCities__circle} ${styles.VacanciesCities__circle_xs}`}></div>
						</div>
				</div>
			</div>
		</section>
	);
};

export default VacanciesCities;
