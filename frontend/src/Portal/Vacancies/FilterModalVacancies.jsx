import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./Vacancies.module.css";

Modal.setAppElement("#root");

const FilterModalVacancies = ({ isOpen, onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState(""); // Состояние для выбранного фильтра

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    // Здесь можно вызвать функцию, которая будет применять фильтр к вакансиям
  };

 
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.filterModal}
      overlayClassName={styles.modalFilterOverlay}
      modal={document.querySelector(".modal")}
      modalStyleZIndex={9999}
      // onAfterOpen={() => {
      //   // isOpen(true);
      //   document.body.style.overflow = "hidden";
      //   document.body.classList.add("modal-open");
      // }}
      // onAfterClose={() => {
      //   document.body.style.overflow = "";
      //   document.body.classList.remove("modal-open");
      // }}
      ariaHideApp={false}
      style={{
        overlay: {
          zIndex: 9999,
          backgroundColor: "#2C3B447A",
        },
        content: {
          zIndex: 9999,
        },
      }}
    >
          <div
            onClick={(e) => {
              onClose();
            }}
            className={`${styles.modal_vacancy_close} ${styles.fixed_modal_vacancy}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.00025 8.70733L0.707107 16.0005L0 15.2934L7.29314 8.00023L2.41697e-05 0.707107L0.707131 0L8.00025 7.29312L15.2934 0L16.0005 0.707107L8.70736 8.00023L16.0005 15.2934L15.2934 16.0005L8.00025 8.70733Z"
                fill="black"
              />
            </svg>
          </div>
      <div className={styles.filterModalContent}>
        <h2>Выберите фильтр:</h2>
        <button
          className={`${styles.filterButton} ${
            selectedFilter === "filter1" ? styles.activeFilter : ""
          }`}
          onClick={() => handleFilterClick("filter1")}
        >
          Фильтр 1
        </button>
        <button
          className={`${styles.filterButton} ${
            selectedFilter === "filter2" ? styles.activeFilter : ""
          }`}
          onClick={() => handleFilterClick("filter2")}
        >
          Фильтр 2
        </button>
        <button
          className={`${styles.filterButton} ${
            selectedFilter === "filter3" ? styles.activeFilter : ""
          }`}
          onClick={() => handleFilterClick("filter3")}
        >
          Фильтр 3
        </button>
        {/* Другие кнопки фильтров */}
      </div>
      </Modal>
  );
};

export default FilterModalVacancies;
