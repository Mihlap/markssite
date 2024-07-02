import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import styles from "./VacanciesMainCard.module.scss";

import slider1 from "./icons/slider1.png";
import slider2 from "./icons/slider2.png";
import slider3 from "./icons/slider3.png";

const imageArray = [
  slider1,
  slider2,
  slider3,
  slider2,
  slider1,
  slider2,
  slider3,
  slider2,
  slider1,
  slider2,
];

const VacancySlider = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.sliderContainer}>
      <Swiper
        className={styles.sliderContainer_block}
        loop={false}
        slidesPerView="auto"
        spaceBetween={windowWidth <= 767 ? 20 : 30}
        centeredSlides={false}
        touch="true" 
        direction="horizontal"
        breakpoints={{
          2500: { slidesPerView: 4.7 },
          2000: { slidesPerView: 4.2 },
          1750: { slidesPerView: 3.5 },
          1440: { slidesPerView: 2.7 },
          1300: { slidesPerView: 2.7 },
          1200: { slidesPerView: 2.5 },
          1024: { slidesPerView: 2.3 },
          900: { slidesPerView: 2.1 },
        }}
      >
        {imageArray.map((imageSrc, index) => (
          <SwiperSlide
            key={index}
            className={`${styles.sliderContainer_blockSlide}
            ${index % 2 === 0 ? styles.verticalSlide : styles.horizontalSlide}`}
          >
            <div>
              <div className={styles.wrapper_sliderContainer_blockSlide}>
                <img
                  className={styles.container_image_blockSlide}
                  src={imageSrc}
                  alt={`Слайд ${index + 1}`}
                  loading="lazy"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VacancySlider;
