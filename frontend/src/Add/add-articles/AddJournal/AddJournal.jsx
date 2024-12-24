import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearFormData, deleteJournal, fetchJournals } from '../../../store/Slice/journalSlice';
import { fetchToggleStateForButton4Async, updateToggleStateForButton4Async } from '../../../store/Slice/toggleSlice';
import LoadingModal from '../../add-project/loading/LoadingModal';
import FormAddJournal from './FormAddEditJournal/FormAddJournal';
import FormEditJournal from './FormAddEditJournal/FormEditJournal';
import styles from '../../style/style-card.module.scss';

import Edit from '../../icon/Edit.svg';
import one from '../../add-navbar/icon/one.png';
import two from '../../add-navbar/icon/two.png';
import three from '../../add-navbar/icon/three.png';

export default function AddJournal({ user }) {
  const dispatch = useDispatch();
  const journals = useSelector((state) => state.journal.journals);
  const loading = useSelector((state) => state.journal.loading);
  const error = useSelector((state) => state.journal.error);
  const isActiveForButton4 = useSelector((state) => state.toggle.isActiveForButton4);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [editJournalData, setEditJournalData] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({});
  const [modalBlockHeight, setModalBlockHeight] = useState('auto');

  const isMountedRef = useRef(true);
   const imageArray = useMemo(() => [one, two, three], []);

  const updateModalBlockHeight = useCallback(() => {
    const windowHeight = window.innerHeight;
    const maxHeight = Math.min(windowHeight - 100, 1900);
    setModalBlockHeight(`${maxHeight}px`);
  }, []);
  

  useEffect(() => {
    if (!journals.length) {
      dispatch(fetchJournals());
    }
    dispatch(fetchToggleStateForButton4Async());
  }, [dispatch, journals.length]);


  useEffect(() => {
    updateModalBlockHeight();
    window.addEventListener('resize', updateModalBlockHeight);
    return () => {
      window.removeEventListener('resize', updateModalBlockHeight);
      isMountedRef.current = false;
    };
  }, [updateModalBlockHeight]);
  

 const handleOpenModal = useCallback(() => {
   setEditJournalData(null);
   dispatch(clearFormData());
   setIsModalOpen(true); 
 }, [dispatch]);
  

 const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
 }, []);
  

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


const handleEditClick = useCallback(
  async (id) => {   
    const journalToEdit = journals.find((el) => el.id === id);
    if (journalToEdit) {
      setEditJournalData(journalToEdit.id);
      setIsModalOpen(true);
    } else {
      console.warn('Запись не найдена для редактирования:', id);
    }
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


  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
        setCopiedId('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const toggleActive = useCallback(() => {
    dispatch(updateToggleStateForButton4Async(!isActiveForButton4));
  }, [dispatch, isActiveForButton4]);


  return (
    <>
      <div className={`${styles.card_components_admin__hide_block} ${styles.card_components_admin__hide_block_top}`}>
        <div className={styles.card_components_admin__hide_text}>Скрыть фильтрацию</div>
        <div className={`${styles.toggleButton} ${isActiveForButton4 ? styles.active : ''}`} onClick={toggleActive}>
          <div className={styles.circle}></div>
        </div>
      </div>
      <div>
        <div className={styles.card_components_admin__button_block} onClick={handleOpenModal}>
          <button className={styles.card_components_admin__button}>
            <div>
              <svg
                className={styles.card_components_admin__icon}
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g id="icon">
                  <circle id="Ellipse 4" cx="20.5" cy="20" r="20" fill="#F6F6F6" />
                  <path
                    id="Vector 10"
                    d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                    stroke="#75BBFD"
                    strokeWidth="2"
                    strokeLinecap="square"
                  />
                </g>
              </svg>
            </div>
            <div className={styles.card_components_admin__button_text}>Добавить новую публикацию</div>
          </button>
        </div>
        {isModalOpen && (
          <div className={styles.card_components_admin__modal_container}>
            <div style={{ maxHeight: modalBlockHeight }} className={styles.card_components_admin__modal_block}>
              {editJournalData ? (
                <FormEditJournal setIsModalOpen={setIsModalOpen} editJournalData={editJournalData} />
              ) : (
                <FormAddJournal setIsModalOpen={setIsModalOpen} />
              )}
              <button className={styles.card_components_admin__close_button} onClick={handleCloseModal}></button>
            </div>
          </div>
        )}
        {loading ? (
          <LoadingModal />
        ) : error ? (
          <div className={styles.card_components_admin__errore_div}>Ошибка загрузки данных.</div>
        ) : journals && journals.length === 0 ? (
          <div className={styles.card_components_admin__null_project}>Публикаций пока нет.</div>
        ) : (
          <div className={styles.card_components_admin__block_map}>
            {journals?.map((el, index) => {
              const photoSrc = imageArray[index % imageArray.length];

              return (
                <React.Fragment key={el.id}>
                  <div key={el.id} className={styles.cart_project_container}>
                    <div className={styles.cart_project_container__imageContainer}>
                      <img
                        className={styles.cart_project_container__img}
                        loading="lazy"
                        src={photoSrc}
                        alt="photo_journal"
                      />
                      {user && ['obezyankaa', 'Pokemon'].includes(user?.name) && (
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
                      )}
                      {user && ['obezyankaa', 'manager', 'Pokemon'].includes(user.name) && (
                        <div className={styles.edit_block}>
                          <button className={styles.buttom_edit} onClick={() => handleEditClick(el.id)}>
                            <label htmlFor="edit" className={styles.label}>
                              <div className={`${styles.wrapper}`}>
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
      </div>
    </>
  );
}
