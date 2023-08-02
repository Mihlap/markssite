import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProjectCardSlider from '../UI/ProjectCardSlider/ProjectCardSlider';
import styles from "./ProjectCard.module.css";


const ProjectCard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const slides = useSelector((state) => state.project.projects);
  // let imageTitles = [];
  //             if (project.imageTitle && /\S/.test(project.imageTitle)) {
  //                  imageTitles = project.imageTitle
  //                 .split(",")
  //                 .map((el) => el.replace(/[{}]/g, ""));
  //             }

  //             const firstImageTitle =
  //             imageTitles.length > 0 ? imageTitles[0] : null;

  return (
  <div className={styles.main_project_card}>
    <ProjectCardSlider slides={slides}/>
  <div>
  <h2>Project ID: {id}</h2>
  </div>
</div>
)
};

export default ProjectCard;
