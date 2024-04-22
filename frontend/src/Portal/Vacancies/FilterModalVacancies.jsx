import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import styles from "./Vacancies.module.css";
import { setActiveFilters } from "../../store/Slice/vacanciesSlice";
import { useDispatch } from "react-redux";

Modal.setAppElement("#root");

const FilterModalVacancies = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const initialFiltersState = {
    "Требуемый опыт работы": [],
    Локация: [],
    "Режим работы": [],
    Занятость: [],
  };
  const [localFilters, setLocalFilters] = useState(initialFiltersState);

  const handleFilterClick = (category, value) => {
    setLocalFilters((prev) => {
      const isValueIncluded = prev[category]?.includes(value);
      const updatedArray = isValueIncluded
        ? prev[category].filter((item) => item !== value)
        : [...(prev[category] || []), value];
      return { ...prev, [category]: updatedArray };
    });
  };

  const handleApplyFilters = () => {
    dispatch(setActiveFilters(localFilters));
    onClose();
  };

  const filterButtons = [
    {
      name: "Требуемый опыт работы",
      filterKey: "experience", 
      buttons: [
        { id: "experience-1", label: "Без опыта", value: "Без опыта" },
        { id: "experience-2", label: "1-3 года", value: "1-3" },
        { id: "experience-3", label: "3-5 лет", value: "3-5" },
        { id: "experience-4", label: "5-10 лет", value: "5-10" },
      ],
    },
    {
      name: "Локация",
      filterKey: "locationStaff",
      buttons: [
        { id: "locationStaff-1", label: "Москва", value: "Москва" },
        { id: "locationStaff-2", label: "Оренбург", value: "Оренбург" },
        { id: "locationStaff-3", label: "Челябинск", value: "Челябинск" },
        { id: "locationStaff-4", label: "Ташкент", value: "ташкент" },
      ],
    },
    {
      name: "Режим работы",
      filterKey: "modeOperating",
      buttons: [
        { id: "modeOperating-1", label: "Офис", value: "Офис" },
        { id: "modeOperating-2", label: "Гибрид", value: "Гибрид" },
        { id: "modeOperating-3", label: "Удаленно", value: "Удаленно" },
      ],
    },
    {
      name: "Занятость",
      filterKey: "busyness",
      buttons: [
        { id: "busyness-1", label: "Полная", value: "Полная" },
        { id: "busyness-2", label: "Частичная", value: "Частичная" },
        { id: "busyness-3", label: "Проектная", value: "Проектная" },
      ],
    },
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
          {filterButtons.map((filterGroup) => (
            <div key={filterGroup.name}>
              <p className={styles.filterName_title}>{filterGroup.name}</p>
              <div className={styles.filterName_button_modal}>
                {filterGroup.buttons.map((button) => (
                  <button
                    key={button.id}
                    className={`${styles.filterModalButton} ${
                      localFilters[filterGroup.name]?.includes(button.label)
                        ? styles.activeFilter
                        : ""
                    }`}
                    onClick={() =>
                      handleFilterClick(filterGroup.name, button.label)
                    }
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.applyButtonWrapper}>
          <button className={styles.applyButton} onClick={handleApplyFilters}>
            Применить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModalVacancies;
