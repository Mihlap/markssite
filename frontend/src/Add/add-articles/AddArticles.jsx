import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../style/style-card.module.scss';
import FormAddArticles from './formAdd/FormAddArticles';
import FormEditArticles from './formAdd/FormEditArticles';
import { deleteFormArticle, getFetchFormArticle } from '../../store/Slice/articleSlice';
import cat from '../../img/default-photo.jpeg';

import { fetchToggleStateForButton2Async, updateToggleStateForButton2Async } from '../../store/Slice/toggleSlice';
import LoadingModal from '../add-project/loading/LoadingModal';
import Edit from '../icon/Edit.svg';

export default function AddArticles({ user }) {
  const Host = process.env.REACT_APP_SERVER_HOST;
  const dispatch = useDispatch();
  const article = useSelector((state) => state.article.article);
  const loading = useSelector((state) => state.article.loading);
  const error = useSelector((state) => state.article.error);

  const isActiveForButton2 = useSelector((state) => state.toggle.isActiveForButton2);
  const [modalBlockHeight, setModalBlockHeight] = useState('auto');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isImageLoaded, setImageLoaded] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [deleteModalState, setDeleteModalState] = useState({});
  const [editArticleData, setEditArticleData] = useState(null);

  const isMountedRef = useRef(true);

  const updateModalBlockHeight = useCallback(() => {
    const windowHeight = window.innerHeight;
    const maxHeight = Math.min(windowHeight - 100, 1900);
    setModalBlockHeight(`${maxHeight}px`);
  }, []);

  useEffect(() => {
    dispatch(getFetchFormArticle());
    dispatch(fetchToggleStateForButton2Async());
  }, [dispatch]);

  useEffect(() => {
    updateModalBlockHeight();
    window.addEventListener('resize', updateModalBlockHeight);
    return () => {
      window.removeEventListener('resize', updateModalBlockHeight);
      isMountedRef.current = false;
    };
  }, [updateModalBlockHeight]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    if (editArticleData) {
      setEditArticleData(null);
    }
  }, [editArticleData]);

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
      try {
        await navigator.clipboard.writeText(id);
        if (isMountedRef.current) {
          const articleToEdit = article.find((el) => el.id === id);
          setEditArticleData(articleToEdit);
          setIsModalOpen(true);
        }
      } catch (err) {
        console.error('Unable to copy project to clipboard:', err);
      }
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

  const toggleActive = useCallback(() => {
    dispatch(updateToggleStateForButton2Async(!isActiveForButton2));
  }, [dispatch, isActiveForButton2]);

  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__block_title_btn}>
          <div className={styles.card_components_admin__title}>Публикации</div>
          <div className={styles.card_components_admin__hide_block}>
            <div className={styles.card_components_admin__hide_text}>Скрыть фильтрацию</div>
            <div className={`${styles.toggleButton} ${isActiveForButton2 ? styles.active : ''}`} onClick={toggleActive}>
              <div className={styles.circle}></div>
            </div>
          </div>
        </div>
        <div className={styles.card_components_admin__button_block} onClick={handleOpenModal}>
          <button className={styles.card_components_admin__button}>
            <div>
              <svg
                className={styles.card_components_admin__icon}
                width="41"
                height="40"
                viewBox="0 0 41 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
              {editArticleData ? (
                <FormEditArticles
                  setIsModalOpen={setIsModalOpen}
                  editArticleData={editArticleData}
                  className={styles.formAddProjectClass}
                />
              ) : (
                <FormAddArticles className={styles.formAddProjectClass} setIsModalOpen={setIsModalOpen} />
              )}
              <button className={styles.card_components_admin__close_button} onClick={handleCloseModal}></button>
            </div>
          </div>
        )}
        <div className={styles.card_components_admin__section_map}>
          {error ? (
            <div className={styles.card_components_admin__errore_div}>
              Нажмите на кнопку Публикации, <span>это позволит серверу сделать запрос ещё раз.</span>
            </div>
          ) : loading ? (
            <LoadingModal />
          ) : (
            <>
              {article && article.length === 0 ? (
                <div className={styles.card_components_admin__null_project}>
                  Публикаций сейчас нет, добавьте свою первую публикацию!
                </div>
              ) : (
                <>
                  <div className={styles.card_components_admin__block_map}>
                    {Array.isArray(article) &&
                      [...article]?.map((el) => {
                        const firstPhoto = el && el.imageTitle ? el.imageTitle.split(', ')[0] : null;
                        const defaultPhoto = cat;

                        const photoSrc =
                          firstPhoto && firstPhoto !== 'null' && firstPhoto !== 'undefined'
                            ? `${Host}/images/imageArticle/${firstPhoto}`
                            : defaultPhoto;
                        return (
                          <React.Fragment key={el.id}>
                            <div key={el.id} className={styles.cart_project_container}>
                              <div className={styles.cart_project_container__imageContainer}>
                                <img
                                  className={styles.cart_project_container__img}
                                  loading="lazy"
                                  src={photoSrc}
                                  alt="photo_articles"
                                  onLoad={() => setImageLoaded(true)}
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
                                    <button className={styles.buttom_edit} onClick={() => handleEditClick(el.id)}>
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
                                  onClick={() => handleCopyClick(el.id)}
                                >
                                  <div className={styles.cart_project_container__copyButton_img_copu_ok} />
                                </button>
                              </div>
                            </div>

                            {deleteModalState[el.id] && (
                              <div className={styles.delete_modal_container}>
                                <div className={styles.delete_modal_block}>
                                  <div className={styles.delete_modal_block__title}>
                                    Вы точно хотите удалить проект <br /> «{el.title}»
                                  </div>
                                  <p className={styles.delete_modal_block__text}>
                                    Удаленный проект нельзя будет вернуть
                                  </p>

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
                                    onClick={() => handleDeleteModalClose(el.id)}
                                  ></button>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
