import React, { useRef, useState } from 'react';
import styles from "./AddHRPortal.module.scss";
import FormEditVacancy from './FormEditVacancy';
import FormAddVacancy from './FormAddVacancy';

export default function AddHRPortal({ user }) {
  const Host = process.env.REACT_APP_SERVER_HOST;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVacancyData, setEditVacancyData] = useState(null);
  const [modalBlockHeight, setModalBlockHeight] = useState("auto");

  
  const isMountedRef = useRef(true);
  const updateModalBlockHeight = () => {
    const windowHeight = window.innerHeight;
    const maxHeight = Math.min(windowHeight - 100, 1900); // Примерное максимальное значение высоты

    setModalBlockHeight(`${maxHeight}px`);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    if (editVacancyData) {
      setEditVacancyData(null);     
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
      <div className={styles.card_components_admin__title}>HR портал</div>
      </div>
      <div
          className={styles.card_components_admin__button_block}
          onClick={handleOpenModal}
        >
          <button className={styles.card_components_admin__button}>
            <div>
              <svg
                className={styles.card_components_admin__icon}
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
            <div className={styles.card_components_admin__button_text}>
              Добавить вакансию
            </div>
          </button>
        </div>
        {isModalOpen && (
          <div className={styles.card_components_admin__modal_container}>
            <div
              style={{ maxHeight: modalBlockHeight }}
              className={styles.card_components_admin__modal_block}
            >
              {editVacancyData ? (
                <FormEditVacancy
                  setIsModalOpen={setIsModalOpen}
                  editVacancyData={editVacancyData}
                  className={styles.formAddProjectClass}
                />
              ) : (
                <FormAddVacancy
                  className={styles.formAddProjectClass}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
              <button
                className={styles.card_components_admin__close_button}
                onClick={handleCloseModal}
              ></button>
            </div>
          </div>
        )}
    </section>
  );
}

