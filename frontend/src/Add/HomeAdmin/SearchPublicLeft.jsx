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
    const [message, setMessage] = useState({
      text: "",
      type: null,
    });


  const handleSearchOnePublic = (event) => {
    setSearcIdOne(event.target.value);
    setIsBtnDisabledPublicOne(event.target.value === "");
  };

     useEffect(() => {
       if (message.type) {
         const timer = setTimeout(() => {
           setMessage({ text: "", type: null });
         }, 3000);
         return () => clearTimeout(timer);
       }
     }, [message]);

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
      } catch (error) {
        showMessage("Ошибка при сохранении проекта:", "error");
      }
    } else {
      showMessage("Публикация с таким id не найдена", "error");
      setSearcIdOne("");
      setIsBtnDisabledPublicOne(event.target.value === "");
    }
  };

 const showMessage = (text, type) => {
    setMessage({ text, type });
 };
  
  const Message = ({ text, type }) => {
    const typesToStyles = {
      error: styles.home_admin_section__error,
      ok: styles.home_admin_section__ok,
      delete: styles.home_admin_section__delete,
      update: styles.home_admin_section__update
    };
    return <div className={typesToStyles[type] || styles.home_admin_section__ok}>{text}</div>;
  };

const handleArticleLeftDelete = (formId) => {
  dispatch(searchArticleLeftDelete(formId))
    .then(() => {
      dispatch(getUpdatedArticles());
      showMessage("Публикация удалена", "delete");
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
      showMessage("Публикация заменена", "update");
    }
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
        {message.type && <Message text={message.text} type={message.type} />}
    </div>
  );
}
