import { Swiper, SwiperSlide } from "swiper/react";
import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Slideritem from "./SliderItem";
import "./SwiperContainer.css";

export default function SwiperContainer({ artickes }) {
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
        className="swiper-container_articles"
      >
        <div className="swiper-wrapper">
          {artickes.map((item) => {
            return (
              <SwiperSlide key={item.id}>
                <Slideritem
                  title={item.attributes.title}
                  src={item.attributes.img}
                  text={item.attributes.text}
                  icon={item.attributes.icon}
                  id={item.attributes.link}
                />
              </SwiperSlide>
            );
          })}
          <div className="slider-buttons"></div>
        </div>
      </Swiper>
    </>
  );
}
