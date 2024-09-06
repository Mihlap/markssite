import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import social_5 from '../icons/socials-swiper-5.svg';
import social_6 from '../icons/socials-swiper-6.svg';
import social_7 from '../icons/socials-swiper-7.svg';
import social_8 from '../icons/socials-swiper-8.svg';

const socialsArray = [
  {
    picture: social_1,
    title: 'Telegram',
    subtitle: 'MARKS GROUP',
    link: 'https://t.me/marks_group',
  },
  {
    picture: social_2,
    title: 'Telegram',
    subtitle: 'Карьера MARKS!',
    link: 'https://t.me/marks_career',
  },
  {
    picture: social_3,
    title: 'Telegram',
    subtitle: 'MARKS DIGITAL',
    link: 'https://t.me/digitalmarks',
  },
  {
    picture: social_4,
    title: 'Telegram',
    subtitle: 'Проект Молодёжь',
    link: 'https://t.me/marks_molodezh',
  },
  {
    picture: social_5,
    title: 'VK',
    subtitle: 'MARKS GROUP',
    link: 'https://vk.com/marks_group_vk',
  },
  {
    picture: social_6,
    title: 'Rutube',
    subtitle: 'MARKS GROUP',
    link: 'https://rutube.ru/channel/38807824',
  },
  {
    picture: social_7,
    title: 'Дзен',
    subtitle: 'MARKS GROUP',
    link: 'https://dzen.ru/marksgroupp',
  },
  {
    picture: social_8,
    title: 'YouTube',
    subtitle: 'MARKS GROUP',
    link: 'https://www.youtube.com/@marks_group',
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

      swiperInstance.slideToLoop(0, 0);
    }
  }, []);

  return (
    <section className={styles.SocialsSwiper}>
      <div className={styles.SocialsSwiper__header}>
        <h2>Хочешь узнать больше о&nbsp;жизни компании? Подписывайся на&nbsp;нас в&nbsp;<span>социальных сетях!</span></h2>
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
          slideActiveClass={styles.SocialsSwiper__active}
          loop={true} 
          loopAdditionalSlides={socialsArray.length}
          keyboard={{ enabled: true }}
          breakpoints={{
            2500: {
              slidesPerView: 4,             
              spaceBetween: 54,
              },

            1920: {
              slidesPerView: 3.3,                         
              spaceBetween: 54,             
            },

            1280: {
              slidesPerView: 3,
              spaceBetween: 30,                          
            },

            1024: {
              slidesPerView: 3.1,
              spaceBetween: 16,             
            },

            768: {
              slidesPerView: 2,
              spaceBetween: 16,             
            },

            576: {
              slidesPerView: 1.5,
              spaceBetween: 16,             
            },

            280: {
              slidesPerView: 1.1,           
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
                    {item.link && (
                    <Link
                      to={item.link}
                      target="_blank"
                      className={styles.SocialsSwiper__button}
                    >
                      Подписаться
                    </Link>
                  )}
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
