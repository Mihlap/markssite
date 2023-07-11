import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import styles from "./Project-container.module.scss";
import { getFetchForm } from '../store/Slice/projectSlice';

export default function Project() {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.articles);


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
  
  console.log(project);

return (
  <section className={styles.section_project}>
    <div className={styles.section_project__block}>
      {project &&
        project.map((el) => {
          // const firstPhoto = el.imageTitle.split(", ")[0];
          const competencies = el.selectCompetencies
            .split(",")
            .map((comp) => comp.trim())
            .filter(Boolean);
          return (
            <div className={styles.section_project__block_cart} key={el.id}>
              <div className={styles.cart_project}>
                <div className={styles.cart_project__container}>
                  <img
                    className={styles.cart_project__img}
                    style={{ height: `${el.style}px` }}
                    src={`http://localhost:3001/images/${el.imageProject}`}
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
            </div>
          );
        })}
    </div>
  </section>
);
}
