import React, { useState, useRef, useEffect } from 'react';
import styles from "./RatingSwiper.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ArrowsSwiper from '../ArrowsSwiper/ArrowsSwiper';

import "swiper/css";
import "swiper/css/navigation";

import img1 from "../icons/vacancies-slider.jpg";
import img1x2 from "../icons/vacancies-slider-2x.jpg";


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
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024);

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
						<span>Передовая компания </span><span>в&nbsp;сфере проектирования</span>
					</h2>
      </div>
      <div className={styles.RatingSwiper__body}>
        {/* Отрисовка слайдера в зависимости от размера экрана */}
        {!isTablet ?
          <>
            {/* Компонент стрелочки с присваиванием ссылок */}
            <ArrowsSwiper prevRef={prevRef} nextRef={nextRef} />
            <div className={styles.RatingSwiper__swiper}></div>
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
              breakpoints={{
                2559: {
                  slidesPerView: 1.5,
                  spaceBetween: 54,
                },
                1439: {
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
                  <div className={styles.RatingSwiper__full}>
                    <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                    <h3 className={styles.RatingSwiper__title}>Победитель 100 лучших объектов России в&nbsp;номинации &laquo;Лучшие конструктивные решения&raquo;</h3>
                    <div className={styles.RatingSwiper__picture}>
                      <img src={img1} alt="Винодельня" />
                    </div>
                  </div>
                  <div className={styles.RatingSwiper__rows}>
                    <div className={styles.RatingSwiper__row}>
                      <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                      <h3 className={styles.RatingSwiper__title}>Победитель рейтинга &laquo;Репутация компании&raquo; среди столичных проектных и&nbsp;архитектурных бюро</h3>
                    </div>
                    <div className={styles.RatingSwiper__row}>
                      <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                      <h3 className={styles.RatingSwiper__title}>Премия Москомархитектуры в&nbsp;номинации &laquo;Лучшее АГР объекта транспортной инфраструктуры&raquo;</h3>
                    </div>
                  </div>
                </div>
                <div className={`${styles.RatingSwiper__slide} ${styles.RatingSwiper__slide_hide} ${showAll ? styles.visible : ''}`}>
                  <div className={styles.RatingSwiper__rows}>
                    <div className={styles.RatingSwiper__row}>
                      <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                      <h3 className={styles.RatingSwiper__title}>Победитель рейтинга &laquo;Репутация компании&raquo; среди столичных проектных и&nbsp;архитектурных бюро</h3>
                    </div>
                    <div className={styles.RatingSwiper__row}>
                      <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                      <h3 className={styles.RatingSwiper__title}>Премия Москомархитектуры в&nbsp;номинации &laquo;Лучшее АГР объекта транспортной инфраструктуры&raquo;</h3>
                    </div>
                  </div>
                  <div className={styles.RatingSwiper__full}>
                    <span className={styles.RatingSwiper__date}>Октябрь 31, 2022</span>
                    <h3 className={styles.RatingSwiper__title}>Победитель 100 лучших объектов России в&nbsp;номинации &laquo;Лучшие конструктивные решения&raquo;</h3>
                    <div className={styles.RatingSwiper__picture}>
                      <img src={img1} alt="Винодельня" />
                    </div>
                  </div>
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
