import { Swiper, SwiperSlide } from "swiper/react";
import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SliderItemProject from "./SliderItemProject";
import styles from "./SwiperContainerProgect.module.css";


const SwiperContainerProgect = ({ project }) => {
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
        className={styles.swiper_container_progect}
      >
        <div className={styles.swiper_wrapper}>
          {project &&
            project.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <SliderItemProject
                    title={item.attributes.title}
                    src={item.attributes.img}
                    text={item.attributes.text}а 
                    id={item.attributes.link}
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
