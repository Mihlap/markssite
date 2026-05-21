import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';

import SwiperContainer from './Swiper-Phone/SwiperContainer';
import SwiperContainerProject from './Swiper-project/SwiperContainerProject';
import SliderHeader from '../UI/SliderHeader/SliderHeader';
import Mapbox3D from '../UI/Map3D/Mapbox3D';
import Error from '../Loading/Error/Error';
import BlockHeaderMain from '../UI/BlockHeader/BlockHeaderMain';

import { getFetchFormArticle } from '../store/Slice/articleSlice';
import { searchArticleLeftGet } from '../store/Slice/searchArticlePublicLeftSlice';
import { useFeaturedProjects } from '../hooks';
import { searchArticleRightGet } from '../store/Slice/searchArticlePublicRightSlice';

import styles from './Header.module.css';

import notDataPhoto from './img/notData.png';
import nameCompany from '../icons/nameCompany.svg';
// import nameCompany from '../icons/newYear.svg';
import nameCompany1 from '../icons/nameCompany1.svg';
// import nameCompany1 from '../icons/newYear1.svg';
import img123 from './img/Главная.png';
import mainIcon from '../icons/main.svg';

SwiperCore.use([Navigation]);

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Header = React.memo(
  ({ handleMouseEnter, handleMouseLeave, handleMouseHover, handleSpecialHover, setVideoLoaded }) => {
    const videoSource = {
      large: `${bucket_url}/images/video/main_company_full.mp4`,
      medium: `${bucket_url}/images/video/main_company_ipad.mp4`,
      small: `${bucket_url}/images/video/main_company_mobile.mp4`,
    };

    const [, setCurrentSlideIndex] = useState(0);
    const [videoSrc, setVideoSrc] = useState(null);
    const [isDesktopRewardsTitle, setIsDesktopRewardsTitle] = useState(window.innerWidth >= 1025);
    const sliderCardRef = useRef(null);

    const { error } = useSelector((state) => state.article);
    const dispatch = useDispatch();
    const articles = useSelector((state) => state.article.article);
    const { data: projects = [] } = useFeaturedProjects();
    const ArticleLeft = useSelector((state) => state.searchArticlePublicLeft.articleLeft);
    const ArticleRight = useSelector((state) => state.searchArticlePublicRight.articleRight);

    const MapArticle = ArticleLeft?.map((el) => el.publication.publication);
    const MapArticleRight = ArticleRight?.map((el) => el.publication.publication);

    const isMobile = window.innerWidth <= 767;
    const imageSrc = isMobile ? nameCompany1 : nameCompany;

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
      const handleResize = () => {
        const screenWidth = window.innerWidth;
        setIsDesktopRewardsTitle(screenWidth >= 1025);

        if (screenWidth >= 1025) {
          setVideoSrc(videoSource.large);
        } else if (screenWidth >= 768 && screenWidth <= 1024) {
          setVideoSrc(videoSource.medium);
        } else {
          setVideoSrc(videoSource.small);
        }
      };

      handleResize();
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [videoSource.large, videoSource.medium, videoSource.small]);

    useEffect(() => {
      dispatch(getFetchFormArticle());
      dispatch(searchArticleLeftGet());
      dispatch(searchArticleRightGet());
    }, [dispatch]);

    const colors = useMemo(
      () => ({
        Архитектура: '#FF7F6A',
        BIM: '#75BBFD',
        Конструкции: '#566272',
        Дизайн: '#FAA8BD',
        Инженерия: '#90B734',
      }),
      []
    );

    useEffect(() => {
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

        const isAtSliderBottom = documentScrollTop + windowHeight >= sliderBottom;

        if (isAtSliderBottom && e.deltaY > 0 && !isAtEndOfSlider) {
          e.preventDefault();
          el.scrollLeft += 80;
          scrollingToTopOfSlider = false;
        }

        if (e.deltaY < 0 && !isAtStartOfSlider) {
          if (scrollingToTopOfSlider || documentScrollTop < sliderTop) {
            e.preventDefault();
            el.scrollLeft -= 80;
            scrollingToTopOfSlider = true;
          }
        }

        if (isAtStartOfSlider && e.deltaY < 0 && scrollingToTopOfSlider) {
          scrollingToTopOfSlider = false;
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
          <Error error={error.message} />
        </div>
      );
    }

    const NewProject = projects.map((el) => (el && el.project !== undefined ? el.project : null));
    const MapProject = NewProject.map((el) => (el && el.project !== undefined ? el.project : null));
    const MapProjectToEdit = projects.map((el) => el.project);

    const combinedProjects = [...MapProject, ...MapProjectToEdit].filter(
      (project, index, self) => project && index === self.findIndex((p) => p && p.id === project.id)
    );
    const visibleProjects = combinedProjects.filter((project) => project?.id);

    const defaultImagePath = img123;

    return (
      <>
        <Helmet>
          <title>MARKS GROUP</title>
        </Helmet>
        <main className={styles.header}>
          <div className={styles.wrapper_nameCompanyMainHeader}>
            <div className={styles.block_video_company}>
              {videoSrc && (
                <video
                  playsInline
                  preload="metadata"
                  webkitplaysinline="true"
                  autoPlay
                  muted
                  loop
                  id="bg-video"
                  onCanPlayThrough={() => setVideoLoaded(true)}
                  className={styles.bg_video}>
                  <source src={videoSrc} type="video/mp4" />
                </video>
              )}
            </div>
            <div className={styles.heroBadge}>
              <img className={styles.mainIcon} src={mainIcon} alt="" aria-hidden="true" />
              <div className={styles.heroBadgeTextWrapper}>
                <span className={styles.heroBadgeText}>
                  <span className={styles.heroBadgeLine}>Лучший проектировщик</span>
                  <span className={styles.heroBadgeLine}>жилья в России</span>
                </span>
                <div className={styles.heroBadgeDivider} aria-hidden="true" />
                <span className={`${styles.heroBadgeText} ${styles.heroBadgeTextSingleLine}`}>BIM-компания года</span>
              </div>
            </div>
            <div className={styles.nameCompanyContainer}>
              <img src={imageSrc} alt={nameCompany} />
              <span className={styles.span_nameCompany}>ГЕНЕРАЛЬНОЕ ПРОЕКТИРОВАНИЕ</span>
              <span className={styles.span_nameCompany11}>ОТ КОНЦЕПЦИИ ДО ВВОДА ОБЪЕКТА В ЭКСПЛУАТАЦИЮ</span>
            </div>
          </div>

          <div className={styles.header_desctop_block}>
            <h1 className={styles.desctop_title}>
              {isDesktopRewardsTitle ? 'Награды и публикации' : 'Награды проектов'}
            </h1>
            <div className={styles.desctop_test}>
              Наша компания участвует в&nbsp;многочисленных выставках, конференциях
              <br className={styles.textBreak} />
              {" "}и&nbsp;конкурсах. Предлагаем ознакомиться с&nbsp;некоторыми докладами.
            </div>
          </div>

          <div className={styles.container_main}>
            <div
              onMouseEnter={handleSpecialHover}
              onMouseLeave={handleMouseLeave}
              className={styles.sliderHeader_container}>
              <NavLink to="/company#table-header-anchor">
                <SliderHeader isAwards={true} />
              </NavLink>
            </div>

            <div className={styles.swiper_container}>
              <SwiperContainer
                article1={articles.filter((article) => MapArticle.some((el) => el.id === article.id))}
                article2={articles.filter((article) => MapArticleRight.some((el) => el.id === article.id))}
              />
            </div>

            {/* Левый блок статей */}
            <div className={styles.card_container}>
              {articles && articles.length > 0 ? (
                <>
                  {articles
                    .slice()
                    .reverse()
                    .map((article) => {
                      const isArticleLeft = MapArticle.some((el) => el.id === article.id);
                      if (!isArticleLeft) return null;

                      const imagePathsForArticle = article.imageTitle
                        ? article.imageTitle.split(',').map((el) => el.trim())
                        : [];
                      const firstPhoto = imagePathsForArticle[0] || null;

                      const firstImagePath =
                        firstPhoto && firstPhoto.includes('https')
                          ? firstPhoto
                          : firstPhoto
                            ? `${bucket_url}/images/imageArticle/${encodeURIComponent(firstPhoto)}`
                            : defaultImagePath;

                      return (
                        <Link to={`/publication/${article.id}`} key={article.id}>
                          <div className={styles.card_item_1}>
                            <div className={styles.card_img}>
                              <img
                                onMouseEnter={handleMouseHover}
                                onMouseLeave={handleMouseLeave}
                                className={styles.img_1}
                                src={firstImagePath}
                                alt="photo1"
                                loading="lazy"
                              />
                            </div>
                            <div className={styles.card_text}>
                              <span className={styles.card_text_title}>{article.title}</span>
                            </div>
                            <div className={styles.wrapper_card_text_svg}>
                              <span className={styles.card_text_city}>{article.city}</span>
                              <span className={styles.card_text_svg}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="4"
                                  height="4"
                                  viewBox="0 0 4 4"
                                  fill="none">
                                  <circle cx="2" cy="2" r="2" fill="#566272" />
                                </svg>
                              </span>
                              <span className={styles.card_text_dataMonthYear}>{article.dataMonthYear}</span>
                            </div>
                            <button
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              className={styles.card_button}>
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg">
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
                    })}
                  {MapArticle.length === 0 && (
                    <div className={styles.card_item_1}>
                      <div className={styles.card_img}>
                        <img className={styles.img_1} src={defaultImagePath} alt="photo2" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.card_item_1}>
                  <div className={styles.card_img}>
                    <img className={styles.img_1} src={defaultImagePath} alt="photo2" />
                  </div>
                </div>
              )}

              {/* Правый блок статей */}
              {articles && articles.length > 0 ? (
                <>
                  {articles
                    .slice()
                    .reverse()
                    .map((article) => {
                      const isArticRight = MapArticleRight.some((el) => el.id === article.id);
                      if (!isArticRight) return null;

                      const imagePathsForArticleRight = article.imageTitle
                        ? article.imageTitle.split(',').map((el) => el.trim())
                        : [];
                      const firstPhotoRight = imagePathsForArticleRight[0] || null;

                      const firstImagePathRight =
                        firstPhotoRight && firstPhotoRight.includes('https')
                          ? firstPhotoRight
                          : firstPhotoRight
                            ? `${bucket_url}/images/imageArticle/${encodeURIComponent(firstPhotoRight)}`
                            : defaultImagePath;

                      return (
                        <Link to={`/publication/${article.id}`} key={article.id}>
                          <div className={styles.card_item_2}>
                            <div className={styles.card_img}>
                              <img
                                onMouseEnter={handleMouseHover}
                                onMouseLeave={handleMouseLeave}
                                className={styles.img_2}
                                src={firstImagePathRight}
                                alt="photo2"
                                loading="lazy"
                              />
                            </div>
                            <div className={styles.card_text}>
                              <span className={styles.card_text_title}>{article.title}</span>
                            </div>
                            <div className={styles.wrapper_card_text_svg}>
                              <span className={styles.card_text_city}>{article.city}</span>
                              <span className={styles.card_text_svg}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="4"
                                  height="4"
                                  viewBox="0 0 4 4"
                                  fill="none">
                                  <circle cx="2" cy="2" r="2" fill="#566272" />
                                </svg>
                              </span>
                              <span className={styles.card_text_dataMonthYear}>{article.dataMonthYear}</span>
                            </div>
                            <button
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              className={`${styles.card_button} ${styles.extra_button_class}`}>
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 32 32"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg">
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
                    })}
                  {MapArticleRight.length === 0 && (
                    <div className={styles.card_item_2}>
                      <div className={styles.card_img}>
                        <img className={styles.img_2} src={defaultImagePath} alt="photo2" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.card_item_2}>
                  <div className={styles.card_img}>
                    <img className={styles.img_2} src={defaultImagePath} alt="photo2" />
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
              <img className={styles.image_most} loading="lazy" src="./assets/most2.png" alt="" />
            </div>

            <div className={styles.block_header_maim_wrapper} id="blockHeaderMain">
              <BlockHeaderMain handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
            </div>

            <Mapbox3D />
          </div>

          <div className={styles.sliderMobile_container}>
            <SliderHeader />
          </div>

          <div id="projects" className={styles.project_name}>
            Проекты
          </div>

          <div className={styles.swiper_progect_container}>
            <SwiperContainerProject projects={projects} />
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
              touchRatio={0.3}
              freeMode={{
                momentumRatio: 0.5,
                momentumVelocityRatio: 0.3,
              }}
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
              }}>
              {visibleProjects.map((project, index) => {
                return (
                  <SwiperSlide
                    key={project.id}
                    id="slider_container_item_card"
                    className={`${styles.slider_container_item_card} ${index === 0 ? styles.slider_container_item_card_first : ''
                      }`}
                    style={index % 2 === 1 ? { paddingTop: '10rem' } : {}}>
                    <Link to={`/projects/${project.id}`}>
                      <div className={styles.wrapper_container_item_card}>
                        <img
                          onMouseEnter={handleMouseHover}
                          onMouseLeave={handleMouseLeave}
                          className={styles.container__imageTitle}
                          loading="lazy"
                          src={
                            project.imageProject?.includes('https')
                              ? project.imageProject
                              : `${bucket_url}/images/imageAdd/${project.imageProject ? project.imageProject : project.imageTitle
                              }`
                          }
                          alt={project.imageProject ? project.imageProject : project.imageTitle}
                          onError={(e) => {
                            e.target.src = notDataPhoto;
                            e.target.alt = 'no Photo';
                          }}
                        />
                      </div>
                      <div className={styles.wrapper_container_title_selectCompetencies}>
                        <div className={styles.container_wrapper_title_city_data_block}>
                          <div className={styles.container__title}>{project.title}</div>
                          <div className={styles.countryCity_monthYear}>
                            <div className={styles.container__countryCity}>{project.countryCity}</div>
                            <div className={styles.project__address__svg}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="2"
                                height="2"
                                viewBox="0 0 2 2"
                                fill="none">
                                <circle cx="1" cy="1" r="1" fill="#959DA6" />
                              </svg>{' '}
                            </div>
                            <div className={styles.container__monthYear}>{project.monthYear}</div>
                          </div>
                        </div>
                        <div className={styles.wrapper_container__selectCompetencies}>
                          <div className={styles.container__selectCompetencies}>
                            {(() => {
                              try {
                                const selectCompetencies = JSON.parse(project.selectCompetencies);
                                return selectCompetencies.map((competency) => (
                                  <div
                                    key={competency.value}
                                    className={styles.div_el_selectCompetencies}
                                    style={{
                                      color: colors[competency.value],
                                      borderColor: colors[competency.value],
                                      border: '1px solid',
                                      padding: '3px 6px',
                                      borderRadius: '34px',
                                    }}>
                                    {competency.label}
                                  </div>
                                ));
                              } catch (error) {
                                if (typeof project.selectCompetencies === 'string') {
                                  // одно значение без запятых
                                  if (!project.selectCompetencies.includes(',')) {
                                    const label = project.selectCompetencies.trim();
                                    return (
                                      <div
                                        key={label}
                                        className={styles.div_el_selectCompetencies}
                                        style={{
                                          color: colors[label],
                                          borderColor: colors[label],
                                          border: '1px solid',
                                          padding: '3px 6px',
                                          borderRadius: '34px',
                                        }}>
                                        {label}
                                      </div>
                                    );
                                  }
                                  // несколько значений через запятую
                                  if (project.selectCompetencies.includes(',')) {
                                    return project.selectCompetencies.split(',').map((value) => {
                                      const label = value.trim();
                                      return (
                                        <div
                                          key={value}
                                          className={styles.div_el_selectCompetencies}
                                          style={{
                                            color: colors[value],
                                            borderColor: colors[value],
                                            border: '1px solid',
                                            padding: '3px 6px',
                                            borderRadius: '34px',
                                          }}>
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
);

export default Header;
