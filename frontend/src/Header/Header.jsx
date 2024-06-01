import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import SwiperContainer from "./Swiper-Phone/SwiperContainer";
import SwiperContainerProgect from "./Swiper-project/SwiperContainerProgect";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import SliderHeader from "../UI/SliderHeader/SliderHeader";
import Mapbox3D from "../UI/Map3D/Mapbox3D";
import Error from "../Loading/Error/Error";
import SliderMobile from "../UI/SliderHeader/SliderMobile";
import BlockHeaderMain from "../UI/BlockHeader/BlockHeaderMain";
import { getFetchFormArticle } from "../store/Slice/articleSlice";
import { getZaprosData } from "../store/Slice/searchProjectMainSlice";
import { searchArticleLeftGet } from "../store/Slice/searchArticlePublicLeftSlice";
import { searchArticleRightGet } from "../store/Slice/searchArticlePublicRightSlice";
import styles from "./Header.module.css";

import notDataPhoto from "./img/notData.png";
import nameCompany from "../icons/nameCompany.svg";
import nameCompany1 from "../icons/nameCompany1.svg";
import img123 from "./img/Главная.png";
// import { textEnter, textLeave, imageHover, specialHover } from "../store/Slice/cursorSlice";

SwiperCore.use([Navigation]);
const Host = process.env.REACT_APP_SERVER_HOST;

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

 const Header = React.memo(({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
  handleSpecialHover,
  setVideoLoaded
}) => {
  const videoSource = {
    large: `${Host}/videos/main_company_full.mp4`,
    medium: `${Host}/videos/main_company_ipad.mp4`,
    small: `${Host}/videos/main_company_mobile.mp4`,
  };
  const [loadingArticle, setLoadingArticle] = useState(false);
  const cursorVariant = useSelector((state) => state.cursor);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [videoSrc, setVideoSrc] = useState(null);
  const sliderCardRef = useRef(null);

  const { article, loading, error } = useSelector((state) => state.article);
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.article.article);
  const projects = useSelector((state) => state.searchproject.projects);
  const ArticleLeft = useSelector(
    (state) => state.searchArticlePublicLeft.articleLeft
  );
  const ArticleRight = useSelector(
    (state) => state.searchArticlePublicRight.articleRight
  );

  const MapArticle = ArticleLeft?.map((el) => el.publication.publication);
  const MapArticleRight = ArticleRight?.map((el) => el.publication.publication);

  const isMobile = window.innerWidth <= 767;

  const imageSrc = isMobile ? nameCompany1 : nameCompany;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // const handleMouseEnter = () => {
  //   dispatch(textEnter());
  // };

  // const handleMouseLeave = () => {
  //   dispatch(textLeave());
  // };

  // const handleMouseHover = () => {
  //   dispatch(imageHover());
  // };

  // const handleSpecialHover = () => {
  //   dispatch(specialHover());
  // };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1025) {
        setVideoSrc(videoSource.large);
      } else if (screenWidth >= 768 && screenWidth <= 1024) {
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
    dispatch(searchArticleLeftGet());
    dispatch(searchArticleRightGet());
  }, [dispatch]);
   
  useEffect(() => {
    dispatch(getZaprosData());
  }, [dispatch]);

  const colors = useMemo(() => ({
    Архитектура: "#FF7F6A",
    BIM: "#75BBFD",
    Конструкции: "#566272",
    Дизайн: "#FAA8BD",
    Инженерия: "#90B734",
  }), []);

   useEffect(() => {
    // Состояние для отслеживания, находится ли пользователь в процессе скроллинга к верху слайдера
    let scrollingToTopOfSlider = false;
  
    const handleScroll = (e) => {
      const el = sliderCardRef.current;
      if (!el) return;
  
      const documentScrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const sliderRect = el.getBoundingClientRect();
      const sliderTop = sliderRect.top + documentScrollTop;
      const sliderBottom = sliderTop + el.offsetHeight;
      const isAtEndOfSlider = el.scrollWidth - el.scrollLeft <= el.clientWidth;
      const isAtStartOfSlider = el.scrollLeft === 0;
  
      // Проверяем, находимся ли мы в нижней части слайдера
      const isAtSliderBottom = documentScrollTop + windowHeight >= sliderBottom;
      if (isAtSliderBottom && e.deltaY > 0 && !isAtEndOfSlider) {
        e.preventDefault();
        el.scrollLeft += 80;
        scrollingToTopOfSlider = false; // Сбросить, так как мы двигаемся вправо
      }
  
      // Проверяем, находимся ли мы уже в процессе скроллинга к верху слайдера
      if (e.deltaY < 0 && !isAtStartOfSlider) {
        if (scrollingToTopOfSlider || documentScrollTop < sliderTop) {
          e.preventDefault();
          el.scrollLeft -= 80;
          scrollingToTopOfSlider = true; // Обновляем, так как мы начали скроллить к верху слайдера
        }
      }
  
      // Если мы достигли начала слайдера и продолжаем скроллить вверх
      if (isAtStartOfSlider && e.deltaY < 0 && scrollingToTopOfSlider) {
        scrollingToTopOfSlider = false; // Позволяем обычный скролл страницы
      }
    };
  
    window.addEventListener('wheel', handleScroll, { passive: false });
  
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, []);  
  

  if (error) {
    return (
      <div>
        {" "}
        <Error error={error.message} />
      </div>
    );
  }
  // if (loading) {
  //   return <LoadingCircle />;
  //   // return <LoadingNew />;
  // }

  const NewProject = projects.map((el) =>
    el && el.project !== undefined ? el.project : null
  );
  const MapProject = NewProject.map((el) =>
    el && el.project !== undefined ? el.project : null
   );
   
   const MapProjectToEdit = projects.map((el) => el.project);

   
   const combinedProjects = [...MapProject, ...MapProjectToEdit].filter(
    (project, index, self) =>
      project &&
      index === self.findIndex((p) => p && p.id === project.id)
  );

   return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      <main className={styles.header}>
        {/* <div className={styles.video_block}>
          <VideoPlayer videoSource={videoSource} />
        </div> */}
        <div className={styles.wrapper_nameCompanyMainHeader}>
          <div className={styles.block_video_company}>
            {videoSrc && (
              <video
                playsInline
                autoPlay
                muted
                loop
                id="bg-video"
                onCanPlayThrough={() => setVideoLoaded(true)}
                className={styles.bg_video}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            )}
          </div>
          <div className={styles.nameCompanyContainer}>
            <img src={imageSrc} alt={nameCompany} />
            <span className={styles.span_nameCompany}>
              Генеральное проектирование
            </span>
            <span className={styles.span_nameCompany11}>
              Реализация всех типов объектов «под ключ»
            </span>
          </div>
        </div>
        <div className={styles.header_desctop_block}>
          <h1 className={styles.desctop_title}>Награды и&nbsp;публикации</h1>
          <div className={styles.desctop_test}>
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
          <div
            onMouseEnter={handleSpecialHover}
            onMouseLeave={handleMouseLeave}
            className={styles.sliderHeader_container}
          >
            <NavLink to="/company#table-header-anchor">
              <SliderHeader />
            </NavLink>
          </div>
          <div className={styles.swiper_container}>
            <SwiperContainer
              article1={articles.filter((article) =>
                MapArticle.some((el) => el.id === article.id)
              )}
              article2={articles.filter((article) =>
                MapArticleRight.some((el) => el.id === article.id)
              )}
            />
          </div>
          <div className={styles.card_container}>
            {/* {MapArticle && MapArticle.length > 0 ? (
              MapArticle.map((el) => {
                const firstPhoto = el.imageTitle.split(", ")[0]; */}
            {articles && articles.length > 0 ? (
              <>
                {articles
                  .slice()
                  .reverse()
                  .map((article) => {
                    const isArticleLeft = MapArticle.some(
                      (el) => el.id === article.id
                    );
                    // Если статья соответствует ArticleLeft, то отображаем ее
                    if (isArticleLeft) {
                      const imagePathsForArticle = article.imageTitle
                        ? article.imageTitle.split(",").map((el) => el.trim())
                        : [];
                      const firstPhoto = imagePathsForArticle[0] || null;
                      const encodedFileName = firstPhoto
                        ? encodeURIComponent(firstPhoto)
                        : null;
                      const defaultImagePath = img123;
                      const firstImagePath = encodedFileName
                        ? `${Host}/images/imageArticle/${encodedFileName}`
                        : defaultImagePath;

                      return (
                        <Link
                          to={`/publication/${article.id}`}
                          key={article.id}
                        >
                          <div key={article.id} className={styles.card_item_1}>
                            <div className={styles.card_img}>
                              <img
                                onMouseEnter={handleMouseHover}
                                onMouseLeave={handleMouseLeave}
                                className={styles.img_1}
                                // src={`${Host}/images/imageArticle/${firstPhoto}`}
                                src={firstImagePath}
                                alt="photo1"
                                loading="lazy"
                              />
                            </div>
                            <div className={styles.card_text}>
                              <span className={styles.card_text_title}>
                                {article.title}
                              </span>
                            </div>
                            <div className={styles.wrapper_card_text_svg}>
                              <span className={styles.card_text_city}>
                                {article.city}
                              </span>
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
                                {article.dataMonthYear}
                              </span>
                            </div>
                            <button
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              className={styles.card_button}
                            >
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
                    } else {
                      return null; // Не отображаем ничего, если статья не соответствует ArticleLeft
                    }
                  })}
                {MapArticle.length === 0 && ( // Отображаем заглушку, если MapArticle пустой
                  <div className={styles.card_item_1}>
                    <div className={styles.card_img}>
                      <img className={styles.img_1} src={img123} alt="photo2" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.card_item_1}>
                <div className={styles.card_img}>
                  <img className={styles.img_1} src={img123} alt="photo2" />
                </div>
              </div>
            )}
            {articles && articles.length > 0 ? (
              <>
                {articles
                  .slice()
                  .reverse()
                  .map((article) => {
                    const isArticRight = MapArticleRight.some(
                      (el) => el.id === article.id
                    );
                    // Если статья соответствует ArticleRight, то отображаем ее
                    if (isArticRight) {
                      const imagePathsForArticleRight = article.imageTitle
                        ? article.imageTitle.split(",").map((el) => el.trim())
                        : [];
                      const firstPhotoRight =
                        imagePathsForArticleRight[0] || null;
                      const encodedFileName = firstPhotoRight
                        ? encodeURIComponent(firstPhotoRight)
                        : null;
                      const defaultImagePath = img123;
                      const firstImagePathRight = encodedFileName
                        ? `${Host}/images/imageArticle/${encodedFileName}`
                        : defaultImagePath;

                      return (
                        <Link
                          to={`/publication/${article.id}`}
                          key={article.id}
                        >
                          <div key={article.id} className={styles.card_item_2}>
                            <div className={styles.card_img}>
                              <img
                                onMouseEnter={handleMouseHover}
                                onMouseLeave={handleMouseLeave}
                                className={styles.img_2}
                                // src={`${Host}/images/imageArticle/${firstPhoto}`}
                                src={firstImagePathRight}
                                alt="photo2"
                                loading="lazy"
                              />
                            </div>
                            <div className={styles.card_text}>
                              <span className={styles.card_text_title}>
                                {article.title}
                              </span>
                            </div>
                            <div className={styles.wrapper_card_text_svg}>
                              <span className={styles.card_text_city}>
                                {article.city}
                              </span>
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
                                {article.dataMonthYear}
                              </span>
                            </div>
                            <button
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              className={`${styles.card_button} ${styles.extra_button_class}`}
                            >
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
                    } else {
                      return null; // Не отображаем ничего, если статья не соответствует ArticRight
                    }
                  })}
                {MapArticleRight.length === 0 && ( // Отображаем заглушку, если MapArticleRight пустой
                  <div className={styles.card_item_2}>
                    <div className={styles.card_img}>
                      <img className={styles.img_2} src={img123} alt="photo2" />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.card_item_2}>
                <div className={styles.card_img}>
                  <img className={styles.img_2} src={img123} alt="photo2" />
                </div>
              </div>
            )}
          </div>
          <div className={styles.names_contents}>
            <div className={styles.name_11}>+8</div>
            <div id="competencies" className={styles.name_competencies}>
              Компетенции
            </div>
          </div>
          <div className={styles.most}>
            <img
              className={styles.image_most}
              loading="lazy"
              src="./assets/most2.png"
              alt=""
            ></img>
          </div>
          {/* <BlockHeader /> */}
          <div
            className={styles.block_header_maim_wrapper}
            id="blockHeaderMain"
          >
            <BlockHeaderMain
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
            />
          </div>
          <Mapbox3D />
        </div>
        <div className={styles.sliderMobile_container}>
          <SliderMobile />
        </div>
        <div id="projects" className={styles.project_name}>
          Проекты
        </div>
        <div className={styles.swiper_progect_container}>
          <SwiperContainerProgect projects={projects} />
        </div>
        <div className={styles.main_project}>
          <Swiper
            onSlideChange={(swiper) => setCurrentSlideIndex(swiper.activeIndex)}
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
             {combinedProjects?.map((project, index) => {
                if (!project || !project.id) {
                    return null; // Пропускать проекты, у которых нет данных
                  }
              // const isCustomSize = project.hasCustomSize;

              // const { width, height } = resizeImage(
              //   project.style?.split(",")[0],
              //   project.style?.split(",")[1]
              // );

              return (
                <SwiperSlide
                key={`${project.IdProject}-${index}`}
                  // onScroll={handleScroll}
                  id="slider_container_item_card"
                  className={styles.slider_container_item_card}
                  style={index % 2 === 1 ? { paddingTop: "10rem" } : {}}
                >
                  <Link to={`/projects/${project.id}`}  key={`${project.IdProject}-${index}`}>
                    <div className={styles.wrapper_container_item_card}>
                      <img
                        onMouseEnter={handleMouseHover}
                        onMouseLeave={handleMouseLeave}
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
                          e.target.src = notDataPhoto;
                          e.target.alt = "no Photo";
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
})

export default Header;

