import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteJournal, fetchJournals } from '../../../store/Slice/journalSlice';
import { fetchToggleStateForButton4Async } from '../../../store/Slice/toggleSlice';
import styles from '../../style/style-card.module.scss';
import { UiMarksButton, UiMarksDialog } from '../../ui';
import JournalForm from './form/JournalForm';

import Edit from '../../icon/Edit.svg';
import one from './icons/one.png';
import two from './icons/two.png';

export default function AddJournal({ user }) {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);
  const loading = useSelector((state) => state.journal.loading);
  const error = useSelector((state) => state.journal.error);

  const [isCopied, setIsCopied] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [deleteModalState, setDeleteModalState] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editJournalData, setEditJournalData] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);

  const imageMap = { one, two };

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

  const handleCopyClick = useCallback(async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      setIsCopied(true);
      setCopiedId(id);
    } catch (err) {
      console.error('Unable to copy to clipboard:', err);
    }
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

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
        setCopiedId('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

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
        <p>загрузка. . . </p>
      ) : error ? (
        <div className={styles.card_components_admin__errore_div}>Ошибка загрузки данных.</div>
      ) : journals && journals.length === 0 ? (
        <div className={styles.card_components_admin__null_project}>Публикаций пока нет.</div>
      ) : (
        <div className={styles.card_components_admin__block_map}>
          {journals?.map((el) => {
            const photoSrc = imageMap[el.imageKey] || one;

            return (
              <React.Fragment key={el.id}>
                <div className={`${styles.cart_project_container} ${styles.cart_journal_container}`}>
                  <div className={styles.cart_project_container__imageContainer}>
                    <img
                      className={styles.cart_journal_container__img}
                      loading="lazy"
                      src={photoSrc}
                      alt="photo_journal"
                    />
                    {user && ['obezyankaa', 'Pokemon'].includes(user?.name) && (
                      <div className={styles.del_block}>
                        <button className={styles.buttom_del} onClick={() => handleDeleteModalOpen(el.id)}>
                          <label htmlFor="delete" className={styles.label}>
                            <div className={styles.wrapper}>
                              <div className={styles.lid}>
                                <div className={styles.container_vedro}>
                                  <div className={styles.triangle_left}></div>
                                  <div className={styles.rectangle}></div>
                                  <div className={styles.triangle_right}></div>
                                </div>
                              </div>
                              <div className={styles.can}></div>
                              <span>delete</span>
                            </div>
                          </label>
                        </button>
                      </div>
                    )}
                    {user && ['obezyankaa', 'manager', 'Pokemon'].includes(user.name) && (
                      <div className={styles.edit_block}>
                        <button className={styles.buttom_edit} onClick={() => handleEditClick(el.id)}>
                          <label htmlFor="edit" className={styles.label}>
                            <div className={styles.wrapper}>
                              <img src={Edit} alt={Edit} />
                            </div>
                          </label>
                        </button>
                      </div>
                    )}
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
                        Вы точно хотите удалить публикацию
                        <br /> «{el.title}»
                      </div>
                      <p className={styles.delete_modal_block__text}>Удаленную публикацию нельзя будет вернуть</p>
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
