import { Swiper, SwiperSlide } from "swiper/react";
import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";
// import { useState, useRef, useEffect } from "react";
import oneImg from "./svgImg/one.png"
import twoImg from "./svgImg/two.png";
import threeImg from "./svgImg/three.png";
import iconPlus from "./svgImg/icon.svg";



import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Slideritem from "./SliderItem";
import "./SwiperContainer.css";

const point = "●";
const items = [
  {
    title: "Смотр-конкурс Стекло в архитектуре 2022",
    text: `Номинация ${point} Объект нового строительства`,
    src: `${threeImg}`,
    icon: `${iconPlus}`,
  },
  {
    title: "Центр энотуризма WinePark",
    text: `Конкурс ${point} 100 лучших объектов росии`,
    src: `${twoImg}`,
    icon: `${iconPlus}`,
  },
  {
    title: "Баня, рынок, супер-слэб — что ждет Бадаевский?",
    text: `Статья ${point} Экспертное обсуждение реставрации...`,
    src: `${oneImg}`,
    icon: `${iconPlus}`,
  },
];

const SwiperContainer = () => {
  SwipeCore.use([Navigation, Pagination, Autoplay]);

  return (
    <>
      <Swiper
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        slidesPerView={1}
        spaceBetween={20}
        effect={"fade"}
        loop={true}
        speed={300}
        // autoplay={{
        //   delay: 7000,
        //   disableOnInteraction: false,
        // }}
        className="swiper-container"
      >
        <div className="swiper-wrapper">
          {items.map((item, idx) => {
            return (
              <SwiperSlide key={idx}>
                <Slideritem
                  title={item.title}
                  src={item.src}
                  text={item.text}
                  icon={item.icon}
                />
              </SwiperSlide>
            );
          })}
          <div className="slider-buttons"></div>
        </div>
      </Swiper>
    </>
  );
};

export default SwiperContainer;
