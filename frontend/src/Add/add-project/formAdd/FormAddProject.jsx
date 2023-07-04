import React from "react";
import Select from "react-select";
import styles from "./FormAddProject.module.scss";

export default function FormAddProject() {

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

      <form>
        <div className={styles.form_container__block_gray_one}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="input"
              className={styles.form__field}
              placeholder="Название проекта"
              name="title"
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
