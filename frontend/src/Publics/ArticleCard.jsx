import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import AllArticlesButton from '../UI/ButtonsArticles/AllArticlesButton';
import ArticleCardSlider from '../UI/ArticleCardSlider.jsx/ArticleCardSlider';
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

import next from ".././icons/next.svg";
import previous from ".././icons/previous.svg";
import SliderContainerProjectCard from '../UI/ProjectCardSlider/SliderContainerProjectCard';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Host = process.env.REACT_APP_SERVER_HOST;

const ArticleCard = () => {
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

  const refs = {
    title: useRef(null),
    city: useRef(null),
    author: useRef(null),
    blockLeft: useRef(null),
    blockRight: useRef(null),
    blockDescription: useRef(null),
    blockRightPhone: useRef(null),
    leftImg1: useRef(null),
    leftImg2: useRef(null),
    leftImg3: useRef(null),
    leftImg4: useRef(null),
  };

  const {
    title,
    city,
    author,
    blockLeft,
    blockRight,
    blockDescription,
    // blockRightPhone,
    leftImg1,
    leftImg2,
    leftImg3,
    leftImg4,
  } = refs;

  const elementsRight = [
    // blockRightPhone.current,
    blockDescription.current,
    blockLeft.current,
    blockRight.current,
    leftImg1.current,
    leftImg2.current,
    leftImg3.current,
    leftImg4.current,
  ];

  useEffect(() => {
    dispatch(getFetchFormArticle());
  }, [dispatch]);

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

  const currentIndex = articles.findIndex((p) => p.id === article.id);

  const previousIndex = (currentIndex - 1 + articles.length) % articles.length;
  const nextIndex = (currentIndex + 1) % articles.length;

  const previousArticle = articles[previousIndex];
  const nextArticle = articles[nextIndex];

  console.log(article, "===========================================");
  console.log(articles, "+++++++++++++++++++++++++++++++++++++++++");

  return (
    <div className={styles.main_article_card}>
    {article && <ArticleCardSlider slidesCard={[article]} />}
    <div className={styles.all_button_div}>
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
                    <div className={styles.cart_article__author__block__card}
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
                  {article.descriptionArticle}
                </div>
                <div className={styles.result_container}>
         
                </div>
              </div>
              <div
                ref={refs.blockRight}
                className={styles.header_content_right}
              >
                {/* <div className={styles.title_block_mobile}>
                 </div>
                <div className={styles.title_text_mobile}>
                  {article.descriptionProject}
                </div> */}
                <div className={styles.local_container_photo_author}>
                <img
                        className={styles.container__imageAuthor_articleCard}
                        src={`${Host}/images/imageArticle/${article.imageAuthor}`}
                        alt={article.imageAuthor}
                      />
                      <div className={styles.author_name}>{article.author}</div>
                      <div className={styles.text_author}>Автор статьи</div>
                </div>
              </div>
            </div>
            <div className={styles.blockImg}>
              <div className={styles.container}>
                <div className={styles.item}>
                  <img
                    ref={refs.leftImg1}
                    className={styles.item_img}
                    src={`${Host}/images/imageArticle/${article.imageOpen}`}
                    alt={article.imageOpen}
                  />
                </div>
                <div
                  ref={refs.blockDescription}
                  className={styles.description_object_container}
                >
                  <div className={styles.description_object_block}>
                    <div className={styles.description_object_title}>
                      {article.title}
                    </div>
                    <div className={styles.description_object_text1}>
                      {article.textBlock}
                    </div>
                  </div>
                </div>
                <div className={styles.item}>
                  {/* <img
                    ref={refs.leftImg2}
                    className={styles.item_img}
                    src={img2}
                    alt=""
                  /> */}
                </div>
                <div className={styles.item}>
                  {/* <img
                    ref={refs.leftImg3}
                    className={`${styles.item_img} ${styles.item_img_latest}`}
                    src={img3}
                    alt=""
                  /> */}
                </div>
                <div className={styles.item}>
                  {/* <img
                    ref={refs.leftImg4}
                    className={styles.item_img}
                    src={`${Host}/images/imageAdd/${project.imageClose}`}
                    alt={project.imageClose}
                  /> */}
                </div>
              </div>
            </div>
            <div className={styles.button_project_projectCard}>
              {previousArticle && (
                <Link
                  className={styles.button_project_link_projectCard}
                  to={`/publication/${previousArticle.id}`}
                >
                  <div className={styles.previous_svg_projectCard}>
                    <img src={previous} alt={previous} />
                    <span className={styles.previous__span_projectCard}>
                      {`${previousArticle.title}`}
                    </span>
                  </div>
                </Link>
              )}
              {nextArticle && (
                <Link
                  className={styles.button_project_link_projectCard}
                  to={`/publication/${nextArticle.id}`}
                >
                  <div className={styles.next_svg_projectCard}>
                    <span className={styles.next__span_projectCard}>
                      {`${nextArticle.title}`}
                    </span>
                    <img src={next} alt={next} />
                  </div>
                </Link>
              )}
            </div>
            <div id="projects" className={styles.social_links_projectCard}>
            <button onClick={() => shareToVK(article, Host)}>
                <span
                  className={styles.social_links_item}
                  style={{ marginRight: "21px", color: "#FF7F6A" }}
                >
                  VK
                </span>
              </button>
              <button onClick={() => shareToWhatsApp(article, Host)}>
                <span
                  className={styles.social_links_item}
                  style={{ marginRight: "25px", color: "#FF7F6A" }}
                >
                  WA
                </span>
              </button>
              <button onClick={() => shareToViber(article, Host)}>
                <span
                  className={styles.social_links_item}
                  style={{ marginRight: "22px", color: "#FF7F6A" }}
                >
                  VB
                </span>
              </button>
              <button onClick={() => shareToTelegram(article, Host)}>
                <span
                  className={styles.social_links_item}
                  style={{ color: "#FF7F6A" }}
                >
                  TG
                </span>
              </button>
            </div>
            <div className={styles.share_project}>Поделиться проектом</div>
          </div>
        )}
        <div className={styles.project_name_text}>Ещё по теме</div>
        <div className={styles.swiper_progect_container}>
          {/* <SwiperContainerProgect projects={projects} /> */}
        </div>
         <div className={styles.main_project_projectCard}>
          <Swiper
            className={styles.slider_card_container_project_projectCard}
            id="slider_card_container_project"
            ref={sliderArticleCardRef}
            spaceBetween={30}
            touch="true"
            direction="horizontal"
            loop={false}
            breakpoints={{
              2000: {
                slidesPerView: 4.1,
              },
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
            {articles?.map((project, index) => {
              if (!project) {
                return null;
              }

              return (
                <SwiperSlide
                  key={project.id}
                  onScroll={handleScroll}
                  id="slider_container_item_card"
                  className={styles.slider_container_item_card_projectCard}
                  style={index % 2 === 1 ? { paddingTop: "10rem" } : {}}
                >
                  <Link to={`/projects/${project.id}`} key={project.id}>
                    <div
                      className={styles.wrapper_container_item_card_projectCard}
                    >
                      <img
                        className={styles.container__imageTitle_projectCard}
                        style={{
                          height: `${project.style?.split(",")[1]}rem`,
                          width: `${project.style?.split(",")[0]}rem`,
                        }}
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
                    <div
                      className={styles.title_selectCompetencies_projectCard}
                    >
                      <div className={styles.container__title_projectCard}>
                        {project.title}
                      </div>
                      {/* <div
                        className={
                          styles.container__selectCompetencies_projectCard
                        }
                      >
                        {(() => {
                          try {
                            const selectCompetencies = JSON.parse(
                              project.selectCompetencies
                            );
                            return selectCompetencies.map((competency) => (
                              <div
                                key={competency.value}
                                className={
                                  styles.div_el_selectCompetencies_projectCard
                                }
                                style={{
                                  color: colors[competency.value],
                                  borderColor: colors[competency.value],
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
                                const label = project.selectCompetencies.trim();
                                return (
                                  <div
                                    key={label}
                                    className={
                                      styles.div_el_selectCompetencies_projectCard
                                    }
                                    style={{
                                      color: colors[label],
                                      borderColor: colors[label],
                                    }}
                                  >
                                    {label}
                                  </div>
                                );
                              }
                              // Строка с несколькими значениями, разделенными запятыми
                              else {
                                return project.selectCompetencies
                                  .split(",")
                                  .map((value) => {
                                    const label = value.trim();
                                    return (
                                      <div
                                        key={value}
                                        className={
                                          styles.div_el_selectCompetencies_projectCard
                                        }
                                        style={{
                                          color: colors[value],
                                          borderColor: colors[value],
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
                      </div> */}
                    </div>
                    <div className={styles.countryCity_monthYear_projectCard}>
                      <div
                        className={styles.container__countryCity_projectCard}
                      >
                        {project.countryCity}
                      </div>
                      <div
                        className={
                          styles.cart_project__address__svg_projectCard
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
                      <div className={styles.container__monthYear_projectCard}>
                        {project.monthYear}
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className={styles.project_container_projectCard_sliderMobile}>
        <SliderContainerProjectCard articles={articles} />
      </div>
      
    // </div>
  )
}

export default ArticleCard;