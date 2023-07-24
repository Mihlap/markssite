import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./HomeAdmin.module.scss";
import { getZaprosData, searchProgectMainPostzapros } from "../store/Slice/searchProjectMainSlice";

export default function HomeAdmin({ projects }) {
  const [searchId, setSearchId] = useState(""); // Состояние для хранения введенного значения id
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [okMessage, setOkMessage] = useState("");
  const [showOk, setShowOk] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Добавлено состояние для дизейблинга кнопки

  const dispatch = useDispatch();

  // Обработчик изменения значения в инпуте поиска
  const handleSearchChange = (event) => {
    setSearchId(event.target.value);

    // Устанавливаем состояние дизейблинга кнопки в зависимости от того, пустое ли поле ввода
    setIsButtonDisabled(event.target.value === "");
  };

  const handleKeyPress = (event) => {
    // Проверяем, является ли нажатая клавиша клавишей "Enter" (код клавиши 13)
    if (event.key === "Enter") {
      filterProjectsById(); // Выполняем поиск
    }
  };

  // Функция для фильтрации проектов по введенному id
  const filterProjectsById = () => {
    const filteredProject = projects.find(
      (project) => project.id === parseInt(searchId, 10)
    );
    if (filteredProject) {
      console.log("Найденный проект:", filteredProject);
      dispatch(searchProgectMainPostzapros(filteredProject, setSearchId)); // Отправляем найденный объект на сервер
      setOkMessage("Проект добавлен");
      setShowOk(true);
    } else {
      console.log("Проект с таким id не найден");
      setErrorMessage("Проект с таким id не найден");
      setSearchId("");
      setShowError(true); // Show the error message
    }
  };

  setTimeout(() => {
    setShowError(false);
    setErrorMessage("");
  }, 5000);

  setTimeout(() => {
    setShowOk(false);
  }, 5000);

  const ErrorMessage = ({ message }) => {
    return <div style={{ color: "red" }}>{message}</div>;
  };

  const OkMessage = ({ message }) => {
    return <div style={{ color: "green" }}>{message}</div>;
  };
  // console.log(projectsArr);
  return (
    <section className={styles.home_admin_section}>
      <div className={styles.home_admin_section__title}>Проекты</div>

      <div className={styles.home_admin_section__section}>
        <div className={styles.home_admin_section__block_search}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="number"
              className={styles.form__field}
              placeholder="idshnik"
              name="idshnik"
              id="idshnik"
              value={searchId}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              required
            />
            <label htmlFor="idshnik" className={styles.form__label}>
              Укажите id статьи
            </label>
          </div>
          <button
            className={styles.home_admin_section__button}
            onClick={filterProjectsById}
            disabled={isButtonDisabled}
          />
        </div>
        {/* <div>
          <div>
            <input
              style={{ background: "tomato" }}
              type="number"
              name=""
              id=""
            />
            <button>добавить на главную</button>
          </div>
        </div> */}
      </div>
      <div>{showError && <ErrorMessage message={errorMessage} />}</div>
      <div>{showOk && <OkMessage message={okMessage} />}</div>

      {/* <div className={styles.home_admin_section__title}>Публикации</div>
      <div>
        <div>
          <input style={{ background: "orange" }} type="number" name="" id="" />
          <button>добавить на главную</button>
        </div>
        <div>
          <div>
            <input
              style={{ background: "tomato" }}
              type="number"
              name=""
              id=""
            />
            <button>добавить на главную</button>
          </div>
        </div>
      </div> */}

      <div></div>
    </section>
  );
}
