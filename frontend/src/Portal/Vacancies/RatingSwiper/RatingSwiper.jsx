import React, { useState, useRef, useEffect, useMemo, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSlides, updateSlidesOrderLocally } from '../../../store/Slice/vacancyMainSlideCardSlice';
import styles from './RatingSwiper.module.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import ArrowsSwiper from '../ArrowsSwiper/ArrowsSwiper';
import 'swiper/css';
import 'swiper/css/navigation';

const Host = process.env.REACT_APP_SERVER_HOST;

const RatingSwiperRow = ({ picture, date, title }) => {
  return (
    <div className={styles.RatingSwiper__row}>
      <span className={styles.RatingSwiper__date}>{date}</span>
      <h3 className={styles.RatingSwiper__title}>{title}</h3>
      {picture ? (
        <div className={styles.RatingSwiper__picture}>
          <img src={picture} alt="" />
        </div>
      ) : null}
    </div>
  );
};

const RatingSwiper = memo(() => {
  const dispatch = useDispatch();
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const slides = useSelector((state) => state.formAddSlide.slides);
  const visibleSlides = useMemo(() => {
    return slides.filter((slide) => !slide.hidden);
  }, [slides]);
  const [, setWindowWidth] = useState(window.innerWidth);
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1280);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchSlides()).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiperInstance = swiperRef.current.swiper;
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [prevRef, nextRef, visibleSlides]);

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

  const slidesToShow = isTablet && !showAll ? visibleSlides.slice(0, 1) : visibleSlides;

  return (
    <section className={styles.RatingSwiper}>
      <div className={styles.RatingSwiper__header}>
        <h2>
          <span>Ведущая компания </span>
          <span>в&nbsp;сфере проектирования</span>
        </h2>
      </div>
      <div className={styles.RatingSwiper__body}>
        {!isTablet ? (
          <>
            <ArrowsSwiper prevRef={prevRef} nextRef={nextRef} />
            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={'auto'}
              loop={false}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              wrapperClass={styles.RatingSwiper__wrapper}
              breakpoints={{
                2500: {
                  slidesPerView: 1.5,
                  spaceBetween: 54,
                },
                1920: {
                  slidesPerView: 1,
                  spaceBetween: 54,
                },
                1440: {
                  slidesPerView: 1,
                  spaceBetween: 30,
                },
              }}
            >
              {slidesToShow?.map((slide) => (
                <SwiperSlide key={slide.id} className={styles.RatingSwiper__slide}>
                  <RatingSwiperRow
                    picture={`${Host}/images/slideCard/${slide.photoAva}`}
                    date={new Date(slide.cardData.card1.date).toLocaleDateString()}
                    title={slide.cardData.card1.description}
                  />
                  <div className={styles.RatingSwiper__rows}>
                    <RatingSwiperRow
                      date={new Date(slide.cardData.card2.date).toLocaleDateString()}
                      title={slide.cardData.card2.description}
                    />
                    <RatingSwiperRow
                      date={new Date(slide.cardData.card3.date).toLocaleDateString()}
                      title={slide.cardData.card3.description}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <>
            <div className={styles.RatingSwiper__adaptive}>
              {slidesToShow?.map((slide) => (
                <div key={slide.id} className={styles.RatingSwiper__slide}>
                  <RatingSwiperRow
                    picture={`${Host}/images/slideCard/${slide.photoAva}`}
                    date={new Date(slide.cardData.card1.date).toLocaleDateString()}
                    title={slide.cardData.card1.description}
                  />
                  <div className={styles.RatingSwiper__rows}>
                    <RatingSwiperRow
                      date={new Date(slide.cardData.card2.date).toLocaleDateString()}
                      title={slide.cardData.card2.description}
                    />
                    <RatingSwiperRow
                      date={new Date(slide.cardData.card3.date).toLocaleDateString()}
                      title={slide.cardData.card3.description}
                    />
                  </div>
                </div>
              ))}
            </div>
            {visibleSlides.length > 1 && (
              <button
                className={`${styles.RatingSwiper__button} ${showAll ? styles.visible : ''}`}
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Скрыть все' : 'Смотреть все'}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
});

export default RatingSwiper;
