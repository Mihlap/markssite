import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProjectCardSlider from "../UI/ProjectCardSlider/ProjectCardSlider";
import styles from "./ProjectCard.module.css";
import { getFetchForm } from "../store/Slice/projectSlice";
import AllProjectsButton from "../UI/ButtonsProjects/AllProjectsButton";

const ProjectCard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const slidesCard = useSelector((state) => state.project.projects);
  const project = slidesCard.find((item) => item.id === parseInt(`${id}`));

  useEffect(() => {
    dispatch(getFetchForm());
  }, [dispatch]);

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
              <div className={styles.project_content__wrapper}>
                <div className={styles.cart_project__content__block__card}>
                  <div className={styles.cart_project__widget}>
                    {(() => {
                      try {
                        const selectCompetencies = JSON.parse(
                          project.selectCompetencies
                        );
                        return selectCompetencies.map((competency) => (
                          <div
                            key={competency.value}
                            className={styles.el_project_selectCompetencies}
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
                                    styles.el_project_selectCompetencies
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
                  <div className={styles.cart_project_title}>{project.title}</div>
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
        )}
      </div>

      <h2>Project ID: {id}</h2>
    </div>
  );
};

export default ProjectCard;
