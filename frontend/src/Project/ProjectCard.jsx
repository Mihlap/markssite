import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import ProjectCardSlider from "../UI/Project&ArticleCardSlider/ProjectCardSlider";
import styles from "./ProjectCard.module.css";
import { getFetchForm } from "../store/Slice/projectSlice";
import SliderContainerProjectCard from "../UI/Project&ArticleCardSlider/SliderContainerProjectCard";
import AllProjectsButton from "../UI/ButtonsProjects/AllProjectsButton";
import {
  handleScroll,
  onVerticalScroll,
  onWheel,
  shareToVK,
  shareToTelegram,
  shareToWhatsApp,
  shareToViber,
} from "./utils";
import catPhoto from "../img/cat_954.jpeg";

import next from ".././icons/next.svg";
import previous from ".././icons/previous.svg";
import ConstructorBlockRenderer from "./ConstructorProject/ConstructorBlockRenderer";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Host = process.env.REACT_APP_SERVER_HOST;

const ProjectCard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const sliderCardRef = useRef(null);
  const slidesCard = useSelector((state) => state.project.projects);
  const project = slidesCard.find((item) => item.id === parseInt(`${id}`));
  const projects = useSelector((state) => state.project.projects);

  const [enableVerticalScroll, setEnableVerticalScroll] = useState(true);
  const [isHorizontalScroll, setIsHorizontalScroll] = useState(false);
  const [isAtRightEdge, setIsAtRightEdge] = useState(false);
  const [scrollingMode, setScrollingMode] = useState("vertical");

  const refs = {
    title: useRef(null),
    address: useRef(null),
    selectCompetencies: useRef(null),
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
    address,
    selectCompetencies,
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
    dispatch(getFetchForm());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(20, 0);

    // Скрываем заголовок, ссылку и описание перед анимацией
    if (title.current && address.current) {
      gsap.set([title.current, address.current], { opacity: 0 });
    }

    // Анимируем появление заголовка, затем ссылки, затем описания
    gsap?.to(title?.current, { duration: 1, opacity: 1, delay: 0.5 });
    gsap.to(selectCompetencies?.current, { duration: 1, opacity: 1, delay: 1 });
    gsap?.to(address?.current, { duration: 1, opacity: 1, delay: 0.7 });

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
      gsap.from(element, { duration: 1, clipPath: { start: "100%" } });
    };

    elementsRight.forEach(animateElement);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const colors = {
    Архитектура: "#FF7F6A",
    BIM: "#75BBFD",
    Конструкции: "#566272",
    Дизайн: "#FAA8BD",
    Инженерия: "#90B734",
  };

  useEffect(() => {
    const el = sliderCardRef.current;
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
          projects,
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
            projects,
            setEnableVerticalScroll,
            setIsHorizontalScroll,
            setIsAtRightEdge
          )
        );
      };
    }
  }, [scrollingMode]);

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const previousIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;
  const previousProject = projects[previousIndex];
  const nextProject = projects[nextIndex];
  const firstValue = (projects[0]?.viewConstruction ?? "").split(",")[0];
  const userSelectedBlocks = project?.Constructors?.map((el) => el.data);
  const imageOpenSource =
    project && project.imageOpen
      ? `${Host}/images/imageAdd/${project.imageOpen}`
      : catPhoto;
  const altTextOpen = (project && project.imageOpen) || "Default Alt Text";
  const imageCloseSource =
    project && project.imageClose
      ? `${Host}/images/imageAdd/${project.imageClose}`
      : catPhoto;
  const altTextClose = (project && project.imageClose) || "Default Alt Text";

  const imageSrc =
    project?.imageProject || project?.imageTitle
      ? `${Host}/images/imageAdd/${
          project?.imageProject || project?.imageTitle
        }`
      : catPhoto;

  const altText =
    project?.imageProject || project?.imageTitle || "Default Alt Text";

    // const randomProjects = projects.slice().sort(() => Math.random() - 0.5).slice(0, 20);

  //  console.log(project, "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
  // console.log(userSelectedBlocks, "<<--- userSelectedBlocks");

  // console.log('Host:', Host);
  // console.log('project.imageProject:', project.imageProject);
  
  return (
    <>
      <Helmet>
        <title>{project ? project.title : "Marks Group"}</title>
        <meta
          property="og:image"
          content={
            project ? `${Host}/images/imageAdd/${project.imageProject}` : ""
          }
        />
      </Helmet>
      <div className={styles.main_project_card}>
        {project && <ProjectCardSlider slidesCard={[project]} />}
        <div className={styles.all_button_div}>
          <AllProjectsButton />
        </div>
        <div className={styles.section_project__block__card}>
          {project && (
            <div className={styles.cart_project__block__card}>
              <div className={styles.cart_project__container__block__card}>
                <div className={styles.project_content__wrapper__block__card}>
                  <div className={styles.cart_project__content__block__card}>
                    <div className={styles.cart_project__widget__block__card}>
                      {(() => {
                        try {
                          const selectCompetencies = JSON.parse(
                            project.selectCompetencies
                          );
                          return selectCompetencies.map((competency) => (
                            <div
                              key={competency.value}
                              className={
                                styles.el_project_selectCompetencies__block__card
                              }
                              style={{
                                // color: colors[competency.value],
                                // borderColor: colors[competency.value],
                                border: "1px solid",
                                padding: "3px 6px",
                                borderRadius: "34px",
                              }}
                            >
                              {competency.label}
                            </div>
                          ));
                        } catch (error) {
                          if (typeof project.selectCompetencies === "string") {
                            // Если строка с одним значением и без запятых
                            if (!project.selectCompetencies.includes(",")) {
                              const label = project.selectCompetencies.trim();
                              return (
                                <div
                                  key={label}
                                  className={
                                    styles.el_project_selectCompetencies__block__card
                                  }
                                  style={{
                                    // color: colors[label],
                                    // borderColor: colors[label],
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
                            else {
                              return project.selectCompetencies
                                .split(",")
                                .map((value) => {
                                  const label = value.trim();
                                  return (
                                    <div
                                      key={value}
                                      className={
                                        styles.el_project_selectCompetencies__block__card
                                      }
                                      style={{
                                        // color: colors[value],
                                        // borderColor: colors[value],
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
                    <div
                      className={styles.cart_project_title__block__card}
                      ref={refs.title}
                    >
                      {project.title}
                    </div>
                  </div>
                </div>
                <div
                  className={styles.cart_project__address__block__card}
                  ref={refs.address}
                >
                  {project.countryCity}{" "}
                  <div
                    className={styles.cart_project__address__svg__block__card}
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
                  {project.monthYear}
                </div>
              </div>
            </div>
          )}
        </div>
        {project && (
          <div className={styles.container}>
            <div className={styles.header_content}>
              <div ref={refs.blockLeft} className={styles.header_content_left}>
                <div className={styles.title_block}>
                  <div className={styles.left_title}>
                    {project.titleTextBlock}
                    <div
                      className={`${styles.left_meta} ${styles.left_meta_castom}`}
                    >
                      {project.degreeParticipation}
                    </div>
                  </div>
                </div>
                <div className={styles.title_text}>
                  {project.descriptionProject}
                </div>

                <div className={styles.result_container}>
                  {[
                    {
                      value: project.siteArea,
                      text: "Общая площадь",
                      unit: "м²",
                    },
                    {
                      value: project.totalArea,
                      text: "Площадь участка",
                      unit: "га",
                    },
                    { value: project.floors, text: "Этажность" }, // Если у какого-то поля нет единицы измерения, просто опустите 'unit'
                    { value: project.altitude, text: "Высотность", unit: "м" },
                    {
                      value: project.constructionVolume,
                      text: "Строительный объем",
                      unit: "м³",
                    },
                    {
                      value: project.constructionVolume,
                      text: "Количество полос",
                    },
                    {
                      value: project.constructionVolume,
                      text: "Строительный объем",
                      unit: "км",
                    },
                  ]
                    .filter((item) => item.value) // фильтрация по наличию значения
                    .slice(0, 3) // берём первые три объекта
                    .map((item) => (
                      <div key={item.text} className={styles.result_block}>
                        <div className={styles.result_number}>
                          {item.value}{" "}
                          {item.unit ? <span>{item.unit}</span> : null}
                        </div>
                        <div className={styles.result_text}>{item.text}</div>
                      </div>
                    ))}
                </div>
              </div>
              <div
                ref={refs.blockRight}
                className={styles.header_content_right}
              >
                <div className={styles.title_block_mobile}>
                  <div className={styles.left_title}>
                    {project.titleTextBlock}
                    <div
                      className={`${styles.left_meta} ${styles.left_meta_castom}`}
                    >
                      {firstValue}
                    </div>
                  </div>
                </div>
                <div className={styles.title_text_mobile}>
                  {project.descriptionProject}
                </div>
                <div className={styles.local_container}>
                  <div className={styles.local_ritgh}>
                    <div>
                      <div className={styles.local_title}>Расположение</div>
                      <div className={styles.local_text}>
                        {project.location}
                      </div>
                    </div>
                    <div>
                      <div className={styles.local_title}>Статус</div>
                      <div className={styles.local_text}>
                        {" "}
                        {project.statusObject}
                      </div>
                    </div>
                    <div>
                      <div className={styles.local_title}>Публикации</div>
                      <Link to={project.linkToPublication} target="_blank">
                        <div className={styles.local_text}>
                          {project.publication}
                        </div>
                      </Link>
                      <Link to={project.linkToPublicationTwo} target="_blank">
                        <div className={styles.local_text}>
                          {project.publicationTwo}
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className={styles.local_left}>
                    <div>
                      <div className={styles.local_title}>Степень участия</div>
                      <div className={styles.local_text}>
                        {project.degreeParticipation}
                      </div>
                    </div>
                    <div>
                      <div className={styles.local_title}>Заказчик</div>
                      <div className={styles.local_text}>
                        {" "}
                        {project.customer}
                      </div>
                    </div>
                    <div>
                      <div className={styles.local_title}>Награды</div>
                      <div className={styles.local_text}>{project.awards}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockImg}>
              <div className={styles.container}>
                <div className={styles.item}>
                  <img
                    ref={refs.leftImg1}
                    className={styles.item_img}
                    src={imageOpenSource}
                    alt={altTextOpen}
                    loading="lazy"
                  />
                </div>
                <div
                  ref={refs.blockDescription}
                  className={styles.description_object_container}
                >
                  <div className={styles.description_object_block}>
                    <div className={styles.description_object_title}>
                      {project.headingTextBlock !== null &&
                      project.headingTextBlock !== undefined ? (
                        <h2 className={styles.blockHeadingTitle_heading}>
                          {project.headingTextBlock}
                        </h2>
                      ) : null}
                    </div>

                    <div className={styles.description_object_text1}>
                      {project.textBlock}
                    </div>
                  </div>
                </div>
                {/* <div className={styles.item}>
                  <img
                    ref={refs.leftImg2}
                    className={styles.item_img}
                    // src={img2}
                    alt=""
                  />
                </div> */}
                {/* <div className={styles.item}>
                  <img
                    ref={refs.leftImg3}
                    className={styles.item_img}
                    // src={img3}
                    alt=""
                  />
                </div> */}
                <div className={styles.div_conteiner}>
                  {userSelectedBlocks?.map((innerBlocks, outerIndex) => (
                    <div key={outerIndex}>
                      {innerBlocks?.map((block, innerIndex) => (
                        <ConstructorBlockRenderer
                          key={innerIndex}
                          block={block}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className={`${styles.item} ${styles.item_img_close}`}>
                  <img
                    ref={refs.leftImg4}
                    className={`${styles.item_img} ${styles.item_img_close1}`}
                    src={imageCloseSource}
                    alt={altTextClose}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className={styles.button_project_projectCard}>
              {previousProject && (
                <Link
                  className={styles.button_project_link_projectCard1}
                  to={`/projects/${previousProject.id}`}
                >
                  <div className={styles.previous_svg_projectCard}>
                    <img src={previous} alt={previous} />
                    <span className={styles.previous__span_projectCard}>
                      {`${previousProject.title}`}
                    </span>
                  </div>
                </Link>
              )}
              {nextProject && (
                <Link
                  className={styles.button_project_link_projectCard2}
                  to={`/projects/${nextProject.id}`}
                >
                  <div className={styles.next_svg_projectCard}>
                    <span className={styles.next__span_projectCard}>
                      {`${nextProject.title}`}
                    </span>
                    <img src={next} alt={next} />
                  </div>
                </Link>
              )}
            </div>
            <div id="projects" className={styles.social_links_projectCard}>
              <button onClick={() => shareToVK(project, Host)}>
                <span
                  className={styles.social_links_item}
                  style={{ marginRight: "21px", color: "#FF7F6A" }}
                >
                  VK
                </span>
              </button>
              <button onClick={() => shareToWhatsApp(project, Host)}>
                <span
                  className={styles.social_links_item}
                  style={{ marginRight: "25px", color: "#FF7F6A" }}
                >
                  WA
                </span>
              </button>
              {/* <button onClick={() => shareToViber(project, Host)}>
                <span
                  className={styles.social_links_item}
                  style={{ marginRight: "22px", color: "#FF7F6A" }}
                >
                  VB
                </span>
              </button> */}
              <button onClick={() => shareToTelegram(project, Host)}>
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
            ref={sliderCardRef}
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
            {projects?.map((project, index) => {
              const photoName = project && project.imageProject;
              const defaultPhoto = catPhoto;

              const photoSrc =
                photoName && photoName !== "null" && photoName !== "undefined"
                  ? `${Host}/images/imageAdd/${photoName}`
                  : defaultPhoto;
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
                        src={photoSrc}
                        alt={project.imageProject}
                        loading="lazy"
                      />
                    </div>
                    <div
                      className={
                        styles.wrapper_container_title_selectCompetencies_projectCard
                      }
                    >
                      <div
                        className={
                          styles.container_wrapper_title_city_data_block_projectCard
                        }
                      >
                        <div className={styles.container__title_projectCard}>
                          {project.title}
                        </div>
                        <div
                          className={styles.countryCity_monthYear_projectCard}
                        >
                          <div
                            className={
                              styles.container__countryCity_projectCard
                            }
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
                          <div
                            className={styles.container__monthYear_projectCard}
                          >
                            {project.monthYear}
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          styles.wrapper_container__selectCompetencies_projectCard
                        }
                      >
                        <div
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
                                        styles.div_el_selectCompetencies_projectCard
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
                                            styles.div_el_selectCompetencies_projectCard
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
        <div className={styles.project_container_projectCard_sliderMobile}>
          <SliderContainerProjectCard projects={projects} />
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
