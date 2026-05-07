import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import Item from './Item';
import {
  deleteProject,
  searchProgectMainPostzapros,
  updateProjectOrderSuccess,
  updateProjectOrderReplacement,
} from '../../store/Slice/searchProjectMainSlice';
import { UiMarksButton, UiMarksInput, UiMarksGrayWrap } from '../ui';
import { useNotification } from './utils/useNotification';
import Notification from './Notification';
import styles from './HomeAdmin.module.scss';


// const MOCK_ITEMS = Array.from({ length: 14 }, (_, i) => ({ IdProject: i + 1 }));


export default function SearchPublicProject({
  projects,
  arrIdProject,
  setSearchId,
  setIsButtonDisabled,
  setSavedId,
  searchId,
  savedId,
  isButtonDisabled,
}) {
  const dispatch = useDispatch();
  const { message, showMessage } = useNotification();

  const list = useMemo(() => arrIdProject.filter((p) => p && p.IdProject), [arrIdProject]);

  // TODO: заменить MOCK_ITEMS на list и раскомментировать useEffect для реальных данных
  const [flatList, setFlatList] = useState(list);
  const [activeId, setActiveId] = useState(null);
  const listIdsRef = useRef(new Set(list.map((p) => p.IdProject)));
  useEffect(() => {
    const newIds = new Set(list.map((p) => p.IdProject));
    const cached = listIdsRef.current;
    listIdsRef.current = newIds;
    const changed = newIds.size !== cached.size || list.some((p) => !cached.has(p.IdProject));
    if (changed) setFlatList(list);
  }, [list]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over || active.id === over.id) return;

      setFlatList((prev) => {
        const oldIndex = prev.findIndex((p) => p.IdProject === active.id);
        const newIndex = prev.findIndex((p) => p.IdProject === over.id);
        const next = arrayMove(prev, oldIndex, newIndex);
        dispatch(updateProjectOrderSuccess(next));
        dispatch(updateProjectOrderReplacement(next));
        return next;
      });
      showMessage('Порядок сохранён', 'update');
    },
    [dispatch, showMessage]
  );

  const handleFormDelete = useCallback(
    (id) => {
      dispatch(deleteProject(id));
      showMessage('Проект удален с главной страницы', 'delete');
    },
    [dispatch, showMessage]
  );

  const filterProjectsById = useCallback(async () => {
    const found = projects.find((p) => p.id === +searchId);

    if (!found) {
      showMessage('Проект с таким id не найден', 'error');
      return;
    }

    if (list.some((p) => p.IdProject === +searchId)) {
      showMessage('Проект уже добавлен на главную', 'error');
      return;
    }

    try {
      dispatch(searchProgectMainPostzapros(found, setSearchId, setSavedId));
      showMessage('Проект добавлен', 'ok');
    } catch {
      showMessage('Ошибка при сохранении проекта', 'error');
    }
  }, [dispatch, list, projects, searchId, showMessage, setSearchId, setSavedId]);


  return (
    <UiMarksGrayWrap customStyles={{ padding: '24px' }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        <SortableContext items={flatList.map((p) => p.IdProject)} strategy={rectSortingStrategy}>
          <div className={styles.list}>
            {flatList.map((el) => (
              <SortableItem el={el} key={el.IdProject} handleFormDelete={handleFormDelete} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay adjustScale style={{ transformOrigin: '0 0' }}>
          {activeId ? (
            <Item
              id={activeId}
              isDragging
              onDelete={handleFormDelete}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className={styles.wrapInput} onKeyDown={(e) => e.key === 'Enter' && filterProjectsById()}>
        <UiMarksInput
          type="number"
          name="project-id"
          label="Добавить id проекта"
          placeholder="id проекта"
          value={savedId ?? searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            setIsButtonDisabled(e.target.value === '');
          }}
        />
      </div>
      <UiMarksButton color="blue" disabled={isButtonDisabled} onClick={filterProjectsById} className={styles.btn}>
        Добавить на главную
      </UiMarksButton>

      <Notification text={message.text} type={message.type} />
    </UiMarksGrayWrap>
  );
}
