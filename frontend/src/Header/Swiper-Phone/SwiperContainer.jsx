import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from '../../store/Slice/articlesSlice'
import { Swiper, SwiperSlide } from "swiper/react";
import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";
// import { useState, useRef, useEffect } from "react";
import oneImg from "./svgImg/one.jpg";
import twoImg from "./svgImg/two.jpg";
// import threeImg from "./svgImg/three.png";
import iconPlus from "./svgImg/icon.svg";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Slideritem from "./SliderItem";
import "./SwiperContainer.css";

const point = "⦁";
const items = [
  {
    id: "winepark-article",
    title: "Центр энотуризма WinePark",
    text: `Конкурс ${point} 100 лучших объектов росии`,
    src: `${twoImg}`,
    icon: `${iconPlus}`,
  },
  {
    id: "badaevsky",
    title: "Marks Group – генеральный проектировщик ЖК «Бадаевский»",
    text: `Статья ${point} Экспертное обсуждение реставрации...`,
    src: `${oneImg}`,
    icon: `${iconPlus}`,
  },
];

export default function SwiperContainer() {
  SwipeCore.use([Navigation, Pagination, Autoplay]);
  const dispatch = useDispatch();
  const artickes = useSelector((state) => state.articles);
  const loading = useSelector((state) => state.articles.loading);
  const error = useSelector((state) => state.articles.error);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(artickes.articles);

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
          {items.map((item, idx) => {
            return (
              <SwiperSlide key={idx}>
                <Slideritem
                  title={item.title}
                  src={item.src}
                  text={item.text}
                  icon={item.icon}
                  id={item.id}
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
