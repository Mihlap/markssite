import React, { useState } from "react";
import Modal from "react-modal";
import styles from "./Vacancies.module.css";

Modal.setAppElement("#root");

const FilterModalVacancies = ({ isOpen, onClose }) => {
  const [selectedFilter, setSelectedFilter] = useState(""); // Состояние для выбранного фильтра

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
   };

   const filterButtons = [
    {
      name: "Требуемый опыт работы",
      buttons: [
        { id: "filter1-1", label: "Без опыта" },
        { id: "filter1-2", label: "1-3 года" },
        { id: "filter1-3", label: "3-5 лет" },
        { id: "filter1-4", label: "5-10 лет" }
      ]
    },
    {
      name: "Локация",
      buttons: [
        { id: "filter2-1", label: "Москва" },
        { id: "filter2-2", label: "Оренбург" },
        { id: "filter2-3", label: "Челябинск" },
        { id: "filter2-4", label: "ташкент" }
      ]
    },
    {
      name: "Режим работы",
      buttons: [
        { id: "filter3-1", label: "Офис" },
        { id: "filter3-2", label: "Гибрид" },
        { id: "filter3-3", label: "Удаленно" }       
      ]
    },
    {
      name: "Занятость",
      buttons: [
        { id: "filter4-1", label: "Полная" },
        { id: "filter4-2", label: "Частичная" },
        { id: "filter4-3", label: "Проектная" }       
      ]
    }
  ];

  return (
    <Modal
      className={styles.modal_wrapper_vacancy}
      modal={document.querySelector(".modal")}
      modalStyleZIndex={999}
      isOpen={isOpen}
      onRequestClose={onClose}
      onAfterOpen={() => {
        // setIsModalProjectOpen(true);
        document.body.style.overflow = "hidden";
        document.body.classList.add("modal-open");
      }}
      onAfterClose={() => {
        document.body.style.overflow = "";
        document.body.classList.remove("modal-open");
      }}
      shouldCloseOnOverlayClick={true}
      onClick={onClose}
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
        <div className={styles.filterName}>
          <h2>Фильтр</h2>
        </div>
        <div className={styles.filterName_button_modal_wrapper}>
          {filterButtons.map((filter) => (
            <div key={filter.name}>
              <p className={styles.filterName_title}>{filter.name}</p>
              <div className={styles.filterName_button_modal}>
                {filter.buttons.map((button) => (
                  <button
                    key={button.id}
                    className={`${styles.filterModalButton} ${
                      selectedFilter === button.id ? styles.activeFilter : ""
                    }`}
                    onClick={() => handleFilterClick(button.id)}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.applyButtonWrapper}>
    <button className={styles.applyButton}>Применить</button>
  </div>
      </div>
    </Modal>
  );
};

export default FilterModalVacancies;
