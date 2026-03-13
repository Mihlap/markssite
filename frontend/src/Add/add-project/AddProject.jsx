import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from '../style/style-card.module.scss';
// import cat from "../img/default-photo.jpeg";
import cat from '../../img/default-photo.jpeg';
import { useDispatch, useSelector } from 'react-redux';
import { deleteForm, getFetchForm } from '../../store/Slice/projectSlice';
import { fetchToggleStateAsync, updateToggleStateAsync } from '../../store/Slice/toggleSlice';

// import Loading from "./loading/Loading";
import Edit from '../icon/Edit.svg';
import { UiMarksButton, UiMarksDialog, UiMarksSwitch } from '../ui';
import ProjectForm from './form/ProjectForm';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function AddProject({ user }) {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.projects);
  const isActiveForButton1 = useSelector((state) => state.toggle.isActiveForButton1);
  const error = useSelector((state) => state.project.error);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [deleteModalState, setDeleteModalState] = useState({});
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editDataForNewForm, setEditDataForNewForm] = useState(null);

  const isMountedRef = useRef(true);
  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);
  const [showExitWarning, setShowExitWarning] = useState(false);

  useEffect(() => {
    dispatch(getFetchForm());
    dispatch(fetchToggleStateAsync());
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
      console.error('Unable to copy project to clipboard:', err);
    }
  }, []);


  // Handle edit with the new ProjectForm
  const handleEditWithNewForm = useCallback(
    (id) => {
      const projectToEdit = project.find((el) => el.id === id);
      setEditDataForNewForm(projectToEdit);
      setIsOpen(true);
    },
    [project]
  );

  const handleFormDelete = useCallback(
    (formId) => {
      dispatch(deleteForm(formId));
      handleDeleteModalClose(formId);
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

  const toggleActive = useCallback(() => {
    dispatch(updateToggleStateAsync(!isActiveForButton1));
  }, [dispatch, isActiveForButton1]);

  const sortedProjects = useMemo(() => {
    return [...project];
  }, [project]);

  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__block_title_btn}>
          <div className={styles.card_components_admin__title}>Проекты</div>
          <div className={styles.card_components_admin__hide_block}>
            <div className={styles.card_components_admin__hide_text}>Скрыть фильтрацию</div>
            <UiMarksSwitch isActive={isActiveForButton1} onClick={toggleActive} />
          </div>
        </div>
        <UiMarksButton defaultStyle="blue" size="large" icon onClick={() => setIsOpen(true)}>
          Добавить новый проект
        </UiMarksButton>
        <div className={styles.card_components_admin__section_map}>
          {error ? (
            <div className={styles.card_components_admin__errore_div}>
              Нажмите на кнопку Проекты, <span>это позволит серверу сделать запрос ещё раз.</span>
            </div>
          ) : (
            <>
              {project && project.length === 0 ? (
                <div className={styles.card_components_admin__null_project}>
                  Проектов сейчас нет, добавьте свой первый проект!
                </div>
              ) : (
                <>
                  <div className={styles.card_components_admin__block_map}>
                    {sortedProjects?.map((el) => {
                      const defaultPhoto = cat;
                      const photoName = el?.imageProject;
                      const photoSrc =
                        photoName && photoName.includes('https')
                          ? photoName
                          : `${bucket_url}/images/imageAdd/${photoName || defaultPhoto}`;

                      return (
                        <React.Fragment key={el.id}>
                          <div key={el.id} className={styles.cart_project_container}>
                            <div className={styles.cart_project_container__imageContainer}>
                              <img
                                className={styles.cart_project_container__img}
                                loading="lazy"
                                src={photoSrc}
                                alt="photo_project"
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
                                <div className={styles.edit_block} onClick={() => handleEditWithNewForm(el.id)}>
                                  <button className={styles.buttom_edit}>
                                    <label htmlFor="edit" className={styles.label}>
                                      <div className={`${styles.wrapper}`}>
                                        <img src={Edit} alt={Edit} />
                                        {/* <span>Edit</span> */}
                                      </div>
                                    </label>
                                  </button>
                                </div>
                              ) : null}
                            </div>
                            <div className={styles.cart_project_container__content}>
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
                          {/* Модальное окно подтверждения удаления */}
                          {deleteModalState[el.id] && (
                            <div className={styles.delete_modal_container}>
                              <div className={styles.delete_modal_block}>
                                <div className={styles.delete_modal_block__title}>
                                  Вы точно хотите удалить проект <br /> «{el.title}»
                                </div>
                                <p className={styles.delete_modal_block__text}>Удаленный проект нельзя будет вернуть</p>

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
                                  className={styles.delete_modal_block__close_button}
                                  onClick={() => handleDeleteModalClose(el.id)}></button>
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
      <UiMarksDialog
        isOpen={isOpen}
        onClose={handleDialogClose}
        title={editDataForNewForm ? 'Редактирование проекта' : 'Новый проект'}
        isSaveDisabled={!isFormValid}
        onSave={() => document.getElementById('add-form')?.requestSubmit()}
        isLoading={isFormLoading}
        isExit={showExitWarning}
        onExitConfirm={handleForceClose}
        onExitCancel={() => setShowExitWarning(false)}
        nameSpinner="Проект">
        <ProjectForm
          ref={formRef}
          onValidityChange={setIsFormValid}
          onLoadingChange={setIsFormLoading}
          onDirtyChange={handleDirtyChange}
          editProjectData={editDataForNewForm}
          onSuccess={() => {
            setIsOpen(false);
            setEditDataForNewForm(null);
            setIsFormLoading(false);
          }}
        />
      </UiMarksDialog>
    </section>
  );
}
