import React from 'react'
import styles from "./HomeAdmin.module.scss";
import { useDispatch } from "react-redux";
import { getUpdatedArticles, searchArticleRightDelete, searchArticleRightMain } from '../../store/Slice/searchArticlePublicRightSlice';



export default function SearchPublicRight({
  articles,
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
            searcIdTwo,
            setIsBtnDisabledPublicTwo
          )
        );
      } catch (error) {}
    }
    setIsBtnDisabledPublicTwo(true);
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


  return (
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
          autoComplete="off"
        />
        <label htmlFor="idtwopublic" className={styles.form__label}>
          Укажите id статьи
        </label>
      </div>
      <div className={styles.home_admin_section__button_container_articles}>
        <button
          className={styles.home_admin_section__button}
          onClick={filterArticleTwoPublic}
          disabled={isBtnDisabledPublicTwo}
        />
      </div>
    </div>
  );
}
