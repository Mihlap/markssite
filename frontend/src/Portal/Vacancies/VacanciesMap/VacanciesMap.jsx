import React, { useLayoutEffect, useRef }  from 'react';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from 'gsap';

import ButtonLink from '../ButtonLink/ButtonLink';
import styles from "./VacanciesMap.module.scss";

const VacanciesMap = () => {
	return (
		<section className={styles.VacanciesMap}>
			<div className={styles.VacanciesMap__text}>
				<h2>Вакансии<br></br>по&nbsp;всему миру!</h2>
				<p>5&nbsp;офисов в&nbsp;России и&nbsp;один в&nbsp;Узбекистане. Если ты&nbsp;крутой специалист, мы&nbsp;готовы помочь с&nbsp;переездом и&nbsp;поиском жилья</p>
				<ButtonLink text="Взглянуть на офис" currentHref="#"/>
			</div>
			<div className={styles.VacanciesMap__map}>
				{/* <img src={map} alt="Карта офисов" /> */}
				<div className={`${styles.VacanciesMap__city} ${styles.VacanciesMap__city_spb}`}>
						<div className={styles.VacanciesMap__box}>
							<span>Санкт-Петербург</span>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_m}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_s}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_xs}`}></div>
						</div>
				</div>
				<div className={`${styles.VacanciesMap__city} ${styles.VacanciesMap__city_msk}`}>
						<div className={styles.VacanciesMap__box}>
							<span>Москва</span>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_xl}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_l}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_m}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_s}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_xs}`}></div>
						</div>
				</div>
				<div className={`${styles.VacanciesMap__city} ${styles.VacanciesMap__city_vzh}`}>
						<div className={styles.VacanciesMap__box}>
							<span>Воронеж</span>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_m}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_s}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_xs}`}></div>
						</div>
				</div>
				<div className={`${styles.VacanciesMap__city} ${styles.VacanciesMap__city_obg}`}>
						<div className={styles.VacanciesMap__box}>
							<span>Оренбург</span>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_m}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_s}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_xs}`}></div>
						</div>
				</div>
				<div className={`${styles.VacanciesMap__city} ${styles.VacanciesMap__city_chbk}`}>
						<div className={styles.VacanciesMap__box}>
							<span>Челябинск</span>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_m}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_s}`}></div>
							<div className={`${styles.VacanciesMap__circle} ${styles.VacanciesMap__circle_xs}`}></div>
						</div>
				</div>
			</div>
		</section>
	);
};

export default VacanciesMap;
