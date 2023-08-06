import React from 'react'
import styles from "./HomeAdmin.module.scss";
import { useDispatch } from "react-redux";
import { deleteProject, searchProgectMainPostzapros, updateProjectOrderReplacement, updateProjectOrderSuccess } from '../../store/Slice/searchProjectMainSlice';
import DraggableProject from './DraggableProject';


export default function SearchPublicProject({
  projects,
  arrIdProject,
  setSearchId,
  setIsButtonDisabled,
  setSavedId,
  searchId,
  setOkMessage,
  setShowOk,
  setErrorMessage,
  setShowError,
  setReplacement,
  setReplacementMessage,
  savedId,
  isButtonDisabled,
  showError,
  errorMessage,
  showOk,
  okMessage,
  replacement,
  replacementMessage,
}) {
  const dispatch = useDispatch();

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
        setIsButtonDisabled(true);
      } catch (error) {
        console.error("Ошибка при сохранении проекта:", error);
      }
    } else {
      console.log("Проект с таким id не найден");
      setErrorMessage("Проект с таким id не найден");
      setSearchId("");
      setShowError(true); // Show the error message
      setIsButtonDisabled(true);
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
    return <div className={styles.home_admin_section__ok}>{message}</div>;
  };

  const Replacement = ({ message }) => {
    return <div className={styles.home_admin_section__ok}>{message}</div>;
  };
  return (
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
            autoComplete="off"
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
        <div>{showError && <ErrorMessage message={errorMessage} />}</div>
        <div>{showOk && <OkMessage message={okMessage} />}</div>
        <div>{replacement && <Replacement message={replacementMessage} />}</div>
      </div>
    </div>
  );
}
