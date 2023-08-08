import React from 'react'
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
      try {
        await dispatch(
          searchArticleRightMain(
            filterArticle,
            setSearcIdTwo,
            setSaveIdTwo,
            setIsBtnDisabledPublicTwo
          )
        );

      } catch (error) {}
    }
  };

  const handleArticleRightDelete = (formId) => {
    dispatch(searchArticleRightDelete(formId))
      .then(() => {
        dispatch(getUpdatedArticles());
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
     }
   };

console.log(arrIdArticleRight);
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
    </div>
  );
}
