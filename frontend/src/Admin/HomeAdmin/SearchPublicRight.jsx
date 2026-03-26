import React, { useEffect, useState } from 'react';
import styles from './HomeAdmin.module.scss';
import { useDispatch } from 'react-redux';
import {
  getUpdatedArticles,
  searchArticleRightDelete,
  searchArticleRightMain,
  updateArticleRight,
} from '../../store/Slice/searchArticlePublicRightSlice';
import IDPublicRight from './IDPublicRight';

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
  const [message, setMessage] = useState({
    text: '',
    type: null,
  });

  const handleSearchTwoPublic = (event) => {
    setSearcIdTwo(event.target.value);
    setIsBtnDisabledPublicTwo(event.target.value === '');
  };

  useEffect(() => {
    if (message.type) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const filterArticleTwoPublic = async (event) => {
    const filterArticle = articles.find((article) => article.id === parseInt(searcIdTwo, 10));

    if (filterArticle) {
      try {
        await dispatch(searchArticleRightMain(filterArticle, setSearcIdTwo, setSaveIdTwo, setIsBtnDisabledPublicTwo));

        showMessage('Публикация добавлена', 'ok');
      } catch (error) {
        console.error('Ошибка при сохранении проекта:', error);
        showMessage('Ошибка при сохранении проекта:', 'error');
      }
    } else {
      // console.log("Публикация с таким id не найдена");
      showMessage('Публикация с таким id не найдена', 'error');
      setSearcIdTwo('');
      setIsBtnDisabledPublicTwo(event.target.value === '');
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
      update: styles.home_admin_section__update,
    };
    return <div className={typesToStyles[type] || styles.home_admin_section__ok}>{text}</div>;
  };

  const handleArticleRightDelete = (formId) => {
    dispatch(searchArticleRightDelete(formId))
      .then(() => {
        dispatch(getUpdatedArticles());
        showMessage('Публикация удалена');
      })
      .catch((error) => {
        console.log('Ошибка при удалении второй статьи:', error);
      });
  };

  const handlerUpdateReplacement = () => {
    const filterArticle = articles.find((article) => article.id === parseInt(searcIdTwo, 10));

    if (filterArticle) {
      //  console.log("ЗАМЕНА публикации", filterArticle);
      dispatch(updateArticleRight(filterArticle, setSaveIdTwo, setSearcIdTwo, setIsBtnDisabledPublicTwo));
      showMessage('Публикация заменена', 'update');
    }
  };

  return (
    <div className={styles.home_admin_section__block_search}>
      <div className={styles.home_admin_section__id_container}>
        {arrIdArticleRight &&
          arrIdArticleRight?.map((el) => (
            <IDPublicRight key={el.id} article={el} handleArticleRightDelete={handleArticleRightDelete} />
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
      {message.type && <Message text={message.text} type={message.type} />}
    </div>
  );
}
