import { Swiper, SwiperSlide } from "swiper/react";
import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";
// import { useState, useRef, useEffect } from "react";
import oneImg from "../img/project_left.png";
import twoImg from "../img/project_right1.png";
import threeImg from "../img/project_right2.png";
import four from "../img/project_right3.png"
import iconPlus from "../img/icon.svg";



import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SliderItemProject from "./SliderItemProject";
import "./SwiperContainerProgect.css";

const point = "●";
const items = [
  {
    title: "МФК Комплекс апартаментов «Slava»",
    text: `Россия, Москва, 1-я ул. Ямского Поля ${point} 2020`,
    src: `${threeImg}`,
    icon: `${iconPlus}`,
  },
  {
    title: "Гостиничный комплекс с апартаментами",
    text: `г. Москва, наб. Космодамианская ${point} 2021`,
    src: `${twoImg}`,
    icon: `${iconPlus}`,
  },
  {
    title: "МЖК Бадаевкий",
    text: `г. Москва, Кутузовский проспект ${point} 2020`,
    src: `${four}`,
    icon: `${iconPlus}`,
  },
  {
    title: "Жилой квартал PRIME PARK",
    text: `г. Москва, Ленинградский проспект ${point} 2021`,
    src: `${oneImg}`,
    icon: `${iconPlus}`,
  },
];

const SwiperContainerProgect = () => {
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
                <SliderItemProject
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

export default SwiperContainerProgect;