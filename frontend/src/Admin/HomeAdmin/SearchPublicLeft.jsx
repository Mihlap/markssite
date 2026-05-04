import { useDispatch } from 'react-redux';
import {
  getUpdatedArticles,
  searchArticleLeftDelete,
  searchArticleLeftMain,
  updateArticleLeft,
} from '../../store/Slice/searchArticlePublicLeftSlice';
import { UiMarksButton, UiMarksInput, UiMarksGrayWrap } from '../ui';
import Item from './Item';
import { useNotification } from './utils/useNotification';
import Notification from './Notification';

import styles from './HomeAdmin.module.scss';

export default function SearchPublicLeft({
  articles,
  arrIdArticleLeft,
  saveIdOne,
  searcIdOne,
  setSaveIdOne,
  setSearcIdOne,
  setIsBtnDisabledPublicOne,
  isBtnDisabledPublicOne,
}) {
  const dispatch = useDispatch();
  const { message, showMessage } = useNotification();

  const handleSearchOnePublic = (event) => {
    setSearcIdOne(event.target.value);
    setIsBtnDisabledPublicOne(event.target.value === '');
  };

  const filterArticleOnePublic = async (event) => {
    const filterArticle = articles.find((article) => article.id === parseInt(searcIdOne, 10));

    if (filterArticle) {
      try {
        await dispatch(searchArticleLeftMain(filterArticle, setSearcIdOne, setSaveIdOne, setIsBtnDisabledPublicOne));
        showMessage('Публикация добавлена', 'ok');
      } catch (error) {
        showMessage('Ошибка при сохранении проекта:', 'error');
      }
    } else {
      showMessage('Публикация с таким id не найдена', 'error');
      setSearcIdOne('');
      setIsBtnDisabledPublicOne(event.target.value === '');
    }
  };

  const handleArticleLeftDelete = (formId) => {
    dispatch(searchArticleLeftDelete(formId))
      .then(() => {
        dispatch(getUpdatedArticles());
        showMessage('Публикация удалена', 'delete');
      })
      .catch((error) => {
        console.error('Ошибка при удалении статьи:', error);
      });
  };

  const handlerUpdateReplacement = () => {
    const newId = parseInt(searcIdOne, 10);
    const currentId = arrIdArticleLeft?.[0]?.IdArticle;

    if (currentId === newId) {
      showMessage('Эта публикация уже установлена', 'error');
      return;
    }
    const filterArticle = articles.find((article) => article.id === parseInt(searcIdOne, 10));

    if (filterArticle) {
      dispatch(updateArticleLeft(filterArticle, setSaveIdOne, setSearcIdOne, setIsBtnDisabledPublicOne));
      showMessage('Публикация заменена', 'update');
    }
  };

  return (
    <UiMarksGrayWrap customStyles={{ width: '100%', padding: '24px' }}>
      <>
        {arrIdArticleLeft &&
          arrIdArticleLeft?.map((el) => (
            <Item key={el.IdArticle} project={el} id={el.IdArticle} handleFormDelete={handleArticleLeftDelete} />
          ))}
      </>
      <div className={styles.wrapInputLeft}>
        <UiMarksInput
          type="number"
          name="idonepublic"
          label="Укажите id статьи"
          value={saveIdOne !== null ? saveIdOne : searcIdOne}
          onChange={handleSearchOnePublic}
          required
        />
      </div>
      <div className={styles.home_admin_section__button_container_articles}>
        {(!arrIdArticleLeft || arrIdArticleLeft.length === 0) && (
          <UiMarksButton
            color="blue"
            className={styles.btn}
            onClick={filterArticleOnePublic}
            disabled={isBtnDisabledPublicOne}>
            Добавить на главную
          </UiMarksButton>
        )}
        {arrIdArticleLeft?.length > 0 && (
          <UiMarksButton
            color="blue"
            className={styles.btn}
            onClick={handlerUpdateReplacement}
            disabled={isBtnDisabledPublicOne}>
            Заменить публикацию
          </UiMarksButton>
        )}
      </div>
      <Notification text={message.text} type={message.type} />
    </UiMarksGrayWrap>
  );
}
