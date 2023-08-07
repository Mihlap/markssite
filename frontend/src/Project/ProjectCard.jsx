import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import ProjectCardSlider from "../UI/ProjectCardSlider/ProjectCardSlider";
import styles from "./ProjectCard.module.css";
import { getFetchForm } from "../store/Slice/projectSlice";
import AllProjectsButton from "../UI/ButtonsProjects/AllProjectsButton";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const ProjectCard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const slidesCard = useSelector((state) => state.project.projects);
  const project = slidesCard.find((item) => item.id === parseInt(`${id}`));

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
  };

  const {
    title,
    address,
    selectCompetencies,
    blockLeft,
    // blockRight,
    // blockDescription,
    // blockRightPhone,
    // leftImg1,
    // leftImg2,
    // leftImg3,
  } = refs;

  const elementsRight = [
    // blockRightPhone.current,
    // blockDescription.current,
    // blockLeft.current,
    // blockRight.current,
    // leftImg1.current,
    // leftImg2.current,
    // leftImg3.current,
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

  console.log(project, "++++++++++++++++++++++++++++++++++");
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
            <div className={styles.result_block}>
              <div className={styles.result_number}>{project.siteArea}</div>
              <div className={styles.result_text}>Общая площадь</div>
            </div>
            <div className={styles.result_block}>
              <div className={styles.result_number}>{project.totalArea}</div>
              <div className={styles.result_text}>Площадь участка</div>
            </div>
            <div className={styles.result_block}>
              <div className={styles.result_number}>{project.floors}</div>
              <div className={styles.result_text}>Этажность</div>
            </div>
            <div className={styles.result_block}>
              <div className={styles.result_number}>{project.altitude}</div>
              <div className={styles.result_text}>Высотность</div>
            </div>
            <div className={styles.result_block}>
              <div className={styles.result_number}>{project.constructionVolume}</div>
              <div className={styles.result_text}>Строительный объем</div>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
