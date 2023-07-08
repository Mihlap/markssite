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
  
let arr = project?.map((el) => el.selectCompetencies);
  
  

  console.log(arr);

return (
  <section className={styles.section_project}>
    <div className={styles.section_project__block}>
      {project &&
        project.map((el) => {
          const firstPhoto = el.imageTitle.split(", ")[0];
          return (
            <div className={styles.section_project__block_cart} key={el.id}>
              <div className={styles.cart_project}>
                <div className={styles.cart_project__container}>
                  <img
                    className={styles.cart_project__img}
                    style={{ height: `${el.style}px` }}
                    src={`http://localhost:3001/images/${firstPhoto}`}
                    alt="pfoto"
                  />
                  <div className={styles.cart_project__content}>
                    <span className={styles.cart_project__title}>{el.title}</span>
                    <span className={styles.cart_project__widget}>
                      {el.selectCompetencies}
                    </span>
                  </div>
                    <div className={styles.cart_project__address}>
                      {el.countryCity} точка {el.monthYear}
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
