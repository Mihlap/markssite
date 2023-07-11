import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import BlockHeader from "../UI/BlockHeader/BlockHeader";
import SwiperContainer from "./Swiper-Phone/SwiperContainer";
import SwiperContainerProgect from "./Swiper-project/SwiperContainerProgect";
import { Swiper, SwiperSlide } from "swiper/react";
import SliderHeader from "../UI/SliderHeader/SliderHeader";
import VideoPlayer from "../UI/Videoplayer/VideoPlayer";
import Mapbox3D from "../UI/Map3D/Mapbox3D";
import styles from "./Header.module.css";
import SliderMobile from "../UI/SliderHeader/SliderMobile";
import actively from "./img/actively.png";
import { useDispatch, useSelector } from "react-redux";
import { getFetchForm } from "../store/Slice/projectSlice";


gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
export default function Header() {
  const  project  = useSelector((state) => state.project.articles);
  const dispatch = useDispatch();
   const Host = process.env.REACT_APP_SERVER_HOST;

  
  useEffect(() => {
    dispatch(getFetchForm())
  }, [dispatch]);
  
  const colors = {
    Архитектура: "#FF7F6A",
    BIM: "#75BBFD",
    Конструкции: "#566272",
    Дизайн: "#FAA8BD",
    Инженерия: "#90B734",
  };

 return (
    <main className={styles.header}>
      {true ? (
        <NavLink className={styles.preview_mode} to="/admin">
          <div className={styles.preview_title}>Режим предпросмотра</div>
          <img src={actively} alt="icon" />
        </NavLink>
      ) : null}
      <div className={styles.video_block}>
        <VideoPlayer />
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
        <SliderHeader />
        <div className={styles.swiper_container}>
          <SwiperContainer
          // artickes={artickes}
          />
        </div>
        <div className={styles.show_container}></div>
        <div className={styles.card_container}>
          <div className={styles.card_item_1}>
            <Link
            // to={winePark.link}
            >
              <div className={styles.card_img}>
                <img
                  className={styles.img_1}
                  // src={winePark.img}
                  alt="winePark"
                />
              </div>
            </Link>
            <div className={styles.card_text_container}>
              {/* <h3 className={styles.card_text_heading}>{winePark.title}</h3> */}
              <span className={styles.card_text_description}>
                {/* {winePark.text} */}
              </span>
            </div>
            <Link
              // to={winePark.link}
              className={styles.card_button}
            >
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
            {/* <Link to={badaevsky.link}>
              <div className={styles.card_img}>
                <img
                  className={styles.img_2}
                  src={badaevsky.img}
                  alt="badaevsky"
                />
              </div>
            </Link> */}
            <div className={styles.card_text_container}>
              <h3 className={styles.card_text_heading}>
                {/* {badaevsky.title} */}
              </h3>
              <span className={styles.card_text_description}>
                {/* {badaevsky.text} */}
              </span>
            </div>
            <Link
              // to={badaevsky.link}
              className={styles.card_button}
            >
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
      {/* <div className={styles.swiper_progect_container}>
        <SwiperContainerProgect
          // project={project}
        />
      </div> */}
      <div className={styles.main_project}>
        <Swiper
          className={styles.slider_card_container_project}
          slidesPerView={3}
          spaceBetween={0}
          touch="true"
          direction="horizontal"
          loop={false}
        >
          {project?.map((el, index) => (
            <SwiperSlide
              key={el.id}
              className={styles.slider_container_item_card}
              style={index % 2 === 1 ? { paddingTop: "10rem" } : {}}
            >
              <div className={styles.wrapper_container_item_card}>
                <img
                  className={styles.container__imageTitle}
                 src={`${Host}/images/${el.imageTitle}`}
                  alt={el.imageTitle}
                />
              </div>
              <div className={styles.title_selectCompetencies}>
              <div className={styles.container__title}>{el.title}</div>
              <div className={styles.container__selectCompetencies}>
                {(() => {
                  try {
                    const selectCompetencies = JSON.parse(
                      el.selectCompetencies
                    );
                    return selectCompetencies.map((el) => (
                      <div key={el.value}
                      className={styles.div_el_selectCompetencies}
                      style={{
                        color: colors[el.value],
                        borderColor: colors[el.value],
                        border: "1px solid",
                        padding: "3px 6px",
                        borderRadius: "34px",
                      }}
                      >   
                        {el.label}
                        </div>
                    ));
                  } catch (error) {
                    console.log(
                      "Error parsing selectCompetencies JSON:",
                      error
                    );
                    return null; 
                  }
                })()}
              </div>
              </div>
              <div className={styles.countryCity_monthYear}>
              <div className={styles.container__countryCity}>
                {el.countryCity}
              </div>
              <div className={styles.container__monthYear}>{el.monthYear}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </main>
  );
}


 