import React, { useState, useRef, useEffect } from 'react';
import styles from "./RatingSwiper.module.scss";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

import ArrowsSwiper from '../ArrowsSwiper/ArrowsSwiper';

import "swiper/css";
import "swiper/css/navigation";

import img1 from "../icons/vacancies-slider.jpg";

const RatingSwiperRow = ({ picture }) => {
	return (
    <div className={styles.RatingSwiper__row}>
      <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
      <h3 className={styles.RatingSwiper__title}>Победитель 100 лучших объектов России в&nbsp;номинации &laquo;Лучшие конструктивные решения&raquo;</h3>
      {console.log(picture)}
       {picture ? <div className={styles.RatingSwiper__picture}><img src={picture}/></div> : null}
    </div>
	);
};

const RatingSwiper = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [, setWindowWidth] = useState(window.innerWidth);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1280);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiperInstance = swiperRef.current.swiper;
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsTablet(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [showAll, setShowAll] = useState(false);

  return (
    <section className={styles.RatingSwiper}>
      <div className={styles.RatingSwiper__header}>
					<h2>
						<span>Ведущая компания </span><span>в&nbsp;сфере проектирования</span>
					</h2>
      </div>
      <div className={styles.RatingSwiper__body}>
        {/* Отрисовка слайдера в зависимости от размера экрана */}
        {!isTablet ?
          <>
            {/* Компонент стрелочки с присваиванием ссылок */}
            <ArrowsSwiper prevRef={prevRef} nextRef={nextRef} />
            {/* <div className={styles.RatingSwiper__swiper}></div> */}
            <Swiper 
              ref={swiperRef}
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={'auto'}
              loop={true}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              wrapperClass={styles.RatingSwiper__wrapper}
              breakpoints={{
                // Для экранов от 1920 пикселей и выше
                2500: {
                  slidesPerView: 1.5,
                  spaceBetween: 54,
                },
                1920: {
                  slidesPerView: 1,
                  spaceBetween: 54,
                },
                // Для экранов от 1440 пикселей и выше, но меньше 1920 пикселей
                1440: {
                  slidesPerView: 1, 
                  spaceBetween: 30,
                },
              }}
            >
              <SwiperSlide className={styles.RatingSwiper__slide}>
                <RatingSwiperRow picture={img1}/>
                <div className={styles.RatingSwiper__rows}>
                  <RatingSwiperRow/>
                  <RatingSwiperRow/>
                </div>
              </SwiperSlide>
              <SwiperSlide className={styles.RatingSwiper__slide}>
                <RatingSwiperRow picture={img1}/>
                <div className={styles.RatingSwiper__rows}>
                  <RatingSwiperRow/>
                  <RatingSwiperRow/>
                </div>
              </SwiperSlide>
            </Swiper>
          </> : (
            <>
              <div className={styles.RatingSwiper__adaptive}>
                <div className={styles.RatingSwiper__slide}>
                  <RatingSwiperRow picture={img1}/>
                  <div className={styles.RatingSwiper__rows}>
                    <RatingSwiperRow/>
                    <RatingSwiperRow/>
                  </div>
                </div>
                <div className={`${styles.RatingSwiper__slide} ${styles.hide} ${showAll ? styles.visible : ''}`}>
                  <div className={styles.RatingSwiper__rows}>
                    <RatingSwiperRow/>
                    <RatingSwiperRow/>
                  </div>
                  <RatingSwiperRow picture={img1}/>
                </div>
              </div>
              <button
                className={`${styles.RatingSwiper__button} ${showAll ? styles.visible : ''}`}
                onClick={() => setShowAll(!showAll)}>
                {showAll ? "Скрыть все" : "Смотреть все"}
              </button>
            </>
          )}
      </div>

    </section>
  );
};

export default RatingSwiper;
