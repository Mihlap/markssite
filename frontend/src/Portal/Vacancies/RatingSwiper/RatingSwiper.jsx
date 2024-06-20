import React, { useRef, useEffect } from 'react';
import styles from "./RatingSwiper.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ArrowsSwiper from '../ArrowsSwiper/ArrowsSwiper';

import "swiper/css";
import "swiper/css/navigation";

import img1 from "../icons/vacancies-slider.jpg";
import img1x2 from "../icons/vacancies-slider-2x.jpg";


const RatingSwiper = () => {
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
		<section className={styles.RatingSwiper}>
      <ArrowsSwiper prevRef={prevRef} nextRef={nextRef}/>
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
        wrapperClass={styles.RatingSwiper__wrapper}
      >
        <SwiperSlide>
          <div className={styles.RatingSwiper__slide}>
            <div className={styles.RatingSwiper__full}>
              <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
              <h3 className={styles.RatingSwiper__title}>Победитель 100 лучших объектов России в номинации  «Лучшие конструктивные решения»</h3>
              <div className={styles.RatingSwiper__picture}>
                  <img src={img1} srcSet={img1x2} alt="Винодельня" />
              </div>
            </div>
            <div className={styles.RatingSwiper__rows}>
              <div className={styles.RatingSwiper__row}>
                  <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                  <h3 className={styles.RatingSwiper__title}>Победитель рейтинга «Репутация компании» среди столичных проектных и архитектурных бюро</h3>
              </div>
              <div className={styles.RatingSwiper__row}>
                  <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                  <h3 className={styles.RatingSwiper__title}>Премия Москомархитектуры в номинации «Лучшее АГР объекта транспортной инфраструктуры»</h3>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={styles.RatingSwiper__slide}>
            <div className={styles.RatingSwiper__rows}>
              <div className={styles.RatingSwiper__row}>
                <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                <h3 className={styles.RatingSwiper__title}>Победитель рейтинга «Репутация компании» среди столичных проектных и архитектурных бюро</h3>
              </div>
              <div className={styles.RatingSwiper__row}>
                <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                <h3 className={styles.RatingSwiper__title}>Премия Москомархитектуры в номинации «Лучшее АГР объекта транспортной инфраструктуры»</h3>
              </div>
            </div>
            <div className={styles.RatingSwiper__full}>
              <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
              <h3 className={styles.RatingSwiper__title}>Победитель 100 лучших объектов России в номинации  «Лучшие конструктивные решения»</h3>
              <div className={styles.RatingSwiper__picture}>
                <img src={img1} srcSet={img1x2} alt="Винодельня"/>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
  </section>
	);
};

export default RatingSwiper;
