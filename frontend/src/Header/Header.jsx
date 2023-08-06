import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import BlockHeader from "../UI/BlockHeader/BlockHeader";
import SwiperContainer from "./Swiper-Phone/SwiperContainer";
import SwiperContainerProgect from "./Swiper-project/SwiperContainerProgect";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import SliderHeader from "../UI/SliderHeader/SliderHeader";
import VideoPlayer from "../UI/Videoplayer/VideoPlayer";
import Mapbox3D from "../UI/Map3D/Mapbox3D";
import SliderMobile from "../UI/SliderHeader/SliderMobile";
import actively from "./img/actively.svg";
import { getFetchForm } from "../store/Slice/projectSlice";
import { getFetchFormArticle } from "../store/Slice/articleSlice";
import styles from "./Header.module.css";
import LoadingCircle from "../Loading/LoadingCircle";
import Error from "../Loading/Error/Error";
import { getZaprosData } from "../store/Slice/searchProjectMainSlice";
import { searchArticleLeftGet } from "../store/Slice/searchArticlePublicLeftSlice";

import photoTest from "./img/project_right3.jpg";

SwiperCore.use([Navigation]);
const Host = process.env.REACT_APP_SERVER_HOST;

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Header({ user, setNavBarOpen, setShowFooter }) {
  const sliderCardRef = useRef(null);
  const [enableVerticalScroll, setEnableVerticalScroll] = useState(true);
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false);
  const [isAtRightEdge, setIsAtRightEdge] = useState(false);
  const [scrollingMode, setScrollingMode] = useState("vertical");

  const [loadingArticle, setLoadingArticle] = useState(false);

  const [data, setData] = useState(null);
  const { article, loading, error } = useSelector((state) => state.article);
  const projects = useSelector((state) => state.searchproject.projects);
  const ArticleLeft = useSelector(
    (state) => state.searchArticlePublicLeft.articleLeft
  );
  const MapArticle = ArticleLeft.map((el) => el.publication.publication);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFetchFormArticle());
    dispatch(getZaprosData());
    dispatch(searchArticleLeftGet());
  }, [dispatch]);

  useEffect(() => {
    const storedData = localStorage.getItem("selectedItem");
    setData(storedData);
  }, []);

  const colors = {
    Архитектура: "#FF7F6A",
    BIM: "#75BBFD",
    Конструкции: "#566272",
    Дизайн: "#FAA8BD",
    Инженерия: "#90B734",
  };

  const handleScroll = () => {
    const el = sliderCardRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const isSliderInView = rect.top <= window.innerHeight && rect.bottom >= 0;
      setEnableVerticalScroll(!isSliderInView);

      if (!loadingArticle) {
        if (isSliderInView && el.scrollLeft > 0) {
          setEnableVerticalScroll(false);
          setIsHorizontalScroll(false); // Disable vertical scrolling
        } else if (
          !isSliderInView &&
          el.scrollLeft + el.clientWidth >= el.scrollWidth
        ) {
          setEnableVerticalScroll(true);
          setIsHorizontalScroll(false);
        } else if (!isSliderInView && el.scrollLeft <= 0) {
          setEnableVerticalScroll(true);
          setIsHorizontalScroll(false);
        } else if (
          !isSliderInView &&
          el.scrollLeft + el.clientWidth >= el.scrollWidth &&
          el.scrollTop + el.clientHeight >= el.scrollHeight
        ) {
          setEnableVerticalScroll(true);
          setIsHorizontalScroll(false);
        }
      }
    }

    if (el) {
      const isRightEdge = el.scrollLeft + el.clientWidth >= el.scrollWidth;
      setIsAtRightEdge(isRightEdge);
    }
  };

  const onVerticalScroll = (e) => {
    const el = sliderCardRef.current;
    const isScrollingUp = e.deltaY < 0;
    const isAtTop = el.scrollTop <= 0;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;

    if (isScrollingUp && isAtTop) {
      setEnableVerticalScroll(false);
      el.scrollLeft += e.deltaY;
    } else if (!isAtBottom) {
      el.scrollTo({
        top: el.scrollTop + e.deltaY,
        behavior: "smooth",
      });
    } else {
      e.preventDefault();
    }
  };

  const onWheel = (e) => {
    const el = sliderCardRef.current;
    const isScrollingRight = e.deltaY >= 0;
    const isAtRightEdge = el.scrollLeft + el.clientWidth >= el.scrollWidth;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
    const isAtLeftEdge = el.scrollLeft <= 0;
    const isAtTop = el.scrollTop <= 0;

    if (
      isScrollingRight &&
      isAtRightEdge &&
      isAtBottom &&
      !isHorizontalScroll
    ) {
      setIsHorizontalScroll(false); // Horizontal scrolling has stopped
      el.scrollTo({
        top: el.scrollTop + e.deltaY,
        behavior: "smooth",
      });
    } else if (enableVerticalScroll && !isScrollingRight) {
      if (isAtLeftEdge && isAtTop) {
        setIsHorizontalScroll(true); // Horizontal scrolling is in progress
        el.scrollLeft += e.deltaY;
      } else if (isAtLeftEdge && !isAtTop) {
        el.scrollTo({
          top: el.scrollTop + e.deltaY,
          behavior: "smooth",
        });
      } else if (
        isAtRightEdge &&
        isAtBottom &&
        e.deltaY < 0 &&
        !isHorizontalScroll
      ) {
        setIsHorizontalScroll(false); // Allow vertical scrolling
        el.scrollLeft += e.deltaY;
      } else if (
        isAtRightEdge &&
        isAtBottom &&
        e.deltaY > 0 &&
        !isHorizontalScroll
      ) {
        setIsHorizontalScroll(true); // Disable vertical scrolling
        el.scrollTo({
          top: el.scrollTop + e.deltaY,
          behavior: "smooth",
        });
      } else {
        e.preventDefault();
      }
    } else {
      el.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const el = sliderCardRef.current;
    if (el) {
      el.addEventListener("wheel", onVerticalScroll, { passive: false });
      el.addEventListener("wheel", onWheel, { passive: false });
      el.addEventListener("scroll", handleScroll);
      return () => {
        el.removeEventListener("wheel", onVerticalScroll);
        el.removeEventListener("wheel", onWheel);
        el.removeEventListener("scroll", handleScroll);
      };
    }
  }, [loading, loadingArticle, scrollingMode]);

  const closeNavbarHandler = () => {
    setNavBarOpen(false);
    setShowFooter(false);
  };

  if (error) {
    return (
      <div>
        {" "}
        <Error error={error.message} />
      </div>
    );
  }
  if (loading) {
    return <LoadingCircle />;
  }
  const NewProject = projects.map((el) =>
    el && el.project !== undefined ? el.project : null
  );
  const MapProject = NewProject.map((el) =>
    el && el.project !== undefined ? el.project : null
  );

  return (
    <main className={styles.header}>
      {user ? (
        <NavLink
          className={styles.preview_mode}
          to={`/admin/${data}`}
          onClick={() => closeNavbarHandler()}
        >
          <img src={actively} alt="icon" />
          <div className={styles.preview_title}>
            Вернуться в кабинет редактора
          </div>
        </NavLink>
      ) : null}
      <div className={styles.video_block}>
        <VideoPlayer />
        {/* {MapProject?.map((el) => (
          <div key={el.id}>
            <div>
              {el.title}
            </div>
          </div>
        ))} */}
      </div>
      <div className={styles.header_desctop_block}>
        <h1 className={styles.desctop_title}>Награды и публикации</h1>
        <div className={styles.desctop_test}>
          Наша компания участвует в многочисленных выставках, конференциях
          <br /> и конкурсах. Предлагаем ознакомиться с некоторыми докладами
        </div>
      </div>
      <div className={styles.header_block}>
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
          <SwiperContainer article={MapArticle} />
        </div>
        <div className={styles.card_container}>
          {MapArticle && MapArticle.length > 0 ? (
            MapArticle.map((el) => {
              // your existing code
              const firstPhoto = el.imageTitle.split(", ")[0];

              return (
                <div key={el.id} className={styles.card_item_1}>
                  <div className={styles.card_img}>
                    <img
                      className={styles.img_1}
                      src={`${Host}/images/imageArticle/${firstPhoto}`}
                      alt="photo1"
                    />
                  </div>
                  <div className={styles.card_text}>
                    <h3>{el.title}</h3>
                    <span>{el.dataMonthYear}</span>
                  </div>
                  <button className={styles.card_button}>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="16" cy="16" r="16" fill="#566272" />
                      <path
                        d="M6 16H16M26 16H16M16 16V6M16 16V26"
                        stroke="#F6F6F6"
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <div className={styles.card_item_1}>
              <div className={styles.card_img}>
                <img
                  className={styles.img_1}
                  src="https://zoo69.ru/wp-content/uploads/2018/11/net-foto.png"
                  alt="photo2"
                />
              </div>
            </div>
          )}
          <div className={styles.card_item_2}>
            <div className={styles.card_img}>
              <img className={styles.img_2} src={photoTest} alt="image2" />
            </div>
            <div className={styles.card_text}>
              <h3>Смотр-конкурс Стекло в архитектуре 2022</h3>
              <span>Номинация Объект • нового строительства</span>
            </div>
            <button className={styles.card_button}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="16" r="16" fill="#566272" />
                <path
                  d="M6 16H16M26 16H16M16 16V6M16 16V26"
                  stroke="#F6F6F6"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.names_contents}>
          <div className={styles.name_11}>+11</div>
          <div id="competencies" className={styles.name_competencies}>
            Компетенции
          </div>
        </div>
        <div className={styles.most}>
          <img
            className={styles.image_most}
            src="./assets/most.png"
            alt=""
          ></img>
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
        <SwiperContainerProgect projects={projects} />
      </div>
      <div className={styles.main_project}>
        <Swiper
          className={styles.slider_card_container_project}
          id="slider_card_container_project"
          ref={sliderCardRef}
          spaceBetween={30}
          touch="true"
          direction="horizontal"
          loop={false}
          breakpoints={{
            1440: {
              slidesPerView: 3.2,
            },
            1024: {
              slidesPerView: 2.3,
            },
            700: {
              slidesPerView: 2.1,
            },
          }}
        >
          {MapProject?.map((project, index) => {
            const isCustomSize = project.hasCustomSize;

            // let imageTitles = [];
            // if (project.imageTitle && /\S/.test(project.imageTitle)) {
            //      imageTitles = project.imageTitle
            //     .split(",")
            //     .map((el) => el.replace(/[{}]/g, ""));
            // }

            // const firstImageTitle = imageTitles.length > 0 ? imageTitles[0] : null;
            // console.log(MapProject, '++++++++++++++++++++++++++++++++++++++++');
            return (
              <SwiperSlide
                key={project.id}
                onScroll={handleScroll}
                id="slider_container_item_card"
                className={`{styles.slider_container_item_card}
                ${isCustomSize ? styles.customSize : ""}`}
                style={index % 2 === 1 ? { paddingTop: "10rem" } : {}}
              >
                <Link to={`/projects/${project.id}`} key={project.id}>
                  <div className={styles.wrapper_container_item_card}>
                    <img
                      className={styles.container__imageTitle}
                      src={`${Host}/images/imageAdd/${
                        project.imageProject
                          ? project.imageProject
                          : project.imageTitle
                      }`}
                      alt={
                        project.imageProject
                          ? project.imageProject
                          : project.imageTitle
                      }
                    />
                  </div>
                  <div className={styles.title_selectCompetencies}>
                    <div className={styles.container__title}>
                      {project.title}
                    </div>
                    <div className={styles.container__selectCompetencies}>
                      {(() => {
                        try {
                          const selectCompetencies = JSON.parse(
                            project.selectCompetencies
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
                            typeof project.selectCompetencies === "string" &&
                            project.selectCompetencies.includes(",")
                          ) {
                            return project.selectCompetencies
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
                  </div>
                  <div className={styles.countryCity_monthYear}>
                    <div className={styles.container__countryCity}>
                      {project.countryCity}
                    </div>
                    <div className={styles.container__monthYear}>
                      {project.monthYear}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div id="preFooter"></div>
    </main>
  );
}
