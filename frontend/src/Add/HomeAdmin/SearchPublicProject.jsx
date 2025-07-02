import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from './HomeAdmin.module.scss';
import DraggableProject from './DraggableProject';
import DropZone from './DropZone';
import {
  deleteProject,
  searchProgectMainPostzapros,
  updateProjectOrderSuccess,
  updateProjectOrderReplacement,
} from '../../store/Slice/searchProjectMainSlice';

export default function SearchPublicProject({
  projects,
  arrIdProject,
  setSearchId,
  setIsButtonDisabled,
  setSavedId,
  searchId,
  setOkMessage,
  setShowOk,
  setErrorMessage,
  setShowError,
  setReplacement,
  setReplacementMessage,
  savedId,
  isButtonDisabled,
  showError,
  errorMessage,
  showOk,
  okMessage,
  replacement,
  replacementMessage,
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const t = setTimeout(() => {
      setShowError(false);
      setShowOk(false);
      setReplacement(false);
    }, 5000);
    return () => clearTimeout(t);
  }, [showError, showOk, replacement, setShowError, setShowOk, setReplacement]);

  const handleFormDelete = (id) => dispatch(deleteProject(id));

  const filterProjectsById = async () => {
    const found = projects.find((p) => p.id === +searchId);
    if (found) {
      try {
        await dispatch(searchProgectMainPostzapros(found, setSearchId, setSavedId));
        setOkMessage('Проект добавлен');
        setShowOk(true);
      } catch {
        setErrorMessage('Ошибка при сохранении проекта');
        setShowError(true);
      }
    } else {
      setErrorMessage('Проект с таким id не найден');
      setShowError(true);
    }
  };

  const list = arrIdProject.filter((p) => p && p.IdProject);

  const reorder = (base, fromId, toId) => {
    const arr = [...base];
    const fromIdx = arr.findIndex((p) => p.IdProject === fromId);
    const toIdx = toId == null ? arr.length : arr.findIndex((p) => p.IdProject === toId);
    if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return arr;
    const [item] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, item);
    return arr;
  };

  const moveProject = (draggedId, targetId) => {
    const updated = reorder(list, draggedId, targetId);
    dispatch(updateProjectOrderSuccess(updated));
  };

  const handleDrop = (draggedId, targetId) => {
    const updated = reorder(list, draggedId, targetId);
    dispatch(updateProjectOrderSuccess(updated));
    dispatch(updateProjectOrderReplacement(updated));
    setReplacementMessage('Порядок сохранён');
    setReplacement(true);
  };

  return (
    <div className={styles.home_admin_section__section}>
      <div className={styles.home_admin_section__block_search}>
        <div className={styles.home_admin_section__id_container}>
          <DropZone onDrop={handleDrop} />
          {list.map((proj, idx) => (
            <React.Fragment key={proj.IdProject}>
              <DraggableProject
                project={proj}
                index={idx}
                moveProject={moveProject}
                handleDrop={handleDrop}
                handleFormDelete={handleFormDelete}
              />
              <DropZone onDrop={handleDrop} />
            </React.Fragment>
          ))}
        </div>
        <div className={`${styles.form__group} ${styles.field}`}>
          <input
            type="number"
            className={styles.form__field}
            placeholder="id проекта"
            value={savedId ?? searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              setIsButtonDisabled(e.target.value === '');
            }}
            onKeyDown={(e) => e.key === 'Enter' && filterProjectsById()}
          />
          <label className={styles.form__label}>Укажите id проекта</label>
        </div>
        <div className={styles.home_admin_section__button_container_project}>
          <button
            className={styles.home_admin_section__button}
            onClick={filterProjectsById}
            disabled={isButtonDisabled}
          />
        </div>
        {showError && <div className={styles.home_admin_section__error}>{errorMessage}</div>}
        {showOk && <div className={styles.home_admin_section__ok}>{okMessage}</div>}
        {replacement && <div className={styles.home_admin_section__ok}>{replacementMessage}</div>}
      </div>
    </div>
  );
}
