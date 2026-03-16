import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import styles from '../style/style-card.module.scss';
import VacancyForm from './form/VacancyForm.jsx';
import AddSlideMain from './AddSlideMain/AddSlideMain.jsx';
import AddEventMain from './AddEventMain/AddEventMain.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteForm,
  getFetchForm,
  getHiddenVacanciesFromDB,
  sendCopiedVacancyToServer,
  updateVacancyLookStatusAndSaveToDB,
  getVacanciesByDirection,
} from '../../store/Slice/vacanciesSlice';
import { UiMarksButton, UiMarksSegmentedControls, UiMarksDialog } from '../ui';
import { Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7 } from './icon';
import LoadingCircle from '../../Loading/LoadingCircle.jsx';
import SearchVacancyMain from './SearchVacancyMain/SearchVacancyMain.jsx';
import { arrIdVacancySelector } from './VacancySelector.js';

export default function AddHRPortal({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenMain, setIsModalOpenMain] = useState(false);
  const [isModalOpenEvent, setIsModalOpenEvent] = useState(false);
  const [editVacancyData, setEditVacancyData] = useState(null);
  const [editSlideData, setEditSlideData] = useState(null);
  const [editEventData, setEditEventData] = useState(null);
  const [modalBlockHeight, setModalBlockHeight] = useState('auto');
  const [deleteModalState, setDeleteModalState] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [copiedVacancyId, setCopiedVacancyId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [okMessage, setOkMessage] = useState('');
  const [showOk, setShowOk] = useState(false);
  const [replacementMessage, setReplacementMessage] = useState('');
  const [replacement, setReplacement] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [searchId, setSearchId] = useState('');
  const [savedId, setSavedId] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Вакансии');

  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.vacancies);
  const vacancies = useSelector((state) => state.vacancies.vacancies);
  const arrIdVacancy = useSelector(arrIdVacancySelector);

  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);
  const controlRef = useRef();
  const jobRef = useRef();
  const internshipRef = useRef();
  const hrRef = useRef();

  const segments = [
    { value: 'Вакансии', label: 'Вакансии', ref: jobRef, icon: <Icon1 /> },
    { value: 'Стажировки', label: 'Стажировки', ref: internshipRef, icon: <Icon2 /> },
    { value: 'Главная hr', label: 'Главная hr', ref: hrRef, icon: <Icon3 /> },
  ];

  const updateModalBlockHeight = useCallback(() => {
    const windowHeight = window.innerHeight;
    const maxHeight = Math.min(windowHeight - 100, 1900);
    setModalBlockHeight(`${maxHeight}px`);
  }, []);

  useEffect(() => {
    dispatch(getFetchForm());
    dispatch(getHiddenVacanciesFromDB());
  }, [dispatch]);

  useEffect(() => {
    updateModalBlockHeight();
    window.addEventListener('resize', updateModalBlockHeight);
    return () => window.removeEventListener('resize', updateModalBlockHeight);
  }, [updateModalBlockHeight]);

  const handleFilterChange = useCallback((value) => {
    setSelectedFilter(value);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    setEditVacancyData(null);
  }, []);

  const handleDialogClose = useCallback(() => {
    if (isFormDirtyRef.current) {
      setShowExitWarning(true);
    } else {
      setIsModalOpen(false);
      setEditVacancyData(null);
      setIsFormLoading(false);
    }
  }, []);

  const handleForceClose = useCallback(() => {
    isFormDirtyRef.current = false;
    setShowExitWarning(false);
    setIsModalOpen(false);
    setEditVacancyData(null);
    setIsFormLoading(false);
    formRef.current?.resetForm();
  }, []);

  const handleDirtyChange = useCallback((dirty) => {
    isFormDirtyRef.current = dirty;
  }, []);

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

  const tryCopyToClipboard = (text) => {
    if (!navigator?.clipboard?.writeText) return;
    navigator.clipboard.writeText(String(text)).catch(() => {});
  };

  const handleCopyClick = useCallback((id) => {
    tryCopyToClipboard(id);
    setIsCopied(true);
    setCopiedId(id);
  }, []);

  const handleCopyVacancyClick = useCallback(
    (id) => {
      tryCopyToClipboard(id);
      const vacancyToCopy = vacancies.find((el) => el.id === id);
      if (!vacancyToCopy) return;
      dispatch(sendCopiedVacancyToServer({ ...vacancyToCopy, id }))
        .then((response) => {
          const copiedId = response?.data?.copiedId;
          if (copiedId) {
            setCopiedVacancyId(copiedId);
            setTimeout(() => setCopiedVacancyId(null), 5000);
          }
          dispatch(getFetchForm());
        })
        .catch(() => {});
    },
    [dispatch, vacancies]
  );

  const handleEditClick = useCallback(
    (id) => {
      tryCopyToClipboard(id);
      const vacancyToEdit = vacancies.find((el) => el.id === id);
      if (!vacancyToEdit) return;
      setEditVacancyData(vacancyToEdit);
      setIsModalOpen(true);
    },
    [vacancies]
  );

  const handleFormDelete = useCallback(
    (formId) => {
      dispatch(deleteForm(formId));
      dispatch(getVacanciesByDirection());
      handleDeleteModalClose(formId);
    },
    [dispatch, handleDeleteModalClose]
  );

  const handleLookClick = useCallback(
    (id) => {
      const vacancy = vacancies.find((v) => v.id === id);
      if (!vacancy) return;
      dispatch(updateVacancyLookStatusAndSaveToDB({ id, hidden: !vacancy.hidden }));
    },
    [dispatch, vacancies]
  );

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => {
      setIsCopied(false);
      setCopiedId('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((vacancy) => {
      if (selectedFilter === 'Вакансии') return vacancy.type === 'вакансия';
      if (selectedFilter === 'Стажировки') return vacancy.type === 'стажировка';
      if (selectedFilter === 'Главная hr') return vacancy.type === 'главная';
      return false;
    });
  }, [vacancies, selectedFilter]);

  return (
    <section className={styles.card_components_admin}>
      <div className={styles.card_components_admin__block}>
        <div className={styles.card_components_admin__title}>HR портал</div>
        <div style={{paddingTop: '21px', paddingBottom: '24px'}}>
        <UiMarksSegmentedControls
          name="hr-filter"
          segments={segments}
          callback={handleFilterChange}
          controlRef={controlRef}
        />
        </div>

        {selectedFilter === 'Главная hr' ? (
          <>
            <AddSlideMain
              isModalOpenMain={isModalOpenMain}
              setIsModalOpenMain={setIsModalOpenMain}
              editSlideData={editSlideData}
              setEditSlideData={setEditSlideData}
              modalBlockHeight={modalBlockHeight}
              user={user}
            />
            <SearchVacancyMain
              vacancies={vacancies}
              arrIdVacancy={arrIdVacancy}
              setSearchId={setSearchId}
              setIsButtonDisabled={setIsButtonDisabled}
              setSavedId={setSavedId}
              searchId={searchId}
              setOkMessage={setOkMessage}
              setShowOk={setShowOk}
              setErrorMessage={setErrorMessage}
              setShowError={setShowError}
              setReplacement={setReplacement}
              setReplacementMessage={setReplacementMessage}
              savedId={savedId}
              isButtonDisabled={isButtonDisabled}
              showError={showError}
              errorMessage={errorMessage}
              showOk={showOk}
              okMessage={okMessage}
              replacement={replacement}
              replacementMessage={replacementMessage}
            />
            <AddEventMain
              isModalOpenEvent={isModalOpenEvent}
              setIsModalOpenEvent={setIsModalOpenEvent}
              editEventData={editEventData}
              setEditEventData={setEditEventData}
              modalBlockHeight={modalBlockHeight}
              user={user}
            />
          </>
        ) : (
          <UiMarksButton defaultStyle="blue" size="large" icon onClick={handleOpenModal}>
            {selectedFilter === 'Вакансии' ? 'Добавить вакансию' : 'Добавить стажировку'}
          </UiMarksButton>
        )}

        <UiMarksDialog
          isOpen={isModalOpen}
          onClose={handleDialogClose}
          title={
            editVacancyData
              ? selectedFilter === 'Вакансии'
                ? 'Редактирование вакансии'
                : 'Редактирование стажировки'
              : selectedFilter === 'Вакансии'
                ? 'Новая вакансия'
                : 'Новая стажировка'
          }
          isSaveDisabled={!isFormValid}
          onSave={() => document.getElementById('vacancy-form')?.requestSubmit()}
          isLoading={isFormLoading}
          isExit={showExitWarning}
          onExitConfirm={handleForceClose}
          onExitCancel={() => setShowExitWarning(false)}
          nameSpinner={selectedFilter === 'Вакансии' ? 'Вакансия' : 'Стажировка'}>
          <VacancyForm
            ref={formRef}
            onValidityChange={setIsFormValid}
            onLoadingChange={setIsFormLoading}
            onDirtyChange={handleDirtyChange}
            editVacancyData={editVacancyData}
            selectedFilter={selectedFilter}
            selectedlabel={selectedFilter === 'Вакансии' ? 'Название вакансии' : 'Название стажировки'}
            onSuccess={() => {
              setIsModalOpen(false);
              setEditVacancyData(null);
              setIsFormLoading(false);
            }}
          />
        </UiMarksDialog>

        <div className={styles.card_components_admin__section_map}>
          {error ? (
            <div className={styles.card_components_admin__errore_div}>
              Нажмите на HR Портал, <span>это позволит серверу сделать запрос ещё раз.</span>
            </div>
          ) : loading ? (
            <LoadingCircle />
          ) : (
            <>
              {filteredVacancies.length === 0 ? (
                <div className={styles.card_components_admin__null_project}>
                  {selectedFilter === 'Вакансии'
                    ? 'Вакансии сейчас отсутствуют. Добавьте вакансию!'
                    : selectedFilter === 'Стажировки'
                      ? 'Стажировки сейчас отсутствуют. Добавьте стажировку!'
                      : ''}
                </div>
              ) : (
                <div className={styles.card_components_admin__block__vacancy}>
                  {[...filteredVacancies].reverse().map((el) => (
                    <React.Fragment key={el.id}>
                      <div
                        className={`${styles.cart_vacancy_container} ${
                          copiedVacancyId === el.id ? styles.copiedVacancy : ''
                        }`}>
                        <div className={styles.cart_vacancy_container__content}>
                          <span className={styles.cart_vacancy_container__title}>{el.title}</span>
                        </div>
                        <div className={styles.cart_vacancy_container__department}>{el.direction}</div>
                        <div className={styles.cart_vacancy_container__id_block}>
                          <div className={styles.cart_vacancy_container__id_text}>id: {el.id}</div>
                          {isCopied && el.id === copiedId && (
                            <>
                              <div className={styles.cart_vacancy_container__copyMessage}>id скопирован</div>
                              <div className={styles.cart_vacancy_container__copyButton_img_copy_deffalt} />
                            </>
                          )}
                          <button
                            className={styles.cart_vacancy_container__copyButton}
                            onClick={() => handleCopyClick(el.id)}>
                            <div className={styles.cart_vacancy_container__copyButton_img_copy_ok} />
                          </button>
                        </div>
                        <div className={styles.cart_vacancy_container_buttonClick}>
                          {user?.name === 'obezyankaa' || user?.name === 'Pokemon' || user?.name === 'hr778' ? (
                            <div
                              className={styles.copyIcon_block_vacancy}
                              onClick={() => handleCopyVacancyClick(el.id)}>
                              <button className={styles.buttom_copyIcon}>
                                <label htmlFor="copyIcon" className={styles.label}>
                                  <div className={styles.wrapper}>
                                    <Icon7/>
                                  </div>
                                </label>
                              </button>
                            </div>
                          ) : null}
                          {user?.name === 'obezyankaa' || user?.name === 'Pokemon' ? (
                            <div className={styles.del_block_vacancy}>
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
                          ) : null}
                          {user?.name === 'obezyankaa' || user?.name === 'Pokemon' || user?.name === 'hr778' ? (
                            <div
                              className={`${styles.look_block_vacancy} ${el.hidden ? styles.disabled : ''}`}
                              onClick={() => handleLookClick(el.id)}>
                              <button className={styles.buttom_look}>
                                <label htmlFor="look" className={styles.label}>
                                  <div className={styles.wrapper}>
                                    {el.hidden ? <Icon6/> : <Icon5/>}
                                  </div>
                                </label>
                              </button>
                            </div>
                          ) : null}
                          {user?.name === 'obezyankaa' || user?.name === 'Pokemon' || user?.name === 'hr778' ? (
                            <div className={styles.edit_block_vacancy} onClick={() => handleEditClick(el.id)}>
                              <button className={styles.buttom_edit}>
                                <label htmlFor="edit" className={styles.label}>
                                  <div className={styles.wrapper}>
                                    <Icon4 />
                                  </div>
                                </label>
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      {deleteModalState[el.id] && (
                        <div className={styles.delete_modal_container}>
                          <div className={styles.delete_modal_block}>
                            <div className={styles.delete_modal_block__title}>
                              <>Вы точно хотите удалить</>
                              <br />
                              {selectedFilter === 'Стажировки' ? 'стажировку' : 'вакансию'} «{el.title}»?
                            </div>
                            <p className={styles.delete_modal_block__text}>
                              Удаленную {selectedFilter === 'Вакансии' ? 'вакансию' : 'стажировку'} вернуть будет
                              невозможно
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
                              className={styles.delete_modal_block__close_button}
                              onClick={() => handleDeleteModalClose(el.id)}
                            />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
