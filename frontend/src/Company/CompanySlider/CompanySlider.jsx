import React from 'react';
import styles from './CompanySlider.module.scss';
import 'swiper/swiper-bundle.min.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Keyboard } from 'swiper';

import company_1 from './company-swiper-1.svg';
import company_2 from './company-swiper-2.svg';
import company_3 from './company-swiper-3.svg';
import company_4 from './company-swiper-4.svg';

const companyArray = [
  {
    picture: company_1,
    title: 'MARKSGROUP ENGINEERING',
    text: 'Design and architecture company. General design, scientific research, comprehensive analysis of object and territories for cities and metapolicies infrastructure development.',
  },
  {
    picture: company_2,
    title: 'INPI',
    text: 'The Institute for Science, Design and Engineering. Design of projects of industrial and civil construction.',
  },
  {
    picture: company_3,
    title: 'MARKSGROUP DIGITAL',
    text: 'Digital solutions in design, development and constructions.',
  },
  {
    picture: company_4,
    title: 'ПОДЗЕМПРОЕКТ',
    text: 'Scientific and technological supervision of design and construction. Design, scientific research, comprehensive calculations of constructional structures, bases, foundations and underground facilities.',
  },
];

const CompanySlider = () => {
  return (
    <>
      <section className={styles.CompanySlider}>
        <h2 className={styles.CompanySlider__title}>Состав группы компаний</h2>
        <Swiper
          className={styles.CompanySlider__swiper}
          modules={[Pagination, Keyboard]}
          pagination={{
            clickable: true,
            el: `.${styles.CompanySlider__pagination}`,
            bulletClass: styles.CompanySlider__bullet,
            bulletActiveClass: styles.CompanySlider__bulletActive,
          }}
          keyboard={{ enabled: true }}
          slideActiveClass={styles.CompanySlider__active}
          spaceBetween={30}
          slidesPerGroup={1}
          breakpoints={{
            1280: {
              slidesPerView: 4,
              spaceBetween: 0,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 60,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 30,
            },
            280: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
          }}>
          {companyArray.map((item, index) => (
            <SwiperSlide className={styles.CompanySlider__slide} key={index}>
              <div className={styles.CompanySlider__picture}>
                <img src={item.picture} alt={item.title} />
              </div>
              <div className={styles.CompanySlider__text}>{item.text}</div>
            </SwiperSlide>
          ))}

          <div className={styles.CompanySlider__pagination}></div>
        </Swiper>
      </section>
    </>
  );
};

export default CompanySlider;
