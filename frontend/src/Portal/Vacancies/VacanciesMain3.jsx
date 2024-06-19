import React, { useRef, useEffect } from 'react';
import styles from "./VacanciesMain3.module.scss";
import Intro from "./Intro/Intro";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import BenefitsGrid from './BenefitsGrid/BenefitsGrid';

import "swiper/css";
import "swiper/css/navigation";

import img1 from "./icons/vacancies-slider.jpg";
import img1x2 from "./icons/vacancies-slider-2x.jpg";

const VacanciesMain3 = () => {
	const prevRef = useRef(null);
	const nextRef = useRef(null);
	const swiperRef = useRef(null);

	useEffect(() => {
		if (swiperRef.current && swiperRef.current.swiper) {
			const swiperInstance = swiperRef.current.swiper;
			swiperInstance.params.navigation.prevEl = prevRef.current;
			swiperInstance.params.navigation.nextEl = nextRef.current;
			swiperInstance.navigation.init();
			swiperInstance.navigation.update();
		}
	}, []);

	return (
		<>
			<Intro />
			<BenefitsGrid />

			
			<section className={styles.rating}>
				<div className={styles.rating__header}>
					<div>
						<span>Передовая компания</span><span>в сфере проектирования</span>
					</div>
				</div>
				<div className={styles.rating__navigation}>
					<button ref={prevRef}></button>
					<button ref={nextRef}></button>
				</div>
				<Swiper
					ref={swiperRef}
					modules={[Navigation]}
					spaceBetween={30}
					slidesPerView={1}
					loop={true}
					navigation={{
							prevEl: prevRef.current,
							nextEl: nextRef.current,
					}}
				>
					<SwiperSlide>
						<div className={styles.rating__slide}>
							<div className={styles.rating__full}>
								<span className={styles.rating__date}>Октябрь 31, 2022</span>
								<h3 className={styles.rating__title}>Победитель 100 лучших объектов России в номинации  «Лучшие конструктивные решения»</h3>
								<div className={styles.rating__picture}>
										<img src={img1} srcSet={img1x2} alt="Винодельня" />
								</div>
							</div>
							<div className={styles.rating__rows}>
								<div className={styles.rating__row}>
										<span className={styles.rating__date}>Октябрь 31, 2022</span>
										<h3 className={styles.rating__title}>Победитель рейтинга «Репутация компании» среди столичных проектных и архитектурных бюро</h3>
								</div>
								<div className={styles.rating__row}>
										<span className={styles.rating__date}>Октябрь 31, 2022</span>
										<h3 className={styles.rating__title}>Премия Москомархитектуры в номинации «Лучшее АГР объекта транспортной инфраструктуры»</h3>
								</div>
							</div>
						</div>
					</SwiperSlide>
					<SwiperSlide>
						<div className={styles.rating__slide}>
							<div className={styles.rating__rows}>
								<div className={styles.rating__row}>
									<span className={styles.rating__date}>Октябрь 31, 2022</span>
									<h3 className={styles.rating__title}>Победитель рейтинга «Репутация компании» среди столичных проектных и архитектурных бюро</h3>
								</div>
								<div className={styles.rating__row}>
									<span className={styles.rating__date}>Октябрь 31, 2022</span>
									<h3 className={styles.rating__title}>Премия Москомархитектуры в номинации «Лучшее АГР объекта транспортной инфраструктуры»</h3>
								</div>
							</div>
							<div className={styles.rating__full}>
								<span className={styles.rating__date}>Октябрь 31, 2022</span>
								<h3 className={styles.rating__title}>Победитель 100 лучших объектов России в номинации  «Лучшие конструктивные решения»</h3>
								<div className={styles.rating__picture}>
									<img src={img1} srcSet={img1x2} alt="Винодельня"/>
								</div>
							</div>
						</div>
					</SwiperSlide>
				</Swiper>
			</section>
		</>
	);
};

export default VacanciesMain3;
