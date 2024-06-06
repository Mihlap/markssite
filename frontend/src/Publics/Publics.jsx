import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Swiper, SwiperSlide } from "swiper/react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFetchFormArticle,
  setSelectedType,
} from "../store/Slice/articleSlice";
import styles from "./Publics.module.css";
import { fetchToggleStateForButton2Async } from "../store/Slice/toggleSlice";
import catPhoto from "../img/default-photo.jpeg";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function Publics({ handleMouseEnter, handleMouseLeave, handleMouseHover }) {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state.article.article);
  const isActive = useSelector((state) => state.toggle.isActiveForButton2);

  const [selectArticle, setSelectArticle] = useState("Все");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [swiper, setSwiper] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);

  const videoSource = useMemo(() => ({
    small: `${Host}/videos/public_mob.mp4`,
    medium: `${Host}/videos/public_ipad.mp4`,
    large: `${Host}/videos/public_full.mp4`,
  }), []);
  
  const buttonChoose1 = useMemo(() => [
    "Все",
    "Выступления",
    "Интервью",
    "Новости",
    "Статьи",
    "Научные публикации",
  ], []);

  useEffect(() => {
    window.scrollTo(0, 0); // Прокрутите страницу вверх при монтировании компонента
  }, []);

  const handleResize = useCallback(() => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1025) {
      setVideoSrc(videoSource.large);
    } else if (screenWidth >= 768 && screenWidth < 1025) {
      setVideoSrc(videoSource.medium);
    } else {
      setVideoSrc(videoSource.medium);
    }
  }, [videoSource]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    dispatch(getFetchFormArticle());
    dispatch(fetchToggleStateForButton2Async());
  }, [dispatch]);

  const handleButtonClick = useCallback((selected) => {
    if (selected === "Все") {
      setSelectArticle(selected);
      dispatch(setSelectedType(selected));
      dispatch(getFetchFormArticle());
    } else {
      if (selected !== selectArticle) {
        setSelectArticle(selected);
        dispatch(setSelectedType(selected));
        dispatch(getFetchFormArticle());
      }
    }
  }, [dispatch, selectArticle]);

  // console.log(articles, "+++++++++++++++++++++++++++++++++++++++++++++");
  return (
    <>
      <Helmet>
        <title>Marks Group</title>
      </Helmet>
      <div className={styles.public_container_main}>
        <div className={styles.public_image_header}>
          {videoSrc && (
            <video
              playsInline
              autoPlay
              muted
              loop
              id="bg-video"
              className={styles.bg_video}
            >
              <source src={videoSrc} type="video/mp4" preload="auto" />
            </video>
          )}
          <div className={styles.text_container_publics}>
            <span className={styles.text1_publics}>
              Научные достижения, интервью и&nbsp;статьи ведущих
              профессиональных и&nbsp;публицистических изданий
            </span>
            <span className={styles.text2_publics}>Публикации</span>
          </div>
        </div>
        {!isActive && (
          <div className={styles.menu_button_group_articles_wrapper_main}>
            <div className={styles.menu_button_group_articles_wrapper}>
              <div className={styles.menu_button_group_articles}>
                {buttonChoose1.map((el, index) => (
                  <div key={index} className={styles.button_wrapper_articles}>
                    <button
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className={
                        el === selectArticle
                          ? styles.menu__button__allArticles_active
                          : styles.menu__button__allArticles
                      }
                      onClick={() => handleButtonClick(el)}
                    >
                      <p className={styles.menu_button_item__allArticles}>
                        {el}
                      </p>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className={styles.menu_button_group_articles1}>
          {screenWidth && (
            <Swiper
              onSwiper={setSwiper}
              slidesPerView="auto"
              spaceBetween={8}
              className={styles.my_swiper3_button_group_article}
              touch="true"
            >
              <div className={styles.button_group_article}>
                {buttonChoose1 &&
                  buttonChoose1?.map((el) => (
                    <SwiperSlide
                      key={el}
                      onClick={() => handleButtonClick(el)}
                      className={`${styles.menu__button__allArticles} ${
                        el === selectArticle ? styles.active : ""
                      }`}
                      style={{ width: "fit-content" }}
                    >
                      <p
                        type="button"
                        className={styles.menu_button_item__allArticles}
                      >
                        {el}
                      </p>
                    </SwiperSlide>
                  ))}
              </div>
            </Swiper>
          )}
        </div>
        <section className={styles.section_article}>
          <div className={styles.section_article__block}>
            {articles &&
              articles?.slice().map((article) => {
                const imagePathsForArticle = article?.imageTitle
                  ? article?.imageTitle.split(",").map((el) => el.trim())
                  : [];

                const firstImageName = imagePathsForArticle[0] || null;
                const encodedFileName = firstImageName
                  ? encodeURIComponent(firstImageName)
                  : null;
                const defaultImagePath = catPhoto;
                const firstImagePath = encodedFileName
                  ? `${Host}/images/imageArticle/${encodedFileName}`
                  : defaultImagePath;
                return (
                  <Link
                    key={article.id}
                    to={`/publication/${article.id}`}
                    className={styles.section_article__block_cart}
                  >
                    <div className={styles.cart_article}>
                      <div className={styles.cart_article__container}>
                        <img
                          className={styles.cart_article__img}
                          src={firstImagePath}
                          alt={article.imageTitle || "Default Alt Text"}
                          onMouseEnter={handleMouseHover}
                          onMouseLeave={handleMouseLeave}
                        />
                        <div className={styles.article_content__wrapper}>
                          <div className={styles.cart_article_title}>
                            {article.title}
                          </div>
                          <div className={styles.cart_article__content}></div>
                        </div>
                        <div className={styles.cart_article__address}>
                          {article.city}{" "}
                          <div className={styles.cart_article__address__svg}>
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
                          {article.dataMonthYear}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </section>
      </div>
    </>
  );
}
