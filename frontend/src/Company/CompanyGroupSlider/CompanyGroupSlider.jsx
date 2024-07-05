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
    <div className="company_group_container">
      <Swiper
      className="wrapper_group_container"
        ref={swiperRef}
        spaceBetween={0}
        slidesPerView={'auto'}
        centeredSlides={false}
        loop={true}
        effect={"fade"}
        onSlideChange={(swiper) => setCurrentPage(swiper.realIndex)}
        >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index} className="company_group_slide">
            <div className="wrapper_sliderContainer_blockSlide">
            <img className="image_group_container" src={slide.imgSrc} alt={slide.altText} />
            <span className="text_slider_span">{slide.description}</span>
            </div>
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
