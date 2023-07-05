import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Select from "react-select";
import styles from "./FormAddProject.module.scss";
import { fetchProject } from "../../../store/Slice/projectSlice";

export default function FormAddProject() {
  const dispatch = useDispatch(); 
  const [inputData, setInputData] = useState({
    title: "",
    selectCompetencies: "",
    countryCity: "",
    monthYear: "",
    viewConstruction: "",
    // dropPhoto: [],
  });

    const changeHandler = (event) => {
      if (event.target.files) {
        if (event.target.name === "dropPhoto") {
          setInputData((prev) => ({
            ...prev,
            dropPhoto: event.target.files,
          }));
        } else if (event.target.name === "dropVideo") {
          setInputData((prev) => ({
            ...prev,
            dropVideo: event.target.files[0],
          }));
        }
      } else {
        setInputData((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
      }
  };
  
   const submitHandler = async (e) => {
     e.preventDefault();
     dispatch(fetchProject(inputData, setInputData));
   };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid red",
      // остальные стили
    }),
    // другие свойства стилей
  };
  return (
    <div className={styles.form_container}>
      <div className={styles.form_container__title}>Новый проект</div>

      <form onSubmit={submitHandler}>
        <div className={styles.form_container__block_gray_one}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="Название проекта"
              name="title"
              value={inputData.title}
              onChange={changeHandler}
              required
            />
            <label htmlFor="Название проекта" className={styles.form__label}>
              Название проекта
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <Select
              styles={customStyles}
              isMulti
              name="selectCompetencies"
              options={[
                { value: "Архитектура", label: "Архитектура" },
                { value: "BIM", label: "BIM" },
                { value: "Конструкции", label: "Конструкции" },
                { value: "Инженерия", label: "Инженерия" },
                { value: "Дизайн", label: "Дизайн" },
              ]}
              className={styles.form__field}
              placeholder="Выбрать компетенции"
              value={inputData.selectCompetencies}
              onChange={changeHandler}
            />
            <label htmlFor="selectCompetencies" className={styles.form__label}>
              Выбрать компетенции
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="countryCity"
              name="countryCity"
              value={inputData.countryCity}
              onChange={changeHandler}
              required
            />
            <label htmlFor="countryCity" className={styles.form__label}>
              Страна, город
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="monthYear"
              name="monthYear"
              value={inputData.monthYear}
              onChange={changeHandler}
              required
            />
            <label htmlFor="monthYear" className={styles.form__label}>
              Месяц, год
            </label>
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <Select
              styles={customStyles}
              isMulti
              name="viewConstruction"
              value={inputData.changeHandler}
              onChange={changeHandler}
              options={[
                { value: "Архитектура", label: "Архитектура" },
                { value: "BIM", label: "BIM" },
                { value: "Конструкции", label: "Конструкции" },
                { value: "Инженерия", label: "Инженерия" },
                { value: "Дизайн", label: "Дизайн" },
              ]}
              className={styles.form__field}
              placeholder="Выберите вид строительства"
            />
            <label htmlFor="viewConstruction" className={styles.form__label}>
              Выберите вид строительства
            </label>
          </div>
        </div>
        <div className={styles.form_container__checkbox_block}>
          <div>
            Выберете ориентацию отображения карточки на странице «Проекты»
            <br />
            <span>*отображается первое изображение слайдера</span>
          </div>
        </div>
      </form>
    </div>
  );
}
