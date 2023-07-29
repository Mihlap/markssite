import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./HomeAdmin.module.scss";
import { deleteProject, searchProgectMainPostzapros } from "../store/Slice/searchProjectMainSlice";
import { useSelector } from "react-redux";
import { arrIdProjectSelector } from "./HomeAdminSelectors";

export default function HomeAdmin({ projects }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [okMessage, setOkMessage] = useState("");
  const [showOk, setShowOk] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [savedId, setSavedId] = useState(null);

  // Use the memoized selector with useSelector
  const arrIdProject = useSelector(arrIdProjectSelector);

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
  const filterProjectsById = async () => {
    const filteredProject = projects.find(
      (project) => project.id === parseInt(searchId, 10)
    );
    if (filteredProject) {
      console.log("Найденный проект:", filteredProject);

      try {
        await dispatch(
          searchProgectMainPostzapros(filteredProject, setSearchId, setSavedId)
        ); // Отправляем найденный объект на сервер

        // Установим id сохраненного объекта в состояние savedId

        setOkMessage("Проект добавлен");
        setShowOk(true);
      } catch (error) {
        console.error("Ошибка при сохранении проекта:", error);
      }
    } else {
      console.log("Проект с таким id не найден");
      setErrorMessage("Проект с таким id не найден");
      setSearchId("");
      setShowError(true); // Show the error message
    }
  };

  const handleFormDelete = (formId) => {
    dispatch(deleteProject(formId));
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
  return (
    <section className={styles.home_admin_section}>
      <div className={styles.home_admin_section__title}>Проекты</div>

      <div className={styles.home_admin_section__section}>
        <div className={styles.home_admin_section__block_search}>
          {/* <div>{arrIdProject}</div> */}
          {/* <div>{JSON.stringify(arrIdProject)}</div> */}
          <div className={styles.home_admin_section__id_container}>
            {arrIdProject?.map((el, index) => (
              <div className={styles.home_admin_section__id_block} key={index}>
                id: {JSON.stringify(el.IdProject)}
                <button
                  className={styles.home_admin_section__button_del}
                  onClick={() => handleFormDelete(el.IdProject)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M9 9L15 15"
                      stroke="#1D2E43"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15 9L9 15"
                      stroke="#1D2E43"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="number"
              className={styles.form__field}
              placeholder="idshnik"
              name="idshnik"
              id="idshnik"
              value={savedId !== null ? savedId : searchId}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              required
            />
            <label htmlFor="idshnik" className={styles.form__label}>
              Укажите id проекта
            </label>
          </div>
          <button
            className={styles.home_admin_section__button}
            onClick={filterProjectsById}
            disabled={isButtonDisabled}
          />
        </div>
      </div>
      <div>{showError && <ErrorMessage message={errorMessage} />}</div>
      <div>{showOk && <OkMessage message={okMessage} />}</div>
    </section>
  );
}
