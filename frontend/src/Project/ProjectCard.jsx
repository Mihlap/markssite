import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ProjectCardSlider from '../UI/ProjectCardSlider/ProjectCardSlider';
import styles from "./ProjectCard.module.css";


const ProjectCard = () => {
  const dispatch = useDispatch();
  const slides = useSelector((state) => state.project.projects);


  return (
  <div className={styles.main_project_card}>
    <ProjectCardSlider slides={slides}/>
  <div>

  </div>
</div>
)
};

export default ProjectCard;
