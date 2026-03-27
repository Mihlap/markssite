import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteJournal, fetchJournals } from '../../../store/Slice/journalSlice';
import { fetchToggleStateForButton4Async } from '../../../store/Slice/toggleSlice';
import styles from './styles.module.css';
import { UiMarksButton, UiMarksDialog, UiMarksDeleteModal } from '../../ui';
import MarksEntityActions from '../../ui/EntityRow/MarksEntityActions';
import MarksCopyId from '../../ui/EntityRow/MarksCopyId';
import { useAdminUser } from '../../hooks/useAdminUser';
import JournalForm from './form/JournalForm';

import one from './icons/one.png';
import two from './icons/two.png';

export default function Journal({ user }) {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);
  const loading = useSelector((state) => state.journal.loading);
  const error = useSelector((state) => state.journal.error);

  const [deleteModalState, setDeleteModalState] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editJournalData, setEditJournalData] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);

  const imageMap = { one, two };
  const { canDelete, canEdit } = useAdminUser(user);

  useEffect(() => {
    if (!journals.length) {
      dispatch(fetchJournals());
    }
    dispatch(fetchToggleStateForButton4Async());
  }, [dispatch, journals.length]);

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

  const handleEditClick = useCallback(
    (id) => {
      const journalToEdit = journals.find((el) => el.id === id);
      setEditJournalData(journalToEdit || null);
      setIsOpen(true);
    },
    [journals]
  );

  const handleFormDelete = useCallback(
    (id) => {
      if (id) {
        dispatch(deleteJournal(id));
        handleDeleteModalClose(id);
      }
    },
    [dispatch, handleDeleteModalClose]
  );

  const handleDialogClose = useCallback(() => {
    if (isFormDirtyRef.current) {
      setShowExitWarning(true);
    } else {
      setIsOpen(false);
      setEditJournalData(null);
      setIsFormLoading(false);
      formRef.current?.resetForm();
    }
  }, []);

  const handleForceClose = useCallback(() => {
    isFormDirtyRef.current = false;
    setShowExitWarning(false);
    setIsOpen(false);
    setEditJournalData(null);
    setIsFormLoading(false);
    formRef.current?.resetForm();
  }, []);

  const handleDirtyChange = useCallback((dirty) => {
    isFormDirtyRef.current = dirty;
  }, []);

  return (
    <section>
      <UiMarksButton
        defaultStyle="blue"
        size="large"
        icon
        onClick={() => {
          setEditJournalData(null);
          setIsOpen(true);
        }}>
        Добавить новую публикацию
      </UiMarksButton>

      {loading ? (
        <p className={styles.loading}>загрузка. . . </p>
      ) : error ? (
        <p className={styles.error}>Ошибка загрузки данных.</p>
      ) : journals && journals.length === 0 ? (
        <p className={styles.empty}>Публикаций пока нет.</p>
      ) : (
        <div className={styles.grid}>
          {journals?.map((el) => {
            const photoSrc = imageMap[el.imageKey] || one;

            return (
              <React.Fragment key={el.id}>
                <div className={styles.card}>
                  <div className={styles.imageWrap}>
                    <img className={styles.image} loading="lazy" src={photoSrc} alt="photo_journal" />
                    {canEdit && (
                      <div className={styles.actions}>
                        <MarksEntityActions
                          canDelete={canDelete}
                          onEdit={() => handleEditClick(el.id)}
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
                      Вы точно хотите удалить публикацию <br /> <strong>«{el.title}»</strong>?
                    </>
                  }
                  description="Удалённую публикацию нельзя будет вернуть"
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
        title={editJournalData ? 'Редактирование статьи' : 'Новая статья'}
        isSaveDisabled={!isFormValid}
        onSave={() => document.getElementById('journal-form')?.requestSubmit()}
        isLoading={isFormLoading}
        isExit={showExitWarning}
        onExitConfirm={handleForceClose}
        onExitCancel={() => setShowExitWarning(false)}
        nameSpinner="Статья">
        <JournalForm
          ref={formRef}
          onValidityChange={setIsFormValid}
          onLoadingChange={setIsFormLoading}
          onDirtyChange={handleDirtyChange}
          editJournalData={editJournalData}
          onSuccess={() => {
            setIsOpen(false);
            setEditJournalData(null);
            setIsFormLoading(false);
          }}
        />
      </UiMarksDialog>
    </section>
  );
}
