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
import { fetchArticles } from "../store/Slice/articlesSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchProject } from "../store/Slice/projectSlice";
import LoadingCircle from "../Loading/LoadingCircle";
import Error from "../Loading/Error/Error";


gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
export default function Header() {
    const dispatch = useDispatch();
    const artickes = useSelector((state) => state.articles.articles);
    const project = useSelector((state) => state.project.articles);
    const loading = useSelector((state) => state.articles.loading);
    const error = useSelector((state) => state.articles.error);
    
    // const loading = useSelector((state) => state.project.loading);
    // const error = useSelector((state) => state.project.error);
   

    useEffect(() => {
      dispatch(fetchArticles());
      dispatch(fetchProject());
    }, [dispatch]);

    if (loading) {
      return <LoadingCircle />
    }

    if (error) {
      return <div> <Error error={error} /></div>;
    }

  
    if (loading) {
      return <LoadingCircle />
    }

    if (error) {
      return (
        <div>
          <Error error={error} />
        </div>
      );
    }
  
  const array = artickes.map((el) => el.attributes);

  if (array[0] === undefined) { 
    return array[0]
  }
  if (array[1] === undefined) {
     return array[1]
  }  
  // из объекта вытаскиваются только 0 и 1 статья 
  const winePark = array[0];
  const badaevsky = array[1];

  let primeParkProject = []
  let hotelAppartProject = []
  let slavaProject = []
  let wineParkProject =[]


if (project !== undefined) {
  const arrayProject = project.map((elem) => elem.attributes);

  if (arrayProject[0] === undefined) {
    return arrayProject[0];
  }
  if (arrayProject[1] === undefined) {
    return arrayProject[1];
  }
  if (arrayProject[2] === undefined) {
    return arrayProject[2];
  }
  if (arrayProject[3] === undefined) {
    return arrayProject[3];
  }

   primeParkProject = arrayProject[0];
   hotelAppartProject = arrayProject[1];
   slavaProject = arrayProject[2];
   wineParkProject = arrayProject[3];

}

  
  return (
    <main className={styles.header}>
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
          <SwiperContainer artickes={artickes} />
        </div>
        <div className={styles.show_container}></div>
        <div className={styles.card_container}>
          <div className={styles.card_item_1}>
            <Link to={winePark.link}>
              <div className={styles.card_img}>
                <img
                  className={styles.img_1}
                  src={winePark.img}
                  alt="winePark"
                />
              </div>
            </Link>
            <div className={styles.card_text_container}>
              <h3 className={styles.card_text_heading}>{winePark.title}</h3>
              <span className={styles.card_text_description}>
                {winePark.text}
              </span>
            </div>
            <Link to={winePark.link} className={styles.card_button}>
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
            <Link to={badaevsky.link}>
              <div className={styles.card_img}>
                <img
                  className={styles.img_2}
                  src={badaevsky.img}
                  alt="badaevsky"
                />
              </div>
            </Link>
            <div className={styles.card_text_container}>
              <h3 className={styles.card_text_heading}>{badaevsky.title}</h3>
              <span className={styles.card_text_description}>
                {badaevsky.text}
              </span>
            </div>
            <Link to={badaevsky.link} className={styles.card_button}>
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
          <Link to={primeParkProject.link}>
            <img
              className={styles.img_poject}
              src={primeParkProject.img}
              alt={primeParkProject.title}
            />
          </Link>
          <div className={styles.card_text}>
            <h3 className={styles.card_text_title}>{primeParkProject.title}</h3>
            <span className={styles.card_text_local}>
              {primeParkProject.text}
            </span>
          </div>
        </div>
        <div className={styles.main_project_right}>
          <div className={styles.main_project_right1}>
            <Link to={hotelAppartProject.link}>
              <img
                className={styles.img_project}
                src={hotelAppartProject.img}
                alt={hotelAppartProject.title}
              />
            </Link>
            <div className={styles.card_text}>
              <h3 className={styles.card_text_title}>{hotelAppartProject.title}</h3>
              <span className={styles.card_text_local}>
                {hotelAppartProject.text}
              </span>
            </div>
          </div>
          <div className={styles.main_project_right2}>
            <Link to={slavaProject.link}>
              <img
                className={styles.img_project}
                src={slavaProject.img}
                alt={slavaProject.title}
              />
            </Link>
            <div className={styles.card_text}>
              <h3 className={styles.card_text_title}>
                {slavaProject.title}
              </h3>
              <span className={styles.card_text_local}>
                {slavaProject.text}
              </span>
            </div>
          </div>
          <div className={styles.main_project_right3}>
            <Link to={wineParkProject.link}>
              <img
                className={styles.img_project}
                src={wineParkProject.img}
                alt={wineParkProject.title}
              />
            </Link>
            <div className={styles.card_text}>
              <h3 className={styles.card_text_title}>
                {wineParkProject.title}
              </h3>
              <span className={styles.card_text_local}>
                {wineParkProject.text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
