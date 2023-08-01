import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./HomeAdmin.module.scss";
import {
  deleteProject,
  searchProgectMainPostzapros,
  updateProjectOrderReplacement,
  updateProjectOrderSuccess,
} from "../store/Slice/searchProjectMainSlice";
import { useSelector } from "react-redux";
import { arrIdProjectSelector } from "./HomeAdminSelectors";
import DraggableProject from "./DraggableProject";

export default function HomeAdmin({ projects }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [okMessage, setOkMessage] = useState("");
  const [showOk, setShowOk] = useState(false);
  const [replacementMessage, setReplacementMessage] = useState('');
  const [replacement, setReplacement] = useState(false);
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
        ); 


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

  setTimeout(() => {
    setReplacement(false);
  }, 4000);

  const updateProjectOrder = (updatedProjects) => {
    return (dispatch) => {
      dispatch(updateProjectOrderSuccess(updatedProjects));
    };
  };

  const moveProject = (draggedIndex, targetIndex) => {
    const updatedProjects = [...arrIdProject];
    const draggedProject = updatedProjects[draggedIndex];
    updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(targetIndex, 0, draggedProject);

    // Вызываем действие для обновления порядка элементов
    dispatch(updateProjectOrder(updatedProjects));

    setReplacementMessage("Проект перемещен");
    setReplacement(true);
    // И тут же сохраняем новый порядок в базу данных
    dispatch(updateProjectOrderReplacement(updatedProjects));
  };

  const ErrorMessage = ({ message }) => {
    return <div className={styles.home_admin_section__error}>{message}</div>;
  };

  const OkMessage = ({ message }) => {
    return ( <div className={styles.home_admin_section__ok}>{message}</div>
    );
  };

  const Replacement = ({ message }) => {
    return <div className={styles.home_admin_section__ok}>{message}</div>;
  };

  console.log(arrIdProject);
  return (
    <section className={styles.home_admin_section}>
      <div className={styles.home_admin_section__title}>Проекты</div>

      <div className={styles.home_admin_section__section}>
        <div className={styles.home_admin_section__block_search}>
          <div className={styles.home_admin_section__id_container}>
            {arrIdProject?.map((el, index) => (
              <DraggableProject
                key={index}
                project={el}
                index={index}
                moveProject={moveProject}
                handleFormDelete={handleFormDelete}
              />
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
          {/* <button
            style={{
              backgroundColor: "red",
              width: "150px",
              height: "20px"
            }}
            onClick={handleSaveOrderClick}
          >
            Сохранить порядок
          </button> */}
          <button
            className={styles.home_admin_section__button}
            onClick={filterProjectsById}
            disabled={isButtonDisabled}
          />
          <div>{showError && <ErrorMessage message={errorMessage} />}</div>
          <div>{showOk && <OkMessage message={okMessage} />}</div>
          <div>
            {replacement && <Replacement message={replacementMessage} />}
          </div>
        </div>
      </div>
    </section>
  );
}
