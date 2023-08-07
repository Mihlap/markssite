import React from 'react'
import styles from "./HomeAdmin.module.scss";
import { useDispatch } from "react-redux";
import IDPublicLeft from './IDPublicLeft';
import { getUpdatedArticles, searchArticleLeftDelete, searchArticleLeftMain, updateArticleLeft } from '../../store/Slice/searchArticlePublicLeftSlice';

export default function SearchPublicLeft({
  articles,
  arrIdArticleLeft,
  setSearcIdOne,
  setIsBtnDisabledPublicOne,
  saveIdOne,
  setSaveIdOne,
  searcIdOne,
  isBtnDisabledPublicOne,
}) {
  const dispatch = useDispatch();

  const handleSearchOnePublic = (event) => {
    setSearcIdOne(event.target.value);
    setIsBtnDisabledPublicOne(event.target.value === "");
  };

  //  const handleKeyPress = (event) => {
  //    // Проверяем, является ли нажатая клавиша клавишей "Enter" (код клавиши 13)
  //    if (event.key === "Enter") {
  //      filterArticleOnePublic(); // Выполняем поиск
  //    }
  //  };

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

  const handlerUpdateReplacement = () => {
    const filterArticle = articles.find(
      (article) => article.id === parseInt(searcIdOne, 10)
    );

    if (filterArticle) {
      console.log("ЗАМЕНА публикации", filterArticle);
      dispatch(
        updateArticleLeft(
          filterArticle,
          setSaveIdOne,
          setSearcIdOne,
          setIsBtnDisabledPublicOne
        )
      );
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
    </div>
  );
}
