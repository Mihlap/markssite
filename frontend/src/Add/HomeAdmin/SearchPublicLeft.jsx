import React, { useEffect, useState } from 'react'
import styles from "./HomeAdmin.module.scss";
import { useDispatch } from "react-redux";
import IDPublicLeft from './IDPublicLeft';
import { getUpdatedArticles, searchArticleLeftDelete, searchArticleLeftMain, updateArticleLeft } from '../../store/Slice/searchArticlePublicLeftSlice';

export default function SearchPublicLeft({
  articles,
  arrIdArticleLeft,
  saveIdOne,
  searcIdOne,
  setSaveIdOne,
  setSearcIdOne,
  setIsBtnDisabledPublicOne,
  isBtnDisabledPublicOne
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


  const handleSearchOnePublic = (event) => {
    setSearcIdOne(event.target.value);
    setIsBtnDisabledPublicOne(event.target.value === "");
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

  const filterArticleOnePublic = async (event) => {
    const filterArticle = articles.find(
      (article) => article.id === parseInt(searcIdOne, 10)
    );

    if (filterArticle) {
      try {
        await dispatch(
          searchArticleLeftMain(
            filterArticle,
            setSearcIdOne,
            setSaveIdOne,
            setIsBtnDisabledPublicOne
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
      setSearcIdOne("");
      setShowOk(false);
      setDeleteOk(false);
      setUpdateOk(false);
      setIsBtnDisabledPublicOne(event.target.value === "");
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

const handleArticleLeftDelete = (formId) => {
  dispatch(searchArticleLeftDelete(formId))
    .then(() => {
      dispatch(getUpdatedArticles());
      setDeleteMessage("Публикация удалена");
      setDeleteOk(true);
      setShowError(false);
      setShowOk(false);
      setUpdateOk(false);

    })
    .catch((error) => {
      console.error("Ошибка при удалении статьи:", error);
    });
};

  const handlerUpdateReplacement = () => {
    const filterArticle = articles.find(
      (article) => article.id === parseInt(searcIdOne, 10)
    );

    if (filterArticle) {
      dispatch(
        updateArticleLeft(
          filterArticle,
          setSaveIdOne,
          setSearcIdOne,
          setIsBtnDisabledPublicOne
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
        {arrIdArticleLeft &&
          arrIdArticleLeft?.map((el) => (
            <IDPublicLeft
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
          autoComplete="off"
        />
        <label htmlFor="idonepublic" className={styles.form__label}>
          Укажите id статьи
        </label>
      </div>
      <div className={styles.home_admin_section__button_container_articles}>
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
      <div>{showError && <Message message={errorMessage} type="error" />}</div>
      <div>{showOk && <Message message={okMessage} type="ok" />}</div>
      <div>{deleteOk && <Message message={deleteMessage} type="delete" />}</div>
      <div>{updateOk && <Message message={updateMessage} type="update" />}</div>
    </div>
  );
}
