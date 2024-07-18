import React, { useRef, useEffect } from 'react';
import styles from './SocialsSwiper.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper';
import ArrowsSwiper from '../ArrowsSwiper/ArrowsSwiper';

import 'swiper/css';
import 'swiper/css/navigation';

import social_1 from '../icons/socials-swiper-1.svg';
import social_2 from '../icons/socials-swiper-2.svg';
import social_3 from '../icons/socials-swiper-3.svg';
import social_4 from '../icons/socials-swiper-4.svg';
import social_5 from '../icons/socials-swiper-3.svg';
import social_6 from '../icons/socials-swiper-2.svg';

const socialsArray = [
  {
    picture: social_1,
    title: 'Telegram',
    subtitle: 'MARKS GROUP',
  },
  {
    picture: social_2,
    title: 'Telegram',
    subtitle: 'MARKS GROUP',
  },
  {
    picture: social_3,
    title: 'Telegram',
    subtitle: 'MARKS GROUP',
  },
  {
    picture: social_4,
    title: 'Telegram',
    subtitle: 'MARKS GROUP',
  },
  {
    picture: social_5,
    title: 'Telegram',
    subtitle: 'MARKS GROUP',
  },
  {
    picture: social_5,
    title: 'Telegram',
    subtitle: 'MARKS GROUP',
  },
  {
    picture: social_6,
    title: 'Telegram',
    subtitle: 'MARKS GROUP',
  },
];

const SocialsSwiper = () => {
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
    <section className={styles.SocialsSwiper}>
      <div className={styles.SocialsSwiper__header}>
        <h2>
          Подписывайся на <span>наши каналы в&nbsp;социальных сетях</span>, там всегда можно найти информации
          о&nbsp;лекциях, конференциях и&nbsp;ключевых объектах
        </h2>
      </div>
      <div className={styles.SocialsSwiper__slider}>
        {/* Переиспользуемый компонент - стрелки для свайпера */}
        <ArrowsSwiper prevRef={prevRef} nextRef={nextRef} />
        {/* Свайпер с социальными сетями  */}
        <Swiper
          className={styles.SocialsSwiper__swiper}
          ref={swiperRef}
          modules={[Navigation, Keyboard]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          speed={1000}
          keyboard={{ enabled: true }}
          slideActiveClass={styles.SocialsSwiper__active}
          breakpoints={{
            2500: {
              slidesPerView: 4,
              centeredSlides: false,
              initialSlide: 0,
              loop: true,
              spaceBetween: 54,
              LoopAdditionalSlides: 5,
            },

            1920: {
              slidesPerView: 3.3,
              centeredSlides: false,
              initialSlide: 0,
              loop: true,
              spaceBetween: 54,
              LoopAdditionalSlides: 5,
            },

            1280: {
              slidesPerView: 3,
              spaceBetween: 30,
              loop: true,
              centeredSlides: true,
              initialSlide: 1,
            },

            1024: {
              slidesPerView: 3.1,
              spaceBetween: 16,
              loop: true,
            },

            768: {
              slidesPerView: 2,
              spaceBetween: 16,
              loop: true,
            },

            576: {
              slidesPerView: 1.5,
              spaceBetween: 16,
              loop: true,
            },

            280: {
              slidesPerView: 1.1,
              loop: true,
              spaceBetween: 0,
            },
          }}>
          {socialsArray.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <div className={styles.SocialsSwiper__inner}>
                  <div className={styles.SocialsSwiper__picture}>
                    <img src={item.picture} alt={item.title} />
                  </div>
                  <div className={styles.SocialsSwiper__bottom}>
                    <div className={styles.SocialsSwiper__text}>
                      <h3>{item.title}</h3>
                      <span>{item.subtitle}</span>
                    </div>
                    <a href="#" className={styles.SocialsSwiper__button}>
                      Подписаться
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default SocialsSwiper;
