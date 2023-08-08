import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import {
  setSelectedViewConstruction,
  setSelectedCity,
  getFetchFormFilter,
  getFetchFormCityFilter,
  getFetchFormLocationFilter,
} from "../store/Slice/projectSlice";
// import SwiperContainer from "./Swiper-Phone/SwiperContainer";
// import SwiperContainerProgect from "./Swiper-project/SwiperContainerProgect";
import { Swiper, SwiperSlide } from "swiper/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import ProjectCardSlider from "../UI/ProjectCardSlider/ProjectCardSlider";
import styles from "./ProjectCard.module.css";
import { getFetchForm } from "../store/Slice/projectSlice";
import AllProjectsButton from "../UI/ButtonsProjects/AllProjectsButton";
// import PreviousNextButton from "../UI/ButtonsProjects/PreviousNextButton";

import next from ".././icons/next.svg";
import previous from ".././icons/previous.svg";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const Host = process.env.REACT_APP_SERVER_HOST;

const ProjectCard = () => {
  // const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const sliderCardRef = useRef(null);
  const slidesCard = useSelector((state) => state.project.projects);
  const project = slidesCard.find((item) => item.id === parseInt(`${id}`));
  const projects = useSelector((state) => state.project.projects);

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
    // leftImg2,
    // leftImg3,
    leftImg4,
  } = refs;

  const elementsRight = [
    // blockRightPhone.current,
    blockDescription.current,
    blockLeft.current,
    blockRight.current,
    leftImg1.current,
    // leftImg2.current,
    // leftImg3.current,
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
      gsap.from(element, { duration: 1, clipPath: { start: "110%" } });
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


  console.log(project, "++++++++++++++++++++++++++++++++++");
  console.log(projects, "=========================");
  return (
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
                            ref={refs.selectCompetencies}
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
                                  className={
                                    styles.el_project_selectCompetencies__block__card
                                  }
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
                <div className={styles.cart_project__address__svg__block__card}>
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
                    {project.viewConstruction}
                  </div>
                </div>
              </div>
              <div className={styles.title_text}>
                {project.descriptionProject}
              </div>

              <div className={styles.result_container}>
                {[
                  { value: project.siteArea, text: "Общая площадь" },
                  { value: project.totalArea, text: "Площадь участка" },
                  { value: project.floors, text: "Этажность" },
                  { value: project.altitude, text: "Высотность" },
                  {
                    value: project.constructionVolume,
                    text: "Строительный объем",
                  },
                ]
                  .filter((item) => item.value) // фильтрация по наличию значения
                  .slice(0, 3) // берём первые три объекта
                  .map(
                    (
                      item // отрисовываем
                    ) => (
                      <div key={item.text} className={styles.result_block}>
                        <div className={styles.result_number}>{item.value}</div>
                        <div className={styles.result_text}>{item.text}</div>
                      </div>
                    )
                  )}
              </div>
            </div>
            <div ref={refs.blockRight} className={styles.header_content_right}>
              <div className={styles.local_container}>
                <div className={styles.local_ritgh}>
                  <div>
                    <div className={styles.local_title}>Расположение</div>
                    <div className={styles.local_text}>{project.location}</div>
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
                    <Link
                      to={project.linkToPublication}
                      target="_blank"
                    >
                      <div className={styles.local_text}>
                        {project.publication}
                      </div>
                    </Link>
                    <Link
                      to={project.linkToPublicationTwo}
                      target="_blank"
                    >
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
                    <div className={styles.local_text}> {project.customer}</div>
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
                  src={`${Host}/images/imageAdd/${project.imageOpen}`}
                  alt={project.imageOpen}
                />
              </div>
              <div
                ref={refs.blockDescription}
                className={styles.description_object_container}
              >
                <div className={styles.description_object_block}>
                  <div className={styles.description_object_title}>
                    {/* {project.title} */}
                  </div>
                  <div className={styles.description_object_text1}>
                    {project.textBlock}
                  </div>
                </div>
              </div>
              <div className={styles.item}>
                <img
                  ref={refs.leftImg2}
                  className={styles.item_img}
                  // src={img2}
                  alt=""
                />
              </div>
              <div className={styles.item}>
                <img
                  ref={refs.leftImg3}
                  className={`${styles.item_img} ${styles.item_img_latest}`}
                  // src={img3}
                  alt=""
                />
              </div>
              <div className={styles.item}>
                <img
                  ref={refs.leftImg4}
                  className={styles.item_img}
                  src={`${Host}/images/imageAdd/${project.imageClose}`}
                  alt={project.imageClose}
                />
              </div>
            </div>
          </div>
             <div className={styles.container_button_project_projectCard}>
              <div className={styles.button_project}>
                {project && currentIndex > 0 && (
                  <Link
                    className={styles.button_project_link}
                    to={`/projects/${project[currentIndex - 1].id}`}
                  >
                    <div className={styles.previous_svg}>
                      <img src={previous} alt="previous" />
                      <span className={styles.previous_span}>
                        {project[currentIndex - 1].title}
                      </span>
                    </div>
                  </Link>
                )}
                {project && currentIndex < project.length - 1 && (
                  <Link
                    className={styles.button_project_link}
                    to={`/projects/${project[currentIndex + 1].id}`}
                  >
                    <div className={styles.next_svg}>
                      <span className={styles.next_span}>
                        {project[currentIndex + 1].title}
                      </span>
                      <img src={next} alt="next" />
                    </div>
                  </Link>
                )}
              </div>
            </div>
        </div>
      )}
        <div id="projects" className={styles.project_name_text}>
        Ещё по теме
      </div>
      <div className={styles.swiper_progect_container}>
        {/* <SwiperContainerProgect projects={projects} /> */}
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
          {projects?.map((project, index) => {
              if (!project) {
                return null; 
              }
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
                // onScroll={handleScroll}
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
                      alt={project.imageProject
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
    </div>
  );
};

export default ProjectCard;
