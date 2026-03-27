import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import PositionForm from './Position/PositionForm.jsx';
import SlideMain from './SlideMain/SlideMain.jsx';
import EventMain from './EventMain/EventMain.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteForm,
  getFetchForm,
  getHiddenVacanciesFromDB,
  updateVacancyLookStatusAndSaveToDB,
  getVacanciesByDirection,
} from '../../store/Slice/vacanciesSlice.js';
import {
  UiMarksButton,
  UiMarksSegmentedControls,
  UiMarksDialog,
  UiMarksEntityRow,
  UiMarksHeading,
  UiMarksDeleteModal,
} from '../ui/index.js';
import { Icon1, Icon2, Icon3 } from './icon/index.js';
import LoadingCircle from '../../Loading/LoadingCircle.jsx';
import SearchVacancyMain from './SearchVacancyMain/SearchVacancyMain.jsx';
import { arrIdVacancySelector } from './const/VacancySelector.js';

import s from './styles.module.css'

const HR_PREVIEW_MAP = {
  'Вакансии': '/hr/vacancies',
  'Стажировки': '/hr/internships',
  'Главная hr': '/hr/home',
};

export default function HRPortal({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVacancyData, setEditVacancyData] = useState(null);
  const [deleteModalState, setDeleteModalState] = useState({});
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
  const { setHrPortalPreview } = useOutletContext() || {};

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

  useEffect(() => {
    dispatch(getFetchForm());
    dispatch(getHiddenVacanciesFromDB());
  }, [dispatch]);

  useEffect(() => {
    setHrPortalPreview?.(HR_PREVIEW_MAP['Вакансии']);
  }, [setHrPortalPreview]);

  const handleFilterChange = useCallback((value) => {
    setSelectedFilter(value);
    setHrPortalPreview?.(HR_PREVIEW_MAP[value]);
  }, [setHrPortalPreview]);

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

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((vacancy) => {
      if (selectedFilter === 'Вакансии') return vacancy.type === 'вакансия';
      if (selectedFilter === 'Стажировки') return vacancy.type === 'стажировка';
      if (selectedFilter === 'Главная hr') return vacancy.type === 'главная';
      return false;
    });
  }, [vacancies, selectedFilter]);

  return (
    <>
      <UiMarksHeading size="3xl" pb="21px">
        HR портал
      </UiMarksHeading>

        <UiMarksSegmentedControls
          name="hr-filter"
          segments={segments}
          callback={handleFilterChange}
        controlRef={controlRef}
        customStyles={{paddingBottom: '24px'}}
        />

      {selectedFilter === 'Главная hr' ? (
        <>
          <SlideMain user={user} />
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
          <EventMain user={user} />
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
        <PositionForm
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

      <>
        {error ? (
          <p className={s.empty}>
            Нажмите на HR Портал, <span>это позволит серверу сделать запрос ещё раз.</span>
          </p>
        ) : loading ? (
          <LoadingCircle />
        ) : (
          <>
            {filteredVacancies.length === 0 ? (
              <p className={s.empty}>
                {selectedFilter === 'Вакансии'
                  ? 'Вакансии сейчас отсутствуют. Добавьте вакансию!'
                  : selectedFilter === 'Стажировки'
                    ? 'Стажировки сейчас отсутствуют. Добавьте стажировку!'
                    : ''}
              </p>
            ) : (
              <div className={s.list}>
                {[...filteredVacancies].reverse().map((el) => (
                  <React.Fragment key={el.id}>
                    <UiMarksEntityRow
                      title={el.title}
                      desc={el.direction}
                      id={el.id}
                      role={['obezyankaa', 'Pokemon'].includes(user?.name) ? 'admin' : 'manager'}
                      hidden={el.hidden}
                      onToggle={() => handleLookClick(el.id)}
                      onEdit={() => handleEditClick(el.id)}
                      onDelete={() => handleDeleteModalOpen(el.id)}
                    />
                    <UiMarksDeleteModal
                      isOpen={!!deleteModalState[el.id]}
                      title={
                        <>
                          Вы точно хотите удалить
                          <br />
                          {selectedFilter === 'Стажировки' ? 'стажировку' : 'вакансию'} <strong>«{el.title}»</strong>?
                        </>
                      }
                      description={`Удаленную ${selectedFilter === 'Вакансии' ? 'вакансию' : 'стажировку'} вернуть будет невозможно`}
                      onConfirm={() => handleFormDelete(el.id)}
                      onClose={() => handleDeleteModalClose(el.id)}
                    />
                  </React.Fragment>
                ))}
              </div>
            )}
          </>
        )}
      </>
    </>
  );
}
