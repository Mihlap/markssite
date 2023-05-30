import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import './Company_Slider.css';

SwiperCore.use([Pagination]);

const Company_Slider = () => {
  return (
    <Swiper
      spaceBetween={30}
      pagination={{
        clickable: true,
        el: '.swiper-pagination',
    }}
      className="company-slider"
    >
      <div className="company-slider-container">
        <SwiperSlide className="company-slider-slide">
          <img src={`./assets/company_slider.png`} alt="" />
        </SwiperSlide>
        <SwiperSlide className="company-slider-slide">
          <img src={`./assets/company_slider.png`} alt="" />
        </SwiperSlide>
        <SwiperSlide className="company-slider-slide">
          <img src={`./assets/company_slider.png`} alt="" />
        </SwiperSlide>
        <SwiperSlide className="company-slider-slide">
          <img src={`./assets/company_slider.png`} alt="" />
        </SwiperSlide>
      </div>
      <div className="swiper-pagination"></div>
    </Swiper>
  );
};

export default Company_Slider;
