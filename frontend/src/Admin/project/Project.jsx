import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import s from './styles.module.css';
import defaultPhoto from '../../img/default-photo.jpeg';
import { useDispatch, useSelector } from 'react-redux';
import { deleteForm, getFetchForm } from '../../store/Slice/projectSlice';
import { fetchToggleStateAsync, updateToggleStateAsync } from '../../store/Slice/toggleSlice';
import { UiMarksButton, UiMarksDialog, UiMarksSwitch, UiMarksHeading, UiMarksDeleteModal } from '../ui';
import MarksEntityActions from '../ui/EntityRow/MarksEntityActions';
import MarksCopyId from '../ui/EntityRow/MarksCopyId';
import { useAdminUser } from '../hooks/useAdminUser';
import ProjectForm from './form/ProjectForm';

const bucket_url = process.env.REACT_APP_S3_BUCKET_URL;

export default function Project({ user }) {
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.projects);
  const isActiveForButton1 = useSelector((state) => state.toggle.isActiveForButton1);
  const error = useSelector((state) => state.project.error);

  const { canDelete, canEdit } = useAdminUser(user);

  const [deleteModalState, setDeleteModalState] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [editDataForNewForm, setEditDataForNewForm] = useState(null);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);

  useEffect(() => {
    dispatch(getFetchForm());
    dispatch(fetchToggleStateAsync());
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
      const projectToEdit = project.find((el) => el.id === id);
      setEditDataForNewForm(projectToEdit);
      setIsOpen(true);
    },
    [project]
  );

  const handleFormDelete = useCallback(
    (id) => {
      dispatch(deleteForm(id));
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

  const toggleActive = useCallback(() => {
    dispatch(updateToggleStateAsync(!isActiveForButton1));
  }, [dispatch, isActiveForButton1]);

  const sortedProjects = useMemo(() => [...project], [project]);

  return (
    <>
      <div className={s.wrapHeading}>
        <UiMarksHeading size="3xl">Проекты</UiMarksHeading>
        <div className={s.wrapHide}>
          <p className={s.name}>Скрыть фильтрацию</p>
          <UiMarksSwitch isActive={isActiveForButton1} onClick={toggleActive} />
        </div>
      </div>
      <UiMarksButton defaultStyle="blue" size="large" icon onClick={() => setIsOpen(true)}>
        Добавить новый проект
      </UiMarksButton>
      <>
        {error ? (
          <p className={s.error}>
            Нажмите на кнопку Проекты, <span>это позволит серверу сделать запрос ещё раз.</span>
          </p>
        ) : project.length === 0 ? (
          <p className={s.empty}>Проектов сейчас нет, добавьте свой первый проект!</p>
        ) : (
          <div className={s.grid}>
            {sortedProjects.map((el) => {
              const photoName = el?.imageProject;
              const photoSrc =
                photoName && photoName.includes('https')
                  ? photoName
                  : `${bucket_url}/images/imageAdd/${photoName || defaultPhoto}`;

              return (
                <React.Fragment key={el.id}>
                  <div className={s.card}>
                    <div className={s.imageWrap}>
                      <img className={s.image} loading="lazy" src={photoSrc} alt="photo_project" />
                      {canEdit && (
                        <div className={s.actions}>
                          <MarksEntityActions
                            canDelete={canDelete}
                            onEdit={() => handleEditWithNewForm(el.id)}
                            onDelete={() => handleDeleteModalOpen(el.id)}
                          />
                        </div>
                      )}
                    </div>
                    <p className={s.title}>{el.title}</p>
                    <MarksCopyId id={el.id} className={s.copy} />
                  </div>
                  <UiMarksDeleteModal
                    isOpen={!!deleteModalState[el.id]}
                    title={
                      <>
                        Вы точно хотите удалить проект <br /> <strong>«{el.title}»</strong>?
                      </>
                    }
                    description="Удалённый проект нельзя будет вернуть"
                    onConfirm={() => handleFormDelete(el.id)}
                    onClose={() => handleDeleteModalClose(el.id)}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}
      </>
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
    </>
  );
}
