import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./HomeAdmin.module.scss";
import {
  deleteProject,
  searchProgectMainPostzapros,
  updateProjectOrderReplacement,
  updateProjectOrderSuccess,
} from "../../store/Slice/searchProjectMainSlice";
import { useSelector } from "react-redux";
import { arrIdProjectSelector } from "./utils/HomeAdminSelectors";
import { arrIdArticlesLeftSelector } from "./utils/ArticleLeftSelectors";
import DraggableProject from "./DraggableProject";
import { getUpdatedArticles, searchArticleLeftDelete, searchArticleLeftMain, updateArticleLeft } from "../../store/Slice/searchArticlePublicLeftSlice";
import OneCard from "./OneCard";

export default function HomeAdmin({ projects, articles, articleLeft }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [okMessage, setOkMessage] = useState("");
  const [showOk, setShowOk] = useState(false);
  const [replacementMessage, setReplacementMessage] = useState("");
  const [replacement, setReplacement] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isBtnDisabledPublicOne, setIsBtnDisabledPublicOne] = useState(true);
  const [isBtnDisabledPublicTwo, setIsBtnDisabledPublicTwo] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [savedId, setSavedId] = useState(null);
  // константы для первой публикации
  const [searcIdOne, setSearcIdOne] = useState("");
  const [saveIdOne, setSaveIdOne] = useState(null);
  // констатнты для второй публикации

  const [searcIdTwo, setSearcIdTwo] = useState("");
  const [saveIdTwo, setSaveIdTwo] = useState(null);

  const arrIdProject = useSelector(arrIdProjectSelector);
  const arrIdArticleLeft = useSelector(arrIdArticlesLeftSelector);

  const dispatch = useDispatch();

  // обработчик для инпута который ищет id для левой публикации на главной ))
  const handleSearchOnePublic = (event) => {
    setSearcIdOne(event.target.value);
    setIsBtnDisabledPublicOne(event.target.value === "");
  };

  const filterArticleOnePublic = async () => {
    const filterArticle = articles.find(
      (article) => article.id === parseInt(searcIdOne, 10)
    );

    if (filterArticle) {
      console.log("Найденная публикация", filterArticle);

      try {
        await dispatch(
          searchArticleLeftMain(
            filterArticle,
            setSearcIdOne,
            setSaveIdOne,
            setIsBtnDisabledPublicOne
          )
        );
      } catch (error) {}
    }
  };

  const handlerUpdateReplacement = () => {
      const filterArticle = articles.find(
        (article) => article.id === parseInt(searcIdOne, 10)
    );
    
    if (filterArticle) {
      console.log("ЗАМЕНА публикации", filterArticle);
      dispatch(updateArticleLeft(filterArticle));
    }
  }

  // обработчик для инпута который ищет id для правой публикации на главной

  const handleSearchTwoPublic = (event) => {
    setSearcIdTwo(event.target.value);
    setIsBtnDisabledPublicTwo(event.target.value === "");
  };

  const filterArticleTwoPublic = async () => {
    const filterArticle = articles.find(
      (article) => article.id === parseInt(searcIdTwo, 10)
    );

    if (filterArticle) {
      console.log("найденная вторааааая публикация", filterArticle);
    }
    setIsBtnDisabledPublicTwo(true);
  };

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

 const handleArticleLeftDelete = (formId) => {
   dispatch(searchArticleLeftDelete(formId))
     .then(() => {
       // Если запрос на удаление успешно выполнен, вызываем действие для получения обновленного списка статей
       dispatch(getUpdatedArticles());
     })
     .catch((error) => {
       // Обрабатываем ошибку, если она произойдет
       console.error("Ошибка при удалении статьи:", error);
     });
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
    <section className={styles.home_admin_section}>
      <div className={styles.home_admin_section__title}>Публикации</div>
      <div className={styles.home_admin_section__article_container}>
        <div className={styles.home_admin_section__block_search}>
          <div className={styles.home_admin_section__id_container}>
            {arrIdArticleLeft?.map((el) => (
              <OneCard
                key={el.id}
                article={el}
                handleArticleLeftDelete={handleArticleLeftDelete}
              />
            ))}
          </div>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="number"
              className={styles.form__field}
              placeholder="idonepublic"
              name="idonepublic"
              id="idonepublic"
              value={saveIdOne !== null ? saveIdOne : searcIdOne}
              onChange={handleSearchOnePublic}
              // onKeyPress={handleKeyPress}
              required
            />
            <label htmlFor="idonepublic" className={styles.form__label}>
              Укажите id статьи
            </label>
          </div>

          {(!arrIdArticleLeft || arrIdArticleLeft.length === 0) && (
            <button
              className={styles.home_admin_section__button}
              onClick={filterArticleOnePublic}
              disabled={isBtnDisabledPublicOne}
            />
          )}

          {arrIdArticleLeft?.length > 0 && (
            <button
              className={styles.home_admin_section__button_replacement}
              onClick={handlerUpdateReplacement}
              disabled={isBtnDisabledPublicOne}
            />
          )}
        </div>
        <div className={styles.home_admin_section__block_search}>
          <div className={`${styles.form__group} ${styles.field}`}>
            <input
              type="number"
              className={styles.form__field}
              placeholder="idtwopublic"
              name="idtwopublic"
              id="idtwopublic"
              value={saveIdTwo !== null ? saveIdTwo : searcIdTwo}
              onChange={handleSearchTwoPublic}
              // onKeyPress={handleKeyPress}
              required
            />
            <label htmlFor="idtwopublic" className={styles.form__label}>
              Укажите id статьи
            </label>
          </div>
          <button
            className={styles.home_admin_section__button}
            onClick={filterArticleTwoPublic}
            disabled={isBtnDisabledPublicTwo}
          />
        </div>
      </div>

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
