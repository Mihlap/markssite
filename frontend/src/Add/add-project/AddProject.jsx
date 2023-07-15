import React, { useEffect, useState } from 'react'
import styles from './AddProject.module.scss'
import FormAddProject from './formAdd/FormAddProject';
import { useDispatch, useSelector } from 'react-redux';
import { getFetchForm } from '../../store/Slice/projectSlice';

export default function AddProject() {
    const Host = process.env.REACT_APP_SERVER_HOST;
 const dispatch = useDispatch();
 const project = useSelector((state) => state.project.projects);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleOpenModal = () => {
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
};

   useEffect(() => {
     dispatch(getFetchForm());
   }, [dispatch]);
  
  
  console.log(project);
  
  return (
    <section className={styles.project_components_admin}>
      <div className={styles.project_components_admin__title}>Проекты</div>

      <div
        className={styles.project_components_admin__button_block}
        onClick={handleOpenModal}
      >
        <button className={styles.project_components_admin__button}>
          <div>
            <svg
              className={styles.project_components_admin__icon}
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="icon">
                <circle
                  id="Ellipse 4"
                  cx="20.5"
                  cy="20"
                  r="20"
                  fill="#F6F6F6"
                />
                <path
                  id="Vector 10"
                  d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                  stroke="#75BBFD"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </g>
            </svg>
          </div>
          <div className={styles.project_components_admin__button_text}>
            Добавить проект на главную
          </div>
        </button>
      </div>
      {isModalOpen && (
        <div className={styles.project_components_admin__modal_container}>
          <div className={styles.project_components_admin__modal_block}>
            <FormAddProject setIsModalOpen={setIsModalOpen} />
            <button
              className={styles.project_components_admin__close_button}
              onClick={handleCloseModal}
            ></button>
          </div>
        </div>
      )}

      <div className={styles.project_components_admin__section_map}>
        <div className={styles.project_components_admin__block_map}>
        {project &&
          project.map((el) => {
            // const firstPhoto = el.imageTitle.split(", ")[0];
            return (
              <div className={styles.section_project__block_cart} key={el.id}>
                <div className={styles.cart_project}>
                  <div className={styles.cart_project__container}>
                    <img
                      className={styles.cart_project__img}
                      src={`${Host}/images/imageAdd/${el.imageProject}`}
                      alt="pfoto"
                    />
                    <div className={styles.cart_project__content}>
                      <span className={styles.cart_project__title}>
                        {el.title}
                      </span>
                    </div>
                    <div>{el.id}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
