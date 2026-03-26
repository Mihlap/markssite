import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './styles.module.css';
import { deleteFormArticle, getFetchFormArticle } from '../../../store/Slice/articleSlice';
import { fetchToggleStateForButton2Async } from '../../../store/Slice/toggleSlice';
import def from '../../../img/default-photo.jpeg';
import { UiMarksButton, UiMarksDialog, UiMarksDeleteModal } from '../../ui';
import MarksEntityActions from '../../ui/EntityRow/MarksEntityActions';
import MarksCopyId from '../../ui/EntityRow/MarksCopyId';
import { useAdminUser } from '../../hooks/useAdminUser';
import ArticlesForm from './form/ArticlesForm';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function News({ user }) {
  const dispatch = useDispatch();
  const article = useSelector((state) => state.article.article);
  const loading = useSelector((state) => state.article.loading);
  const error = useSelector((state) => state.article.error);

  const [deleteModalState, setDeleteModalState] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editDataForNewForm, setEditDataForNewForm] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);

  const { canDelete, canEdit } = useAdminUser(user);

  useEffect(() => {
    dispatch(getFetchFormArticle());
    dispatch(fetchToggleStateForButton2Async());
  }, [dispatch]);

  const handleDeleteModalOpen = useCallback((id) => {
    setDeleteModalState((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleDeleteModalClose = useCallback((id) => {
    setDeleteModalState((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
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
    (id) => {
      dispatch(deleteFormArticle(id));
      handleDeleteModalClose(id);
    },
    [dispatch, handleDeleteModalClose]
  );

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
      <UiMarksButton defaultStyle="blue" size="large" icon onClick={() => setIsOpen(true)}>
        Добавить новость
      </UiMarksButton>
      {loading ? (
        <p className={styles.loading}>загрузка. . . </p>
      ) : error ? (
        <p className={styles.error}>Ошибка загрузки данных.</p>
      ) : article && article.length === 0 ? (
        <p className={styles.empty}>Новостей пока нет.</p>
      ) : (
        <div className={styles.grid}>
          {Array.isArray(article) &&
            [...article].map((el) => {
              const firstPhoto = el?.imageTitle ? el.imageTitle.split(', ')[0] : null;
              const photoSrc =
                firstPhoto && firstPhoto.includes('https')
                  ? firstPhoto
                  : `${bucket_url}/images/imageArticle/${firstPhoto || def}`;

              return (
                <React.Fragment key={el.id}>
                  <div className={styles.card}>
                    <div className={styles.imageWrap}>
                      <img className={styles.image} loading="lazy" src={photoSrc} alt="photo_articles" />
                      {canEdit && (
                        <div className={styles.actions}>
                          <MarksEntityActions
                            canDelete={canDelete}
                            onEdit={() => handleEditWithNewForm(el.id)}
                            onDelete={() => handleDeleteModalOpen(el.id)}
                          />
                        </div>
                      )}
                    </div>
                    <p className={styles.title}>{el.title}</p>
                    <MarksCopyId id={el.id} className={styles.copy} />
                  </div>
                  <UiMarksDeleteModal
                    isOpen={!!deleteModalState[el.id]}
                    title={
                      <>
                        Вы точно хотите удалить новость <br /> <strong>«{el.title}»</strong>?
                      </>
                    }
                    description="Удалённую новость нельзя будет вернуть"
                    onConfirm={() => handleFormDelete(el.id)}
                    onClose={() => handleDeleteModalClose(el.id)}
                  />
                </React.Fragment>
              );
            })}
        </div>
      )}
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
