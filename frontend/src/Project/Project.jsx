import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import styles from "./Project-container.module.scss";
import { getFetchForm } from '../store/Slice/projectSlice';
import Company_Slider from "../UI/Company_Slider/Company_Slider";
import "../UI/Company_Slider/Company_Slider.css";
import { Link } from 'react-router-dom';
import AllProjectsButton from '../UI/ButtonsProjects/AllProjectsButton';
import '../UI/ButtonsProjects/AllProjectsButton.module.css';

export default function Project() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.project.projects);


  const Host = process.env.REACT_APP_SERVER_HOST;


    useEffect(() => {
      dispatch(getFetchForm());
    }, [dispatch]);
  
   const colors = {
     Архитектура: "#FF7F6A",
     BIM: "#75BBFD",
     Конструкции: "#566272",
     Дизайн: "#FAA8BD",
     Инженерия: "#90B734",
   };
  
  console.log(projects);

return (
  <div className={styles.project_main}>
      <Company_Slider projects={projects} />
    <div className={styles.project_button}>
      <AllProjectsButton/> 
      </div>
  <section className={styles.section_project}>
    <div>
    </div>
    <div className={styles.section_project__block}>
      {projects && projects?.map((el) => {
          // const firstPhoto = el.imageTitle.split(", ")[0];
          const competencies = el.selectCompetencies
            .split(",")
            .map((comp) => comp.trim())
            .filter(Boolean);
          return (
            <Link
            to={el.link}
            className={styles.section_project__block_cart}
            key={el.id}
            >
              <div className={styles.cart_project}>
          
                <div className={styles.cart_project__container}>
                  <img
                    className={styles.cart_project__img}
                    style={{
                      height: `${projects.style?.split(",")[0]}rem`,
                      width: `${projects.style?.split(",")[1]}rem`,
                    }}
                    src={`${Host}/images/imageAdd/${el.imageProject}`}
                    alt="pfoto"
                  />
                  <div className={styles.cart_project__content}>
                    <span className={styles.cart_project__title}>
                      {el.title}
                    </span>
                    <div className={styles.cart_project__widget}>
                      {competencies.map((comp) => (
                        <div
                          key={comp}
                          style={{
                            color: colors[comp],
                            borderColor: colors[comp],
                            border: "1px solid",
                            padding: "3px 6px",
                            borderRadius: "34px",
                          }}
                        >
                          {comp}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.cart_project__address}>
                    {el.countryCity}{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="2"
                      height="2"
                      viewBox="0 0 2 2"
                      fill="none"
                    >
                      <circle cx="1" cy="1" r="1" fill="#959DA6" />
                    </svg>{" "}
                    {el.monthYear}
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
