import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SliderItemProject from "./SliderItemProject";
import "./SwiperContainerProgect.css";

const Host = process.env.REACT_APP_SERVER_HOST;

const SwiperContainerProgect = ({ project }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);

  SwipeCore.use([Navigation, Pagination, Autoplay]);

  const colors = {
    Архитектура: "#FF7F6A",
    BIM: "#75BBFD",
    Конструкции: "#566272",
    Дизайн: "#FAA8BD",
    Инженерия: "#90B734",
  };

  const handlePageClick = (index) => {
    setCurrentIndex(index);
    if (swiperRef.current && swiperRef.current.slideTo) {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div className="swiper_container">
      <Swiper
        slidesPerView={1.1}
        spaceBetween={20}
        effect={"fade"}
        loop={true}
        speed={300}
        className="swiper_container_project"
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        onSwiper={(swiper) => {
          if (swiperRef.current === null) {
            swiperRef.current = swiper;
          }
        }}
      >
        <div className="swiper_wrapper">
          {project &&
            project.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <SliderItemProject
                    title={item.title}
                    src={`${Host}/images/${
                      item.imageProject ? item.imageProject : item.imageTitle
                    }`}
                    text={item.text}
                    id={item.link}
                    selectCompetencies={(() => {
                      try {
                        const selectCompetencies = JSON.parse(
                          item.selectCompetencies
                        );
                        return selectCompetencies.map((competency) => (
                          <div
                            key={competency.value}
                            className="div_el_selectCompetencies"
                            style={{
                              color: colors[competency.value],
                              borderColor: colors[competency.value],
                              border: "1px solid",
                              padding: "3px 6px",
                              borderRadius: "34px",
                            }}
                          >
                            {competency.label}
                          </div>
                        ));
                      } catch (error) {
                        if (
                          typeof item.selectCompetencies === "string" &&
                          item.selectCompetencies.includes(",")
                        ) {
                          return item.selectCompetencies
                            .split(",")
                            .map((value) => {
                              const label = value.trim();
                              return (
                                <div
                                  key={value}
                                  className="div_el_selectCompetencies"
                                  style={{
                                    color: colors[value],
                                    borderColor: colors[value],
                                    border: "1px solid",
                                    padding: "3px 6px",
                                    borderRadius: "34px",
                                  }}
                                >
                                  {label}
                                </div>
                              );
                            });
                        }
                        return null;
                      }
                    })()}
                    countryCity={item.countryCity}
                    monthYear={item.monthYear}
                  />
                </SwiperSlide>
              );
            })}
        </div>
      </Swiper>
      <div className="swiper_pagination">
        {project &&
          project.map((_, index) => (
            <button
              key={index}
              className={`swiper_pagination_bullet ${
                currentIndex === index ? "active" : ""
              }`}
              onClick={() => handlePageClick(index)}
            />
          ))}
      </div>
    </div>
  );
};

export default SwiperContainerProgect;
