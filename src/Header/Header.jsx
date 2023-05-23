import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import BlockHeader from "../UI/BlockHeader/BlockHeader";
import SwiperContainer from "./Swiper-Phone/SwiperContainer";
import SwiperContainerProgect from "./Swiper-project/SwiperContainerProgect";
import SliderHeader from "../UI/SliderHeader/SliderHeader";
import VideoPlayer from "../UI/Videoplayer/VideoPlayer";
// import Mapbox3D from "../UI/Map3D/Mapbox3D";
import styles from "./Header.module.css";
import SliderMobile from "../UI/SliderHeader/SliderMobile";


gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
export default function Header() {
 
  useEffect(() => {
    window.scrollTo(20, 0);
  }, []);
  return (
    <main className={styles.header}>
      <div className={styles.video_block}>
        <VideoPlayer />
        {/* <img className={styles.image} src="./fon.jpg" alt="изображение" /> */}
        {/* фото для мобильной версии  */}
        {/* <img className={styles.image_phone} src={photo} alt="photo" /> */}
      </div>
      <div id="publications" className={styles.header_desctop_block}>
        <h1 className={styles.desctop_title}>Награды и публикации</h1>
        <div className={styles.desctop_test}>
          Наша компания участвует в многочисленных выставках, конференциях
          <br /> и конкурсах. Предлагаем ознакомиться с некоторыми докладами
        </div>
       
      </div>
      <div id="publications1" className={styles.header_block}>
        <h1 className={styles.heading}>Награды проектов</h1>
        <p className={styles.heading_text}>
          Наша компания участвует в<br /> многочисленных выставках, конференциях
          <br /> и конкурсах. Предлагаем ознакомиться с<br /> некоторыми
          докладами.
        </p>
      </div>
      <div className={styles.container_main}>
        {/* <button onClick={isHiddenHandler}>click</button> */}
        <SliderHeader />
        <div className={styles.swiper_container}>
          <SwiperContainer />
        </div>
        <div className={styles.show_container}>
          {/* <button className={styles.show_svg}>
            <img src={show} alt="show" />
          </button> */}
        </div>
        <div className={styles.card_container}>
          <div className={styles.card_item_1}>
            <Link to="/winepark-article">
              <div className={styles.card_img}>
                <img
                  className={styles.img_1}
                  src="./assets/B.jpg"
                  alt="image1"
                />
              </div>
            </Link>
            <div className={styles.card_text_container}>
              <h3 className={styles.card_text_heading}>
                Центр энотуризма WinePark
              </h3>
              <span className={styles.card_text_description}>
                Конкурс
                <svg
                  width="4"
                  height="4"
                  viewBox="0 0 4 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="2" cy="2" r="2" fill="#566272" />
                </svg>
                100 лучших объектов росии
              </span>
            </div>
            <Link to="/winepark-article" className={styles.card_button}>
              <svg
                className={styles.card_button_link}
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="20" fill="#566272" />
                <path
                  d="M10 20H20M30 20H20M20 20V10M20 20V30"
                  stroke="#F6F6F6"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </Link>
          </div>
          <div className={styles.card_item_2}>
            <Link to="/badaevsky">
              <div className={styles.card_img}>
                <img
                  className={styles.img_2}
                  src="./assets/B1.jpg"
                  alt="image2"
                />
              </div>
            </Link>
            <div className={styles.card_text_container}>
              <h3 className={styles.card_text_heading}>
                Marks Group&nbsp;&mdash; генеральный проектировщик ЖК
                &laquo;Бадаевский&raquo;
              </h3>
              <span className={styles.card_text_description}>
                Статья
                <svg
                  width="4"
                  height="4"
                  viewBox="0 0 4 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="2" cy="2" r="2" fill="#566272" />
                </svg>
                Экспертное обсуждение реставрации и приспособления объектов
                культурного наследия
              </span>
            </div>
            <Link to="/badaevsky" className={styles.card_button}>
              <svg
                className={styles.card_button_link}
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="20" fill="#566272" />
                <path
                  d="M10 20H20M30 20H20M20 20V10M20 20V30"
                  stroke="#F6F6F6"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </Link>
          </div>
        </div>
        <div className={styles.names_contents}>
          <div className={styles.name_11}>+11</div>
          <div id="competencies" className={styles.name_competencies}>
            Компетенции
          </div>
        </div>
        <div className={styles.most}>
          <img className={styles.image_most} alt=""></img>
        </div>
        <BlockHeader />
        {/* <Mapbox3D /> */}
      </div>
      <div className={styles.icon_partner}>
        <img src="./assets/D1.png" alt="logo" />
        <img src="./assets/D2.png" alt="logo" />
        <img src="./assets/D3.png" alt="logo" />
        <img src="./assets/D4.png" alt="logo" />
        <img src="./assets/D5.png" alt="logo" />
        <img src="./assets/D6.png" alt="logo" />
        <img src="./assets/D7.png" alt="logo" />
        <img src="./assets/D8.png" alt="logo" />
        <img src="./assets/D9.png" alt="logo" />
      </div>
      <SliderMobile />
      <div id="projects" className={styles.project_name}>
        Проекты
      </div>
      <div className={styles.swiper_progect_container}>
        <SwiperContainerProgect />
      </div>
      <div className={styles.main_project}>
        <div className={styles.main_project_left}>
          <Link to="/prime-park">
            <img
              className={styles.img_poject}
              src="./assets/project_left.jpg"
              alt="project-left"
            />
          </Link>
          <div className={styles.card_text}>
            <h3 className={styles.card_text_title}>Жилой квартал PRIME PARK</h3>
            <span className={styles.card_text_local}>
              г. Москва, Ленинградский проспект &bull; 2021{" "}
            </span>
          </div>
        </div>
        <div className={styles.main_project_right}>
          <div className={styles.main_project_right1}>
            <Link to="/hotel-appart">
              <img
                className={styles.img_project}
                src="./assets/project_right1.jpg"
                alt="project-right1"
              />
            </Link>
            <div className={styles.card_text}>
              <h3 className={styles.card_text_title}>Клубный дом Космо 4/22</h3>
              <span className={styles.card_text_local}>
                г. Москва, наб. Космодамианская &bull; 2021
              </span>
            </div>
          </div>
          <div className={styles.main_project_right2}>
            <Link to="/slava">
              <img
                className={styles.img_project}
                src="./assets/project_right2.jpg"
                alt="project-right2"
              />
            </Link>
            <div className={styles.card_text}>
              <h3 className={styles.card_text_title}>
                Многофункциональный комплекс апартаментов Slava
              </h3>
              <span className={styles.card_text_local}>
                Россия, Москва, 1-я ул. Ямского Поля &bull; 2020
              </span>
            </div>
          </div>
          <div className={styles.main_project_right3}>
            <Link to="/winepark">
              <img
                className={styles.img_project}
                src="./assets/project_right3.jpg"
                alt="project-right3"
              />
            </Link>
            <div className={styles.card_text}>
              <h3 className={styles.card_text_title}>
                Центр энотуризма WinePark
              </h3>
              <span className={styles.card_text_local}>
                г. Москва, Кутузовский проспект &bull; 2020
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
