import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import "./CompanyGroupSlider.css";

import slidesData from './utils.js';

const CompanyGroupSlider = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const swiperRef = useRef(null);

  const handlePageClick = (index) => {
    setCurrentPage(index);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideToLoop(index);
    }
  };

  return (
    <div className="company-group-container">
      <Swiper
        ref={swiperRef}
        spaceBetween={50}
        slidesPerView={'auto'}
        loop={true}
        onSlideChange={(swiper) => setCurrentPage(swiper.realIndex)}
        breakpoints={{
          2501: { spaceBetween: 200 },
          1601: { spaceBetween: 100 },
          1025: { spaceBetween: 90 },
          768: { spaceBetween: 80 },
          0: { spaceBetween: 50 },
        }}
      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <img src={slide.imgSrc} alt={slide.altText} />
            <span className="text_slider_span">{slide.description}</span>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="pagination_company_slider">
        {slidesData.map((_, index) => (
          <button
            key={index}
            className={`pagination_company_slider-dot ${currentPage === index ? "active" : ""}`}
            onClick={() => handlePageClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyGroupSlider;
