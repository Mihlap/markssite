import { Swiper, SwiperSlide } from "swiper/react";
import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SliderItemProject from "./SliderItemProject";
import styles from "./SwiperContainerProgect.module.css";

const Host = process.env.REACT_APP_SERVER_HOST;


const SwiperContainerProgect = ({ project }) => {
  SwipeCore.use([Navigation, Pagination, Autoplay]);

  const colors = {
    Архитектура: "#FF7F6A",
    BIM: "#75BBFD",
    Конструкции: "#566272",
    Дизайн: "#FAA8BD",
    Инженерия: "#90B734",
  };

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
        className={styles.swiper_container_progect}>
        <div className={styles.swiper_wrapper}>
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
                    selectCompetencies={
                      <div className={styles.container__selectCompetencies}>
                      {(() => {
                      try {
                        const selectCompetencies = JSON.parse(
                          item.selectCompetencies
                        );
                        return selectCompetencies.map((competency) => (
                          <div
                            key={competency.value}
                            className={styles.div_el_selectCompetencies}
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
                                  className={styles.div_el_selectCompetencies}
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
                    </div>
                      }
                //      { <div className={styles.countryCity_monthYear}>
                //   <div className={styles.container__countryCity}>
                //     {item.countryCity}
                //   </div>
                //   <div className={styles.container__monthYear}>
                //     {item.monthYear}
                //   </div>
                // </div> }
                  />
                </SwiperSlide>
              );
            })}
          <div className={styles.swiperPagination}>
            <div className={styles.swiperPaginationBullet}></div>
            <div className={styles.swiperPaginationBulletActive}></div>
          </div>
        </div>
      </Swiper>
    </>
  );
};

export default SwiperContainerProgect;
