import { Swiper, SwiperSlide } from "swiper/react";
import SwipeCore, { Navigation, Pagination, Autoplay } from "swiper";

import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
import Slideritem from "./SliderItem";
import styles from "./SwiperContainer.module.css";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function SwiperContainer({ article }) {
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
        className={styles.swiper_container_articles}
      >
        <div className={styles.swiper_wrapper}>
          {article && article.map((item) => {
            return (
              <SwiperSlide key={item.id}>
                <Slideritem
                  title={item.title}
                  src={`${Host}/images/${item.imageTitle}`}
                  descriptionArticle={item.descriptionArticle}
                  id={item.link}
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
}
