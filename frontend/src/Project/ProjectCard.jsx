import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ProjectCardSlider from '../UI/ProjectCardSlider/ProjectCardSlider';
import styles from "./ProjectCard.module.css";
import { getFetchForm } from "../store/Slice/projectSlice";


const ProjectCard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const slidesCard = useSelector((state) => state.project.projects);
  const project = slidesCard.find((item) => item.id === parseInt(`${id}`));

  useEffect(() => {
    dispatch(getFetchForm());
    }, [dispatch]);

  
  // let imageTitles = [];
  //             if (project.imageTitle && /\S/.test(project.imageTitle)) {
  //                  imageTitles = project.imageTitle
  //                 .split(",")
  //                 .map((el) => el.replace(/[{}]/g, ""));
  //             }

  //             const firstImageTitle =
  //             imageTitles.length > 0 ? imageTitles[0] : null;
console.log(slidesCard, '================================');
  return (
  <div className={styles.main_project_card}>
   {project && <ProjectCardSlider slidesCard={[project]} />}
  <div>
  <h2>Project ID: {id}</h2>
  </div>
</div>
)
};

export default ProjectCard;
