import { useDispatch } from 'react-redux';
import {
  getUpdatedArticles,
  searchArticleRightDelete,
  searchArticleRightMain,
  updateArticleRight,
} from '../../store/Slice/searchArticlePublicRightSlice';
import { useNotification } from './utils/useNotification';
import Notification from './Notification';
import { UiMarksButton, UiMarksInput, UiMarksGrayWrap } from '../ui';
import Item from './Item';
import styles from './HomeAdmin.module.scss';

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
  const { message, showMessage } = useNotification();

  const handleSearchTwoPublic = (event) => {
    setSearcIdTwo(event.target.value);
    setIsBtnDisabledPublicTwo(event.target.value === '');
  };

  const filterArticleTwoPublic = async (event) => {
    const filterArticle = articles.find((article) => article.id === parseInt(searcIdTwo, 10));

    if (filterArticle) {
      try {
        await dispatch(searchArticleRightMain(filterArticle, setSearcIdTwo, setSaveIdTwo, setIsBtnDisabledPublicTwo));
        showMessage('Публикация добавлена', 'ok');
      } catch (error) {
        console.error('Ошибка при сохранении публикации:', error);
        showMessage('Ошибка при сохранении публикации:', 'error');
      }
    } else {
      showMessage('Публикация с таким id не найдена', 'error');
      setSearcIdTwo('');
      setIsBtnDisabledPublicTwo(event.target.value === '');
    }
  };

  const handleArticleRightDelete = (formId) => {
    dispatch(searchArticleRightDelete(formId))
      .then(() => {
        dispatch(getUpdatedArticles());
        showMessage('Публикация удалена', 'delete');
      })
      .catch((error) => {
        console.error('Ошибка при удалении второй статьи:', error);
      });
  };

  const handlerUpdateReplacement = () => {
    const newId = parseInt(searcIdTwo, 10);
    const currentId = arrIdArticleRight?.[0]?.IdArticle;

    if (currentId === newId) {
      showMessage('Эта публикация уже установлена', 'error');
      return;
    }

    const filterArticle = articles.find((article) => article.id === newId);

    if (filterArticle) {
      dispatch(updateArticleRight(filterArticle, setSaveIdTwo, setSearcIdTwo, setIsBtnDisabledPublicTwo));
      showMessage('Публикация заменена', 'update');
    }
  };

  return (
    <UiMarksGrayWrap customStyles={{ width: '100%', padding: '24px' }}>
      <>
        {arrIdArticleRight &&
          arrIdArticleRight?.map((el) => (
            <Item key={el.IdArticle} project={el} id={el.IdArticle} handleFormDelete={handleArticleRightDelete} />
          ))}
      </>
      <div className={styles.wrapInputRight}>
        <UiMarksInput
          type="number"
          name="idtwopublic"
          label="Укажите id статьи"
          value={saveIdTwo !== null ? saveIdTwo : searcIdTwo}
          onChange={handleSearchTwoPublic}
          required
        />
      </div>
      <div className={styles.home_admin_section__button_container_articles}>
        {(!arrIdArticleRight || arrIdArticleRight.length === 0) && (
          <UiMarksButton
            color="blue"
            className={styles.btn}
            onClick={filterArticleTwoPublic}
            disabled={isBtnDisabledPublicTwo}>
            Добавить на главную
          </UiMarksButton>
        )}
        {arrIdArticleRight?.length > 0 && (
          <UiMarksButton
            color="blue"
            className={styles.btn}
            onClick={handlerUpdateReplacement}
            disabled={isBtnDisabledPublicTwo}>
            Заменить публикацию
          </UiMarksButton>
        )}
      </div>
      <Notification text={message.text} type={message.type} />
    </UiMarksGrayWrap>
  );
}
