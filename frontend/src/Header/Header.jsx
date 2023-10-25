import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import BlockHeader from "../UI/BlockHeader/BlockHeader";
import SwiperContainer from "./Swiper-Phone/SwiperContainer";
import SwiperContainerProgect from "./Swiper-project/SwiperContainerProgect";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import SliderHeader from "../UI/SliderHeader/SliderHeader";
import Mapbox3D from "../UI/Map3D/Mapbox3D";
import SliderMobile from "../UI/SliderHeader/SliderMobile";
import VideoPlayer from "../UI/Videoplayer/VideoPlayer";
// import actively from "./img/actively.svg";
// import { getFetchForm } from "../store/Slice/projectSlice";
import { getFetchFormArticle } from "../store/Slice/articleSlice";
import styles from "./Header.module.css";
// import LoadingCircle from "../Loading/LoadingCircle";
// import Error from "../Loading/Error/Error";
import { getZaprosData } from "../store/Slice/searchProjectMainSlice";
import { searchArticleLeftGet } from "../store/Slice/searchArticlePublicLeftSlice";
// import { resizeImage } from "../Project/utils";
import img123 from "./img/Главная.png";
import notDataPhoto from "./img/notData.png";

// import photoTest from "./img/project_right3.jpg";
import { textEnter, textLeave, imageHover } from "../store/Slice/cursorSlice";
import { searchArticleRightGet } from "../store/Slice/searchArticlePublicRightSlice";

SwiperCore.use([Navigation]);
const Host = process.env.REACT_APP_SERVER_HOST;

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Header({ user, setNavBarOpen, setShowFooter }) {
  const videoSource = {
    large: `${Host}/images/video/header_company_full.mp4`,
    medium: `${Host}/images/video/header_company_ipad.mp4`,
    small: `${Host}/images/video/header_company_mobile.mp4`
  };
  const sliderCardRef = useRef(null);
  const [enableVerticalScroll, setEnableVerticalScroll] = useState(true);
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false);
  const [isAtRightEdge, setIsAtRightEdge] = useState(false);
  const [scrollingMode, setScrollingMode] = useState("vertical");

  const [loadingArticle, setLoadingArticle] = useState(false);

  const cursorVariant = useSelector((state) => state.cursor);
  const { article, loading, error } = useSelector((state) => state.article);
  // const articles = useSelector((state) => state.article.article);
  const projects = useSelector((state) => state.searchproject.projects);

  const ArticleLeft = useSelector(
    (state) => state.searchArticlePublicLeft.articleLeft
  );
  const MapArticle = ArticleLeft?.map((el) => el.publication.publication);

  const ArticleRight = useSelector(
    (state) => state.searchArticlePublicRight.articleRight
  );
  const MapArticleRight = ArticleRight?.map((el) => el.publication.publication);

  const dispatch = useDispatch();

  const [videoSrc, setVideoSrc] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMouseEnter = () => {
    dispatch(textEnter());
  };

  const handleMouseLeave = () => {
    dispatch(textLeave());
  };

  const handleMouseHover = () => {
    dispatch(imageHover());
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1025) {
        setVideoSrc(videoSource.large);
      } else if (screenWidth >= 375 && screenWidth <= 1024) {
        setVideoSrc(videoSource.medium);
      } else {
        setVideoSrc(videoSource.small);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    dispatch(getFetchFormArticle());
    dispatch(getZaprosData());
    dispatch(searchArticleLeftGet());
    dispatch(searchArticleRightGet());
  }, [dispatch]);

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

  // if (error) {
  //   return (
  //     <div>
  //       {" "}
  //       <Error error={error.message} />
  //     </div>
  //   );
  // }
  // if (loading) {
  //   return <LoadingCircle />;
  // }
  const NewProject = projects.map((el) =>
    el && el.project !== undefined ? el.project : null
  );
  const MapProject = NewProject.map((el) =>
    el && el.project !== undefined ? el.project : null
  );

  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      <main className={styles.header}>
        <div className={styles.video_block}>
          <VideoPlayer videoSource={videoSource} />
        </div>
        <div className={styles.bg_video}>
          {videoSrc && (
            <video playsInline autoPlay muted loop id="bg-video">
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}
        </div>
        <div className={styles.header_desctop_block}>
          <h1
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={styles.desctop_title}
          >
            Награды и&nbsp;публикации
          </h1>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={styles.desctop_test}
          >
            Наша компания участвует в&nbsp;многочисленных выставках,
            конференциях
            <br /> и&nbsp;конкурсах. Предлагаем ознакомиться с&nbsp;некоторыми
            докладами
          </div>
        </div>
        {/* <div className={styles.header_block}>
        <h1 className={styles.heading}>Награды проектов</h1>
        <p className={styles.heading_text}>
          Наша компания участвует в<br /> многочисленных выставках, конференциях
          <br /> и конкурсах. Предлагаем ознакомиться с<br /> некоторыми
          докладами.
        </p>
      </div> */}
        <div className={styles.container_main}>
          <div className={styles.sliderHeader_container}>
            <SliderHeader />
          </div>
          <div className={styles.swiper_container}>
            <SwiperContainer article1={MapArticle} article2={MapArticleRight} />
          </div>
          <div className={styles.card_container}>
            {MapArticle && MapArticle.length > 0 ? (
              MapArticle.map((el) => {
                const firstPhoto = el.imageTitle.split(", ")[0];

                return (
                  <Link to={`/publication/${el.id}`} key={el.id}>
                    <div key={el.id} className={styles.card_item_1}>
                      <div className={styles.card_img}>
                        <img
                          onMouseEnter={handleMouseHover}
                          onMouseLeave={handleMouseLeave}
                          className={styles.img_1}
                          src={`${Host}/images/imageArticle/${firstPhoto}`}
                          alt="photo1"
                          loading="lazy"
                        />
                      </div>
                      <div className={styles.card_text}>
                        <span className={styles.card_text_title}>
                          {el.title}
                        </span>
                      </div>
                      <div className={styles.wrapper_card_text_svg}>
                        <span className={styles.card_text_city}>{el.city}</span>
                        <span className={styles.card_text_svg}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="4"
                            height="4"
                            viewBox="0 0 4 4"
                            fill="none"
                          >
                            <circle cx="2" cy="2" r="2" fill="#566272" />
                          </svg>
                        </span>
                        <span className={styles.card_text_dataMonthYear}>
                          {el.dataMonthYear}
                        </span>
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
                  </Link>
                );
              })
            ) : (
              <div className={styles.card_item_1}>
                <div className={styles.card_img}>
                  <img className={styles.img_1} src={img123} alt="photo2" />
                </div>
              </div>
            )}

            {MapArticleRight && MapArticleRight.length > 0 ? (
              MapArticleRight.map((el) => {
                // your existing code
                const firstPhoto = el.imageTitle.split(", ")[0];

                return (
                  <Link to={`/publication/${el.id}`} key={el.id}>
                    <div key={el.id} className={styles.card_item_2}>
                      <div className={styles.card_img}>
                        <img
                          onMouseEnter={handleMouseHover}
                          onMouseLeave={handleMouseLeave}
                          className={styles.img_2}
                          loading="lazy"
                          src={`${Host}/images/imageArticle/${firstPhoto}`}
                          alt="photo1"
                        />
                      </div>
                      <div className={styles.card_text}>
                        <span className={styles.card_text_title}>
                          {el.title}
                        </span>
                      </div>
                      <div className={styles.wrapper_card_text_svg}>
                        <span className={styles.card_text_city}>{el.city}</span>
                        <span className={styles.card_text_svg}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="4"
                            height="4"
                            viewBox="0 0 4 4"
                            fill="none"
                          >
                            <circle cx="2" cy="2" r="2" fill="#566272" />
                          </svg>
                        </span>
                        <span className={styles.card_text_dataMonthYear}>
                          {el.dataMonthYear}
                        </span>
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
                  </Link>
                );
              })
            ) : (
              <div className={styles.card_item_2}>
                <div className={styles.card_img}>
                  <img className={styles.img_2} src={img123} alt="photo2" />
                </div>
              </div>
            )}
          </div>
          <div className={styles.names_contents}>
            <div className={styles.name_11}>+11</div>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              id="competencies"
              className={styles.name_competencies}
            >
              Компетенции
            </div>
          </div>
          <div className={styles.most}>
            <img
              className={styles.image_most}
              loading="lazy"
              src="./assets/most.png"
              alt=""
            ></img>
          </div>
          <BlockHeader />
          <Mapbox3D />
        </div>
        <div className={styles.sliderMobile_container}>
          <SliderMobile />
        </div>
        <div
          id="projects"
          className={styles.project_name}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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
              2500: {
                slidesPerView: 4.7,
              },
              2000: {
                slidesPerView: 4.2,
              },
              1750: {
                slidesPerView: 3.5,
              },
              1440: {
                slidesPerView: 2.7,
              },
              1300: {
                slidesPerView: 2.7,
              },
              1200: {
                slidesPerView: 2.5,
              },
              1024: {
                slidesPerView: 2.3,
              },
              900: {
                slidesPerView: 2.1,
              },
              700: {
                slidesPerView: 2.1,
              },
            }}
          >
            {MapProject?.map((project, index) => {
              // const isCustomSize = project.hasCustomSize;

              // const { width, height } = resizeImage(
              //   project.style?.split(",")[0],
              //   project.style?.split(",")[1]
              // );

              return (
                <SwiperSlide
                  key={project.id}
                  onScroll={handleScroll}
                  id="slider_container_item_card"
                  className={styles.slider_container_item_card}
                  style={index % 2 === 1 ? { paddingTop: "10rem" } : {}}
                >
                  <Link to={`/projects/${project.id}`} key={project.id}>
                    <div className={styles.wrapper_container_item_card}>
                      <img
                        className={styles.container__imageTitle}
                        //  style={{
                        //   height: `${project.style?.split(",")[1]}rem`,
                        //   width: `${project.style?.split(",")[0]}rem`,
                        // }}
                        loading="lazy"
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
                        onError={(e) => {
                          e.target.src = notDataPhoto; // Заменить на URL другой фотографии
                          e.target.alt =
                            "Альтернативный текст для замененной фотографии"; // Заменить на альтернативный текст
                        }}
                      />
                    </div>
                    <div
                      className={
                        styles.wrapper_container_title_selectCompetencies
                      }
                    >
                      <div
                        className={
                          styles.container_wrapper_title_city_data_block
                        }
                      >
                        <div className={styles.container__title}>
                          {project.title}
                        </div>
                        <div className={styles.countryCity_monthYear}>
                          <div className={styles.container__countryCity}>
                            {project.countryCity}
                          </div>
                          <div className={styles.project__address__svg}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="2"
                              height="2"
                              viewBox="0 0 2 2"
                              fill="none"
                            >
                              <circle cx="1" cy="1" r="1" fill="#959DA6" />
                            </svg>{" "}
                          </div>
                          <div className={styles.container__monthYear}>
                            {project.monthYear}
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.wrapper_container__selectCompetencies}
                      >
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
                                typeof project.selectCompetencies === "string"
                              ) {
                                // Если строка с одним значением и без запятых
                                if (!project.selectCompetencies.includes(",")) {
                                  const label =
                                    project.selectCompetencies.trim();
                                  return (
                                    <div
                                      key={label}
                                      className={
                                        styles.div_el_selectCompetencies
                                      }
                                      style={{
                                        color: colors[label],
                                        borderColor: colors[label],
                                        border: "1px solid",
                                        padding: "3px 6px",
                                        borderRadius: "34px",
                                      }}
                                    >
                                      {label}
                                    </div>
                                  );
                                }
                                // Строка с несколькими значениями, разделенными запятыми
                                else if (
                                  project.selectCompetencies.includes(",")
                                ) {
                                  return project.selectCompetencies
                                    .split(",")
                                    .map((value) => {
                                      const label = value.trim();
                                      return (
                                        <div
                                          key={value}
                                          className={
                                            styles.div_el_selectCompetencies
                                          }
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
                              }
                              return null;
                            }
                          })()}
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </main>
    </>
  );
}
