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
import actively from "./img/actively.png";
import { getFetchForm } from "../store/Slice/projectSlice";
import { getFetchFormArticle } from "../store/Slice/articleSlice";
import styles from "./Header.module.css";
import LoadingCircle from "../Loading/LoadingCircle";
import Error from "../Loading/Error/Error";

SwiperCore.use([Navigation]);
const Host = process.env.REACT_APP_SERVER_HOST;

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function Header({ user, setNavBarOpen, setShowFooter }) {
  const sliderCardRef = useRef(null);
  const [enableVerticalScroll, setEnableVerticalScroll] = useState(true);
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false);
  const [isScrollingHorizontal, setIsScrollingHorizontal] = useState(false);

  const [loadingArticle, setLoadingArticle] = useState(false);

  const [data, setData] = useState(null);
  const { article, loading, error } = useSelector((state) => state.article);
  const project = useSelector((state) => state.project.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFetchFormArticle());
    dispatch(getFetchForm());
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
        } else if (!isSliderInView && el.scrollLeft + el.clientWidth >= el.scrollWidth) {
          setEnableVerticalScroll(true);
        } else if (!isSliderInView && el.scrollLeft <= 0) {
          setEnableVerticalScroll(true);
        } else if (!isSliderInView && el.scrollLeft + el.clientWidth >= el.scrollWidth && el.scrollTop + el.clientHeight >= el.scrollHeight) {
          setEnableVerticalScroll(true);
        }
      }
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
      !enableVerticalScroll &&
      isScrollingRight &&
      isAtRightEdge &&
      isAtBottom
    ) {
      setIsHorizontalScroll(false); // Переключение в режим вертикальной прокрутки
      el.scrollTo({
        top: el.scrollTop + e.deltaY,
        behavior: "smooth",
      });
    } else if (enableVerticalScroll && !isScrollingRight) {
      if (isAtLeftEdge && isAtTop) {
        setIsHorizontalScroll(true); // Переключение в режим горизонтальной прокрутки
        el.scrollLeft += e.deltaY;
      } else if (isAtLeftEdge && !isAtTop) {
        el.scrollTo({
          top: el.scrollTop + e.deltaY,
          behavior: "smooth",
        });
      } else if (isAtRightEdge && isAtBottom && e.deltaY < 0) {
        setIsHorizontalScroll(false); // Переключение в режим вертикальной прокрутки
        el.scrollLeft += e.deltaY;
      } else if (isAtRightEdge && isAtBottom && e.deltaY > 0) {
        setIsHorizontalScroll(true); // Переключение в режим горизонтальной прокрутки
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
  }, [loading, loadingArticle]);

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

  return (
    <main className={styles.header}>
      {user ? (
        <NavLink
          className={styles.preview_mode}
          to={`/admin/${data}`}
          onClick={() => closeNavbarHandler()}
        >
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
          {article &&
            article?.map((el, index) => (
              <div
                key={el.id}
                className={
                  index === 0 ? styles.card_item_1 : styles.card_item_2
                }
              >
                <Link
                 to={el.link}
                 >
                  <div className={styles.card_img}>
                    <img
                      className={index === 0 ? styles.img_1 : styles.img_2}
                      src={`${Host}/images/imageAdd/${el.imageTitle}`}
                      alt={el.imageTitle}
                    />
                  </div>
                </Link>
                <div className={styles.card_text_container}>
                  <h3 className={styles.card_text_heading}>{el.title}</h3>
                  <span className={styles.card_text_description}>
                    {el.descriptionArticle}
                  </span>
                </div>
                <Link
                 to={el.link}
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
            ))}
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
            768: {
              slidesPerView: 1.4,
            },
          }}
        >
          {project?.map((el, index) => {
            const isCustomSize = el.hasCustomSize;
            return (
              <SwiperSlide
                onScroll={handleScroll}
                key={el.id}
                id="slider_container_item_card"
                className={`{styles.slider_container_item_card}
             ${isCustomSize ? styles.customSize : ""}`}
                style={index % 2 === 1 ? { paddingTop: "10rem" } : {}}
              >
                <div className={styles.wrapper_container_item_card}>
                  <img
                    className={styles.container__imageTitle}
                    src={`${Host}/images/${
                      el.imageProject ? el.imageProject : el.imageTitle
                    }`}
                    alt={el.imageProject ? el.imageProject : el.imageTitle}
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
                          typeof el.selectCompetencies === "string" &&
                          el.selectCompetencies.includes(",")
                        ) {
                          return el.selectCompetencies
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
                    {el.countryCity}
                  </div>
                  <div className={styles.container__monthYear}>
                    {el.monthYear}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div id="preFooter"></div>
    </main>
  );
}
