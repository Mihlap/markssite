import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './SkeletonLoader.module.scss';

const SkeletonLoaderSlider = ({ itemCount = 8, isMobile }) => (
  <Swiper
    className={isMobile ? styles.skeleton_slider_container_mobile : styles.skeleton_slider_container_desktop}
    loop={true}
    slidesPerView={isMobile ? 1.1 : 2.2}
    spaceBetween={0}
    effect={'fade'}
    touch="true">
    {Array(itemCount)
      .fill(0)
      .map((_, index) => (
        <SwiperSlide
          key={index}
          className={
            isMobile ? styles.skeleton_container__item_stuff : styles.skeleton_slider_container_desktop__item_stuff
          }>
          <div className={styles.skeleton_container__wrapper_item_stuff}></div>
          <div className={styles.skeleton_container__item_name_stuff}></div>
          <div className={styles.skeleton_container__item_position_stuff}></div>
        </SwiperSlide>
      ))}
  </Swiper>
);

export default SkeletonLoaderSlider;
