import React, { useState } from 'react'
import styles from './AddProject.module.scss'
import FormAddProject from './formAdd/FormAddProject';

export default function AddProject() {
const [isModalOpen, setIsModalOpen] = useState(true);

const handleOpenModal = () => {
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
};

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
            <FormAddProject />
            <button
              className={styles.project_components_admin__close_button}
              onClick={handleCloseModal}
            ></button>
          </div>
        </div>
      )}
    </section>
  );
}
