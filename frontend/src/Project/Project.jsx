import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Project-container.module.scss";
import {
  setSelectedViewConstruction,
  getFetchFormFilter,
} from "../store/Slice/projectSlice";
import Company_Slider from "../UI/Company_Slider/Company_Slider";
import "../UI/Company_Slider/Company_Slider.css";
import { Link } from "react-router-dom";
import "../UI/ButtonsProjects/AllProjectsButton.module.css";

const Host = process.env.REACT_APP_SERVER_HOST;

export default function Project() {
  const buttonChoose = [
    "Все",
    "Автодорожные",
    "Тоннели",
    "Метрополитен",
    "Уникальные объекты",
    "Аэропорты",
    "BIM",
    "Жилищное строительство",
    "Дизайн",
    "Архитектура",
    "Конструкции",
  ];

  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);
  const selectedViewConstruction = useSelector(
    (state) => state.project.selectedViewConstruction
  );
  // const filteredProjects = useSelector((state) => state.project.filteredProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const projectsPerPage = 10;

  const handleButtonClick = (viewConstruction) => {
    dispatch(setSelectedViewConstruction(viewConstruction));
    setCurrentPage(1);
    dispatch(
      getFetchFormFilter(currentPage, projectsPerPage, viewConstruction)
    );
  };

  const handleShowButtonAll = (e) => {
    e.preventDefault();
    setShowButton((prevShowButton) => !prevShowButton);
  };

  useEffect(() => {
    dispatch(
      getFetchFormFilter(currentPage, projectsPerPage, selectedViewConstruction)
    );
    setLoading(false);
  }, [dispatch, currentPage, projectsPerPage, selectedViewConstruction]);

  const handleScroll = () => {
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight;

    if (isAtBottom && !loading) {
      loadMoreProjects();
    }
  };

  const loadMoreProjects = async () => {
    setLoading(true);
    setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const colors = {
    Архитектура: "#FF7F6A",
    BIM: "#75BBFD",
    Конструкции: "#566272",
    Дизайн: "#FAA8BD",
    Инженерия: "#90B734",
  };

  const resizeImage = (width, height) => {
    const aspectRatio = height / width;

    if (aspectRatio >= 1.2) {
      if (width !== 28 || height !== 48) {
        return { width: 28.18, height: 48.18 };
      }
    } else if (aspectRatio < 0.8) {
      if (width !== 28 || height !== 14) {
        return { width: 27.62, height: 13.81 };
      }
    } else {
      if (width !== 28 || height !== 28) {
        return { width: 28.18, height: 27.62 };
      }
    }
    return { width, height };
  };
  console.log(
    selectedViewConstruction,
    "================================================"
  );
  const filteredProjects = projects.filter((project) =>
    selectedViewConstruction === "Все"
      ? true
      : project.selectCompetencies.includes(selectedViewConstruction)
  );

  console.log(
    filteredProjects,
    "+++++++++++++++++++++++++++++++++++++++++++++++"
  );

  return (
    <div className={styles.project_main}>
      <Company_Slider />
      <div className={styles.project_slider_text}>
        <p className={styles.actuality_text}>Актуальные кейсы MARKS GROUP</p>
        <span className={styles.projects_name_text}>Проекты</span>
      </div>
      <div className={styles.menu_button_group_project_wrapper}>
        <div className={styles.menu_button_group_project}>
          {buttonChoose.map((el, index) => (
            <div
              key={el}
              className={`${styles.button_wrapper} ${
                showButton ? "" : index ? styles.hidden : ""
              }`}
            >
              <button
                className={`${styles.menu__button__allProject} ${
                  el === selectedViewConstruction ? styles.active : ""
                }`}
                onClick={() => handleButtonClick(el)}
              >
                <p className={styles.menu_button_items}>{el}</p>
              </button>
            </div>
          ))}
        </div>
        <button
          className={styles.button_look_all}
          onClick={handleShowButtonAll}
        >
          {showButton ? (
            <div className={styles.project__svg1}>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none"
            >
               <rect
                 x="24"
                 y="24"
                 width="24"
                 height="24"
                 rx="12"
                 transform="rotate(-180 24 24)"
                 fill="#1D2E43"
               />
               <path d="M17 14L12.5 9L8 14" stroke="#F6F6F6" />
             </svg>
             </div>
          ) : (
            <div className={styles.project__svg2}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M8 10L12.5 15L17 10" stroke="#1D2E43" />
              <rect
                x="23.5"
                y="23.5"
                width="23"
                height="23"
                rx="11.5"
                transform="rotate(-180 23.5 23.5)"
                stroke="#1D2E43"
              />
            </svg>
            </div>
          )}
       </button>
      </div>
      <section className={styles.section_project}>
        <div className={styles.section_project__block}>
          {filteredProjects &&
            filteredProjects?.map((project) => {
              const competencies = project.selectCompetencies
                .split(",")
                .map((comp) => comp.trim())
                .filter(Boolean);

              const { width, height } = resizeImage(
                project.imageWidth,
                project.imageHeight
              );

              return (
                <Link
                  to={project.link}
                  className={styles.section_project__block_cart}
                  key={project.id}
                >
                  <div className={styles.cart_project}>
                    <div className={styles.cart_project__container}>
                      <img
                        className={styles.cart_project__img}
                        style={{
                          height: `${height}rem`,
                          width: `${width}rem`,
                        }}
                        src={`${Host}/images/imageAdd/${
                          project.imageProject
                            ? project.imageProject
                            : project.imageTitle
                        }`}
                        alt={project.imageProject}
                      />
                      <div className={styles.project_content__wrapper}>
                        <div className={styles.cart_project_title}>
                          {project.title}
                        </div>
                        <div className={styles.cart_project__content}>
                          <div className={styles.cart_project__widget}>
                            {(() => {
                              try {
                                const selectCompetencies = JSON.parse(
                                  project.selectCompetencies
                                );
                                return selectCompetencies.map((competency) => (
                                  <div
                                    key={competency.value}
                                    className={
                                      styles.el_project_selectCompetencies
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
                                  typeof project.selectCompetencies ===
                                    "string" &&
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
                                            styles.el_project_selectCompetencies
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
                                return null;
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className={styles.cart_project__address}>
                        {project.countryCity}{" "}
                        <div className={styles.cart_project__address__svg}>
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
                        {project.monthYear}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </div>
  );
}
