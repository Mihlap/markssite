import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import AllArticlesButton from "../UI/ButtonsArticles/AllArticlesButton";
import ArticleCardSlider from "../UI/ArticleCardSlider.jsx/ArticleCardSlider";
import SliderContainerArticleCard from "../UI/Project&ArticleCardSlider/SlideContainerArticleCard";
import { getFetchFormArticle } from "../store/Slice/articleSlice";
import {
  handleScroll,
  onVerticalScroll,
  onWheel,
  shareToVK,
  shareToTelegram,
  shareToWhatsApp,
  shareToViber,
} from "../Project/utils";
import styles from "./ArticleCard.module.css";
import catPhoto from "../img/default-photo.jpeg";

import next from ".././icons/next.svg";
import previous from ".././icons/previous.svg";
import ConstructorBlockRenderer from "./ConstructorArticle/ConstructorBlockRender";
import { containsListTags } from "../Project/utils";
import { renderListWithDots } from "../Project/utils";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Host = process.env.REACT_APP_SERVER_HOST;

const ArticleCard = ({
  handleMouseEnter,
  handleMouseLeave,
  handleMouseHover,
}) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const sliderArticleCardRef = useRef(null);
  const slidesCard = useSelector((state) => state.article.article);
  const article = slidesCard.find((item) => item.id === parseInt(`${id}`));
  const articles = useSelector((state) => state.article.article);

  const [enableVerticalScroll, setEnableVerticalScroll] = useState(true);
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false);
  const [isAtRightEdge, setIsAtRightEdge] = useState(false);
  const [scrollingMode, setScrollingMode] = useState("vertical");

  const isMobile = window.innerWidth <= 767;

  const refs = {
    title: useRef(null),
    city: useRef(null),
    author: useRef(null),
    blockLeft: useRef(null),
    blockRight: useRef(null),
    frameBlock: useRef(null),
    blockHeadingTitle: useRef(null),
    imageToDescriptionArticle: useRef(null),
    imageClose: useRef(null),
    address_imageClose: useRef(null),
    blockDescription: useRef(null),
    quoteBlockLeft: useRef(null),
    quoteBlockRight: useRef(null),
    blockRightPhone: useRef(null),
    constructorBlock: useRef(null),
    // leftImg1: useRef(null),
    // leftImg2: useRef(null),
    // leftImg3: useRef(null),
    // leftImg4: useRef(null),
  };

  const {
    title,
    city,
    author,
    blockLeft,
    blockRight,
    blockDescription,
    quoteBlockLeft,
    quoteBlockRight,
    frameBlock,
    blockHeadingTitle,
    imageToDescriptionArticle,
    imageClose,
    address_imageClose,
    constructorBlock,
    // blockRightPhone,
    // leftImg1,
    // leftImg2,
    // leftImg3,
    // leftImg4,
  } = refs;

  const elementsRight = [
    // blockRightPhone.current,
    blockDescription.current,
    quoteBlockLeft.current,
    quoteBlockRight.current,
    frameBlock.current,
    blockHeadingTitle.current,
    imageToDescriptionArticle.current,
    imageClose.current,
    address_imageClose.current,
    blockLeft.current,
    blockRight.current,
    constructorBlock.current,
    // leftImg1.current,
    // leftImg2.current,
    // leftImg3.current,
    // leftImg4.current,
  ];

  useEffect(() => {
    window.scrollTo(20, 0);

    // Скрываем заголовок, ссылку и описание перед анимацией
    if (title.current && city.current) {
      gsap.set([title.current, city.current], { opacity: 0 });
    }

    // Анимируем появление заголовка, затем ссылки, затем описания
    gsap?.to(title?.current, { duration: 1, opacity: 1, delay: 0.5 });
    gsap.to(author?.current, { duration: 1, opacity: 1, delay: 1 });
    gsap?.to(city?.current, { duration: 1, opacity: 1, delay: 0.7 });

    const animateElement = (element) => {
      if (element) {
        gsap.from(element, {
          x: "-100%",
          opacity: 0,
          duration: 1.5,
          delay: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: element,
          },
        });
      }
      gsap.from(element, { duration: 1, clipPath: { start: "110%" } });
    };

    elementsRight.forEach(animateElement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = sliderArticleCardRef.current;
    if (el) {
      el.addEventListener(
        "wheel",
        (e) => onVerticalScroll(el, e, setEnableVerticalScroll),
        { passive: false }
      );
      el.addEventListener(
        "wheel",
        (e) =>
          onWheel(
            el,
            e,
            enableVerticalScroll,
            isHorizontalScroll,
            setIsHorizontalScroll
          ),
        { passive: false }
      );
      el.addEventListener("scroll", () =>
        handleScroll(
          el,
          articles,
          setEnableVerticalScroll,
          setIsHorizontalScroll,
          setIsAtRightEdge
        )
      );
      return () => {
        el.removeEventListener("wheel", (e) =>
          onVerticalScroll(el, e, setEnableVerticalScroll)
        );
        el.removeEventListener("wheel", (e) =>
          onWheel(
            el,
            e,
            enableVerticalScroll,
            isHorizontalScroll,
            setIsHorizontalScroll
          )
        );
        el.removeEventListener("scroll", () =>
          handleScroll(
            el,
            articles,
            setEnableVerticalScroll,
            setIsHorizontalScroll,
            setIsAtRightEdge
          )
        );
      };
    }
  }, [scrollingMode]);

  useEffect(() => {
    dispatch(getFetchFormArticle());
  }, [dispatch]);

  const currentIndex = articles.findIndex((p) => p.id === article.id);

  const previousIndex = (currentIndex - 1 + articles.length) % articles.length;
  const nextIndex = (currentIndex + 1) % articles.length;

  const previousArticle = articles[previousIndex];
  const nextArticle = articles[nextIndex];
  const userSelectedBlocks = article?.ConstructorArticles?.map((el) => el.data);

  const imageOpenSource =
  article && article.imageOpen
    ? `${Host}/images/imageArticle/${article.imageOpen}`
    : catPhoto;
  const altTextOpen = (article && article.imageOpen) || "Default Alt Text";
  const imageCloseSource =
  article && article.imageClose
      ? `${Host}/images/imageArticle/${article.imageClose}`
      : catPhoto;
  const altTextClose = (article && article.imageClose) || "Default Alt Text";


  // Получаем 20 рандомных статей
  const randomArticles = articles
  ? [...articles].sort(() => 0.5 - Math.random()).slice(0, 20)
  : [];

  return (
    <>
      <Helmet>
        <title>{article ? article.title : "Marks Group"}</title>
        <meta
          property="og:image"
          content={
            article ? `${Host}/images/imageArticle/${article.imageOpen}` : ""
          }
        />
      </Helmet>
      <div className={styles.main_article_card}>
        {article && <ArticleCardSlider slidesCard={[article]} />}
        <div
          className={styles.all_button_div}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <AllArticlesButton />
        </div>
        <div className={styles.section_article__block__card}>
          {article && (
            <div className={styles.cart_article__block__card}>
              <div className={styles.cart_article__container__block__card}>
                <div className={styles.article_content__wrapper__block__card}>
                  <div className={styles.cart_article__content__block__card}>
                    <div
                      className={styles.cart_article_title__block__card}
                      ref={refs.title}
                    >
                      {article.title}
                    </div>
                  </div>
                </div>
                <div
                  className={styles.cart_article__author__block__card}
                  ref={refs.author}
                >
                  {article.author}
                </div>
                <div
                  className={styles.cart_article__address__block__card}
                  ref={refs.city}
                >
                  {article.city}{" "}
                  <div
                    className={styles.cart_article__address__svg__block__card}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2"
                      height="2"
                      viewBox="0 0 2 2"
                      fill="none"
                    >
                      <circle cx="1" cy="1" r="1" fill="#F6F6F6" />
                    </svg>{" "}
                  </div>
                  {article.dataMonthYear}
                </div>
              </div>
            </div>
          )}
        </div>
        {article && (
          <div className={styles.container}>
            <div className={styles.header_content}>
              <div ref={refs.blockLeft} className={styles.header_content_left}>
                <div className={styles.title_block}>
                  <div className={styles.left_title}>
                    {article.titleTextBlock}
                  </div>
                </div>
                <div className={styles.title_text}>
                  {containsListTags(article.descriptionArticle) ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderListWithDots(article.descriptionArticle),
                      }}
                    />
                  ) : (
                    <div
                    dangerouslySetInnerHTML={{
                      __html: renderListWithDots(article.descriptionArticle),
                    }}
                  />
                  )}
                </div>
                <div className={styles.result_container}></div>
              </div>
              {article && article.imageAuthor ? (
                <div
                  ref={refs.blockRight}
                  className={styles.header_content_right}
                >
                  <div className={styles.local_container_photo_author}>
                    <img
                      className={styles.container__imageAuthor_articleCard}
                      src={
                        article.imageAuthor
                          ? `${Host}/images/imageArticle/${article.imageAuthor}`
                          : `${catPhoto}`
                      }
                      alt={article.imageAuthor || "Default Alt Text"}
                    />
                    <div className={styles.author_name}>{article.author}</div>
                    <div className={styles.text_author}>Автор статьи</div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className={styles.blockImg}>
              <div className={styles.container}>
                <div className={styles.item} ref={refs.leftImg1}>
                  <img
                    className={styles.item_img}
                    src={imageOpenSource}
                    alt=""
                    loading="lazy"
                    // src={
                    //   article && article.imageOpen
                    //     ? `${Host}/images/imageArticle/${article.imageOpen}`
                    //     : `${catPhoto}`
                    // }
                    // alt={
                    //   article && article.imageOpen
                    //     ? article.imageOpen
                    //     : "Default Alt Text"
                    // }
                  />
                  <div className={styles.leftImg1_object_text1}>
                    {/* {article.textBlock} */}
                    {containsListTags(article.textBlock) ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderListWithDots(article.textBlock),
                      }}
                    />
                  ) : (
                    <div
                    dangerouslySetInnerHTML={{
                      __html: renderListWithDots(article.textBlock),
                    }}
                  />
                  )}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.div_conteiner} ref={refs.constructorBlock}>
              {userSelectedBlocks?.map((innerBlocks, outerIndex) => (
                <div key={outerIndex}>
                  {innerBlocks?.map((block, innerIndex) => (
                    <ConstructorBlockRenderer
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      key={innerIndex}
                      block={block}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div
              className={styles.item_container_imageClose}
              ref={refs.imageClose}
            >
              <div className={styles.item}>
                <img
                  className={styles.item_img_close}
                  src={imageCloseSource}
                    alt=""
                    loading="lazy"
                  // src={
                  //   article && article.imageClose
                  //     ? `${Host}/images/imageArticle/${article.imageClose}`
                  //     : `${catPhoto}`
                  // }
                  // alt={
                  //   article && article.imageClose
                  //     ? article.imageClose
                  //     : "Default Alt Text"
                  // }
                 />
              </div>
            </div>
            <div
              className={
                styles.container_author_address_imageClose_share_article
              }
            >
              <div
                className={styles.container_author_address_imageClose}
                ref={refs.address_imageClose}
              >
                {/* <img
                  className={styles.item_img}
                  src={`${Host}/images/imageArticle/${article.imageClose}`}
                  alt={article.imageClose}
                /> */}
                <div
                  className={
                    styles.cart_article__author__block__card_imageClose
                  }
                >
                  {article.author}
                </div>
                <div
                  className={
                    styles.cart_article__address__block__card_imageClose
                  }
                >
                  {article.city}{" "}
                  <div
                    className={
                      styles.cart_article__address__svg__block__card_imageClose
                    }
                  >
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
              <div className={styles.share_article}>Поделиться статьей</div>
            </div>
            <div id="articles" className={styles.social_links_articleCard}>
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => shareToVK(article, Host)}
              >
                <span
                  className={styles.social_links_item}
                  style={{ marginRight: "21px", color: "#FF7F6A" }}
                >
                  VK
                </span>
              </button>
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => shareToWhatsApp(article, Host)}
              >
                <span
                  className={styles.social_links_item}
                  style={{ marginRight: "25px", color: "#FF7F6A" }}
                >
                  WA
                </span>
              </button>
              {/* <button onClick={() => shareToViber(article, Host)}>
              <span
                className={styles.social_links_item}
                style={{ marginRight: "22px", color: "#FF7F6A" }}
              >
                VB
              </span>
            </button> */}
              <button
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => shareToTelegram(article, Host)}
              >
                <span
                  className={styles.social_links_item}
                  style={{ color: "#FF7F6A" }}
                >
                  TG
                </span>
              </button>
            </div>
          </div>
        )}
        <div className={styles.button_article_articleCard}>
          {previousArticle && (
            <Link
              className={styles.button_article_link_articleCard1}
              to={`/publication/${previousArticle.id}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.previous_svg_articleCard}>
                <img src={previous} alt={previous} />
                <span className={styles.previous__span_articleCard}>
                  {isMobile ? "Предыдущая статья" : `${previousArticle.title}`}
                </span>
              </div>
            </Link>
          )}
          {nextArticle && (
            <Link
              className={styles.button_article_link_articleCard2}
              to={`/publication/${nextArticle.id}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className={styles.next_svg_articleCard}>
                <span className={styles.next__span_articleCard}>
                  {isMobile ? "Следующая статья" : `${nextArticle.title}`}
                </span>
                <img src={next} alt={next} />
              </div>
            </Link>
          )}
        </div>
        <div className={styles.article_name_text}>Ещё по теме</div>
        <div className={styles.swiper_article_container}>
          {/* <SwiperContainerProgect projects={projects} /> */}
        </div>
        <div className={styles.main_article_articleCard}>
          <Swiper
            className={styles.slider_card_container_article_articleCard}
            id="slider_card_container_article"
            ref={sliderArticleCardRef}
            spaceBetween={30}
            touch="true"
            direction="horizontal"
            loop={true}
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
            {randomArticles?.map((article, index) => {
              if (!article) {
                return null;
              }

              const imagePathsForArticle = article.imageTitle
                ? article.imageTitle.split(",").map((el) => el.trim())
                : [];
              const firstImageName = imagePathsForArticle[0] || null;

              const encodedFileName = firstImageName
                ? encodeURIComponent(firstImageName)
                : null;
              const defaultImagePath = `${catPhoto}`; // Путь к запасному изображению.
              const firstImagePath = encodedFileName
                ? `${Host}/images/imageArticle/${encodedFileName}`
                : defaultImagePath;

              return (
                <SwiperSlide
                  key={article.id}
                  onScroll={handleScroll}
                  id="slider_container_item_card"
                  className={styles.slider_container_item_card_articleCard}
                  style={index % 2 === 1 ? { paddingTop: "10rem" } : {}}
                >
                  <Link to={`/publication/${article.id}`} key={article.id}>
                    <div
                      className={styles.wrapper_container_item_card_articleCard}
                    >
                      <img
                        className={styles.container__imageTitle_articleCard}
                        src={firstImagePath}
                        alt={firstImagePath}
                        onMouseEnter={handleMouseHover}
                        onMouseLeave={handleMouseLeave}
                      />
                    </div>
                    <div className={styles.title_articleCard}>
                      <div className={styles.container__title_articleCard}>
                        {article.title}
                      </div>
                    </div>
                    <div className={styles.countryCity_monthYear_articleCard}>
                      <div
                        className={styles.container__countryCity_articleCard}
                      >
                        {article.city}{" "}
                      </div>
                      <div
                        className={
                          styles.cart_article__address__svg_articleCard
                        }
                      >
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
                      <div className={styles.container__monthYear_articleCard}>
                        {article.dataMonthYear}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className={styles.article_container_articleCard_sliderMobile}>
          <SliderContainerArticleCard articles={randomArticles} />
        </div>{" "}
      </div>
    </>
  );
};

export default ArticleCard;
