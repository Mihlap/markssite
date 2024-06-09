import React, { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import styles from "./Vacancies.module.css";
import { fetchFilteredVacancies, setActiveFilters } from "../../store/Slice/vacanciesSlice";
import { useDispatch, useSelector } from "react-redux";

Modal.setAppElement("#root");

const FilterModalVacancies = ({
  isOpen,
  onClose,
  setFilters,
  selectedFilter,
}) => {
  const dispatch = useDispatch();
  const activeFilters = useSelector((state) => state.vacancies.activeFilters);
  const filterKeyForSpecialty = 'direction';

  const [localFilters, setLocalFilters] = useState({ ...activeFilters });

  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const handleFilterClick = useCallback((category, value) => {
    setLocalFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      const currentValues = updatedFilters[category] || [];
      const valueIndex = currentValues.indexOf(value);

      if (valueIndex > -1) {
        updatedFilters[category] = currentValues.filter((item) => item !== value);
      } else {
        updatedFilters[category] = [...currentValues, value];
      }

      if (selectedFilter !== "Все") {
        updatedFilters[filterKeyForSpecialty] = [selectedFilter];
      }

      return updatedFilters;
    });
  }, [selectedFilter]);

  const handleApplyFilters = useCallback(() => {
    if (selectedFilter !== "Все") {
      localFilters[filterKeyForSpecialty] = [selectedFilter];
    }
    setFilters(localFilters);
    dispatch(setActiveFilters(localFilters));
    dispatch(fetchFilteredVacancies(localFilters));
    onClose();
  }, [dispatch, localFilters, onClose, selectedFilter, setFilters]);

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
        { id: "locationStaff-2", label: "Санкт-Петербург", value: "Санкт-Петербург" },
        { id: "locationStaff-3", label: "Воронеж", value: "Воронеж" },
        { id: "locationStaff-4", label: "Оренбург", value: "Оренбург" },
        { id: "locationStaff-5", label: "Челябинск", value: "Челябинск" },
        { id: "locationStaff-6", label: "Ташкент", value: "Ташкент" },
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
      isOpen={isOpen}
      onRequestClose={onClose}
      onAfterOpen={() => {
        document.body.style.overflow = "hidden";
        document.body.classList.add("modal-open");
      }}
      onAfterClose={() => {
        document.body.style.overflow = "";
        document.body.classList.remove("modal-open");
      }}
      shouldCloseOnOverlayClick={true}
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
        onClick={onClose}
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
                      localFilters[filterGroup.filterKey]?.includes(button.value)
                        ? styles.activeFilter
                        : ""
                    }`}
                    onClick={() =>
                      handleFilterClick(filterGroup.filterKey, button.value)
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
          <button
            className={styles.applyButton}
            onClick={handleApplyFilters}
          >
            Применить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(FilterModalVacancies);
