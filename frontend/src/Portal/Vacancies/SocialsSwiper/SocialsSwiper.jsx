import React, { useRef, useEffect } from 'react';
import styles from "./SocialsSwiper.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper";
import ArrowsSwiper from '../ArrowsSwiper/ArrowsSwiper';

import "swiper/css";
import "swiper/css/navigation";

import social_1 from "../icons/socials-swiper-1.jpg";
import social_2 from "../icons/socials-swiper-2.jpg";
import social_3 from "../icons/socials-swiper-3.jpg";
import social_4 from "../icons/socials-swiper-1.jpg";
import social_5 from "../icons/socials-swiper-2.jpg";
import social_6 from "../icons/socials-swiper-3.jpg";

const socialsArray = [
	{
		picture: social_1,
		title: "Telegram",
		subtitle: "MARKS GROUP",
	},
	{
		picture: social_2,
		title: "Telegram",
		subtitle: "MARKS GROUP",
	},
	{
		picture: social_3,
		title: "Telegram",
		subtitle: "MARKS GROUP",
	},
	{
		picture: social_4,
		title: "Telegram",
		subtitle: "MARKS GROUP",
	},
	{
		picture: social_5,
		title: "Telegram",
		subtitle: "MARKS GROUP",
	},
	{
		picture: social_5,
		title: "Telegram",
		subtitle: "MARKS GROUP",
	},
	{
		picture: social_6,
		title: "Telegram",
		subtitle: "MARKS GROUP",
	},
]

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
      <ArrowsSwiper prevRef={prevRef} nextRef={nextRef} />
      <Swiper 
        className={styles.SocialsSwiper__swiper}
        ref={swiperRef}
        modules={[Navigation, Keyboard]}
        slidesPerView={3}
        loop={true}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        centeredSlides={true}
        speed={1000}
        keyboard={{ enabled: true }}
        LoopAdditionalSlides={5}
        initialSlide={1}
        slideActiveClass={styles.SocialsSwiper__active}
      >
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
                  <a href="#" className={styles.SocialsSwiper__button}>Подписаться</a>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default SocialsSwiper;
