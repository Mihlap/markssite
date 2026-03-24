import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../style/style-card.module.scss';
import { deleteFormArticle, getFetchFormArticle } from '../../../store/Slice/articleSlice';
import { fetchToggleStateForButton2Async } from '../../../store/Slice/toggleSlice';
import cat from '../../../img/default-photo.jpeg';
import Edit from '../../icon/Edit.svg';
import { UiMarksButton, UiMarksDialog } from '../../ui';
import ArticlesForm from './form/ArticlesForm';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function AddNews({ user }) {
  const dispatch = useDispatch();
  const article = useSelector((state) => state.article.article);
  const loading = useSelector((state) => state.article.loading);
  const error = useSelector((state) => state.article.error);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [deleteModalState, setDeleteModalState] = useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFormValid, setIsFormValid] = React.useState(false);
  const [isFormLoading, setIsFormLoading] = React.useState(false);
  const [editDataForNewForm, setEditDataForNewForm] = React.useState(null);

  const isMountedRef = useRef(true);
  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);
  const [showExitWarning, setShowExitWarning] = React.useState(false);

  useEffect(() => {
    dispatch(getFetchFormArticle());
    dispatch(fetchToggleStateForButton2Async());
  }, [dispatch]);

  const handleDeleteModalOpen = useCallback((id) => {
    setDeleteModalState((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  }, []);

  const handleDeleteModalClose = useCallback((id) => {
    setDeleteModalState((prevState) => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });
  }, []);

  const handleCopyClick = useCallback(async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      if (isMountedRef.current) {
        setIsCopied(true);
        setCopiedId(id);
      }
    } catch (err) {
      console.error('Unable to copy article to clipboard:', err);
    }
  }, []);

  const handleEditWithNewForm = useCallback(
    (id) => {
      const articleToEdit = article.find((el) => el.id === id);
      setEditDataForNewForm(articleToEdit);
      setIsOpen(true);
    },
    [article]
  );

  const handleFormDelete = useCallback(
    (formId) => {
      dispatch(deleteFormArticle(formId));
      handleDeleteModalClose();
    },
    [dispatch, handleDeleteModalClose]
  );

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
        setCopiedId('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleDialogClose = useCallback(() => {
    if (isFormDirtyRef.current) {
      setShowExitWarning(true);
    } else {
      setIsOpen(false);
      setEditDataForNewForm(null);
      setIsFormLoading(false);
    }
  }, []);

  const handleForceClose = useCallback(() => {
    isFormDirtyRef.current = false;
    setShowExitWarning(false);
    setIsOpen(false);
    setEditDataForNewForm(null);
    setIsFormLoading(false);
    formRef.current?.resetForm();
  }, []);

  const handleDirtyChange = useCallback((dirty) => {
    isFormDirtyRef.current = dirty;
  }, []);

  return (
    <>
      <>
        <UiMarksButton defaultStyle="blue" size="large" icon onClick={() => setIsOpen(true)}>
          Добавить новость
        </UiMarksButton>
        {loading ? (
          <p>загрузка. . . </p>
        ) : error ? (
          <div className={styles.card_components_admin__errore_div}>Ошибка загрузки данных.</div>
        ) : article && article.length === 0 ? (
          <div className={styles.card_components_admin__null_project}>Новостей пока нет.</div>
        ) : (
          <div className={styles.card_components_admin__block_map}>
            {Array.isArray(article) &&
              [...article]?.map((el) => {
                const firstPhoto = el && el?.imageTitle ? el.imageTitle?.split(', ')[0] : null;
                const defaultPhoto = cat;
                const photoSrc =
                  firstPhoto && firstPhoto.includes('https')
                    ? firstPhoto
                    : `${bucket_url}/images/imageArticle/${firstPhoto || defaultPhoto}`;

                return (
                  <React.Fragment key={el.id}>
                    <div key={el.id} className={styles.cart_project_container}>
                      <div className={styles.cart_project_container__imageContainer}>
                        <img
                          className={styles.cart_project_container__img}
                          loading="lazy"
                          src={photoSrc}
                          alt="photo_articles"
                        />
                        {user?.name === 'obezyankaa' || user?.name === 'Pokemon' ? (
                          <div className={styles.del_block}>
                            <button className={styles.buttom_del} onClick={() => handleDeleteModalOpen(el.id)}>
                              <label htmlFor="delete" className={styles.label}>
                                <div className={`${styles.wrapper}`}>
                                  <div className={`${styles.lid}`}>
                                    <div className={styles.container_vedro}>
                                      <div className={styles.triangle_left}></div>
                                      <div className={styles.rectangle}></div>
                                      <div className={styles.triangle_right}></div>
                                    </div>
                                  </div>
                                  <div className={`${styles.can}`}></div>
                                  <span>delete</span>
                                </div>
                              </label>
                            </button>
                          </div>
                        ) : null}
                        {user?.name === 'obezyankaa' || user?.name === 'manager' || user?.name === 'Pokemon' ? (
                          <div className={styles.edit_block}>
                            <button className={styles.buttom_edit} onClick={() => handleEditWithNewForm(el.id)}>
                              <label htmlFor="edit" className={styles.label}>
                                <div className={`${styles.wrapper}`}>
                                  <img src={Edit} alt={Edit} />
                                </div>
                              </label>
                            </button>
                          </div>
                        ) : null}
                      </div>
                      <div className={styles.cart_project__content}>
                        <span className={styles.cart_project_container__title}>{el.title}</span>
                      </div>
                      <div className={styles.cart_project_container__id_block}>
                        <div className={styles.cart_project_container__id_text}>id: {el.id}</div>
                        {isCopied && el.id === copiedId && (
                          <>
                            <div className={styles.cart_project_container__copyMessage}>id скопирован</div>
                            <div className={styles.cart_project_container__copyButton_img_copu_deffalt} />
                          </>
                        )}
                        <button
                          className={styles.cart_project_container__copyButton}
                          onClick={() => handleCopyClick(el.id)}>
                          <div className={styles.cart_project_container__copyButton_img_copu_ok} />
                        </button>
                      </div>
                    </div>
                    {deleteModalState[el.id] && (
                      <div className={styles.delete_modal_container}>
                        <div className={styles.delete_modal_block}>
                          <div className={styles.delete_modal_block__title}>
                            Вы точно хотите удалить новость <br /> «{el.title}»
                          </div>
                          <p className={styles.delete_modal_block__text}>Удаленную новость нельзя будет вернуть</p>

                          <div className={styles.button_block}>
                            <button
                              className={`${styles.button_block__cancel} ${styles.delete_modal_button_cancel}`}
                              onClick={() => handleDeleteModalClose(el.id)}
                            />
                            <button
                              className={`${styles.button_block__save} ${styles.delete_modal_button_delete}`}
                              onClick={() => handleFormDelete(el.id)}
                            />
                          </div>

                          <button
                            className={styles.card_components_admin__close_button}
                            onClick={() => handleDeleteModalClose(el.id)}></button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        )}
      </>
      <UiMarksDialog
        isOpen={isOpen}
        onClose={handleDialogClose}
        title={editDataForNewForm ? 'Редактирование новости' : 'Добавить новость'}
        isSaveDisabled={!isFormValid}
        onSave={() => document.getElementById('add-form-news')?.requestSubmit()}
        isLoading={isFormLoading}
        isExit={showExitWarning}
        onExitConfirm={handleForceClose}
        onExitCancel={() => setShowExitWarning(false)}
        nameSpinner="Новость">
        <ArticlesForm
          ref={formRef}
          onValidityChange={setIsFormValid}
          onLoadingChange={setIsFormLoading}
          onDirtyChange={handleDirtyChange}
          editArticleData={editDataForNewForm}
          onSuccess={() => {
            setIsOpen(false);
            setEditDataForNewForm(null);
            setIsFormLoading(false);
          }}
        />
      </UiMarksDialog>
    </>
  );
}
