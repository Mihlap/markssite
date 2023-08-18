import React, { useEffect, useState } from 'react'
import styles from "./HomeAdmin.module.scss";
import { useDispatch } from "react-redux";
import { getUpdatedArticles, searchArticleRightDelete, searchArticleRightMain, updateArticleRight } from '../../store/Slice/searchArticlePublicRightSlice';
import IDPublicRight from "./IDPublicRight";



export default function SearchPublicRight({
  articles,
  arrIdArticleRight,
  saveIdTwo,
  searcIdTwo,
  setSaveIdTwo,
  setSearcIdTwo,
  setIsBtnDisabledPublicTwo,
  isBtnDisabledPublicTwo,
}) {
   const dispatch = useDispatch();
   const [errorMessage, setErrorMessage] = useState("");
   const [showError, setShowError] = useState(false);
   const [okMessage, setOkMessage] = useState("");
   const [showOk, setShowOk] = useState(false);
   const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteOk, setDeleteOk] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateOk, setUpdateOk] = useState(false);
  
  const handleSearchTwoPublic = (event) => {
    setSearcIdTwo(event.target.value);
    setIsBtnDisabledPublicTwo(event.target.value === "");
  };

   useEffect(() => {
     const timer = setTimeout(() => {
       setShowError(false);
       setShowOk(false);
       setDeleteOk(false);
       setUpdateOk(false);
     }, 3000);

     return () => clearTimeout(timer);
   }, [showError, showOk, deleteOk, updateOk]);

  const filterArticleTwoPublic = async (event) => {
    const filterArticle = articles.find(
      (article) => article.id === parseInt(searcIdTwo, 10)
    );

    if (filterArticle) {
      console.log("найденная вторааааая публикация", filterArticle);
      try {
        await dispatch(
          searchArticleRightMain(
            filterArticle,
            setSearcIdTwo,
            setSaveIdTwo,
            setIsBtnDisabledPublicTwo
          )
        );

        showMessage("Публикация добавлена", "ok");
        setShowError(false);
        setDeleteOk(false);
        setUpdateOk(false);
      } catch (error) {
        console.error("Ошибка при сохранении проекта:", error);
        showMessage("Ошибка при сохранении проекта:", "error");
      }
    } else {
      console.log("Публикация с таким id не найдена");
      showMessage("Публикация с таким id не найдена", "error");
      setSearcIdTwo("");
      setShowOk(false);
      setDeleteOk(false);
      setUpdateOk(false);
      setIsBtnDisabledPublicTwo(event.target.value === "");
    }
  };

  const showMessage = (message, type) => {
    switch (type) {
      case "error":
        setErrorMessage(message);
        setShowError(true);
        break;
      case "ok":
        setOkMessage(message);
        setShowOk(true);
        break;
      case "delete":
        setDeleteMessage(message);
        setDeleteOk(true);
        break;
      case "update":
        setUpdateMessage(message);
        setUpdateOk(true);
        break;
      default:
        break;
    }
  };

  const handleArticleRightDelete = (formId) => {
    dispatch(searchArticleRightDelete(formId))
      .then(() => {
        dispatch(getUpdatedArticles());
        setDeleteMessage("Публикация удалена");
        setDeleteOk(true);
        setShowError(false);
        setShowOk(false);
        setUpdateOk(false);
      })
      .catch((error) => {
        console.log("Ошибка при удалении второй статьи:", error);
      });
  }

   const handlerUpdateReplacement = () => {
     const filterArticle = articles.find(
       (article) => article.id === parseInt(searcIdTwo, 10)
     );

     if (filterArticle) {
       console.log("ЗАМЕНА публикации", filterArticle);
       dispatch(
         updateArticleRight(
           filterArticle,
           setSaveIdTwo,
           setSearcIdTwo,
           setIsBtnDisabledPublicTwo
         )
       );
        setUpdateMessage("Публикация заменена");
        setUpdateOk(true);
        setDeleteOk(false);
        setShowError(false);
        setShowOk(false);
     }
   };
  
  const Message = ({ message, type }) => {
    let className = styles.home_admin_section__ok; // Default class for other types

    if (type === "error") {
      className = styles.home_admin_section__error;
    } else if (type === "delete") {
      className = styles.home_admin_section__delete;
    } else if (type === "update") {
      className = styles.home_admin_section__update;
    }

    return <div className={className}>{message}</div>;
  };

  return (
    <div className={styles.home_admin_section__block_search}>
      <div className={styles.home_admin_section__id_container}>
        {arrIdArticleRight &&
          arrIdArticleRight?.map((el) => (
            <IDPublicRight
              key={el.id}
              article={el}
              handleArticleRightDelete={handleArticleRightDelete}
            />
          ))}
      </div>
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
          autoComplete="off"
        />
        <label htmlFor="idtwopublic" className={styles.form__label}>
          Укажите id статьи
        </label>
      </div>
      <div className={styles.home_admin_section__button_container_articles}>
        {(!arrIdArticleRight || arrIdArticleRight.length === 0) && (
          <button
            className={styles.home_admin_section__button}
            onClick={filterArticleTwoPublic}
            disabled={isBtnDisabledPublicTwo}
          />
        )}
        {arrIdArticleRight?.length > 0 && (
          <button
            className={styles.home_admin_section__button_replacement}
            onClick={handlerUpdateReplacement}
            disabled={isBtnDisabledPublicTwo}
          />
        )}
      </div>
      <div>{showError && <Message message={errorMessage} type="error" />}</div>
      <div>{showOk && <Message message={okMessage} type="ok" />}</div>
      <div>{deleteOk && <Message message={deleteMessage} type="delete" />}</div>
      <div>{updateOk && <Message message={updateMessage} type="update" />}</div>
    </div>
  );
}
