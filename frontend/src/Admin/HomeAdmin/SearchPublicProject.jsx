import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import Item from './Item';
import {
  useProjects,
  useFeaturedProjects,
  useAddFeaturedProject,
  useDeleteFeaturedProject,
  useUpdateFeaturedOrder,
} from '../../hooks';
import { UiMarksButton, UiMarksInput, UiMarksGrayWrap } from '../ui';
import { useNotification } from './utils/useNotification';
import Notification from './Notification';
import styles from './HomeAdmin.module.scss';

export default function SearchPublicProject() {
  const { data: featuredData = [] } = useFeaturedProjects();
  const { data: projectsData } = useProjects({ limit: 200 });
  const projects = useMemo(() => projectsData?.pages.flatMap((p) => p.data) ?? [], [projectsData]);

  const { mutate: addFeatured } = useAddFeaturedProject();
  const { mutate: deleteFeatured } = useDeleteFeaturedProject();
  const { mutate: updateOrder } = useUpdateFeaturedOrder();
  const { message, showMessage } = useNotification();

  const [searchId, setSearchId] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const list = useMemo(() => featuredData.filter((p) => p && p.IdProject), [featuredData]);

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

  const handleDragStart = useCallback((event) => setActiveId(event.active.id), []);
  const handleDragCancel = useCallback(() => setActiveId(null), []);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveId(null);
      if (!over || active.id === over.id) return;

      setFlatList((prev) => {
        const oldIndex = prev.findIndex((p) => p.IdProject === active.id);
        const newIndex = prev.findIndex((p) => p.IdProject === over.id);
        const next = arrayMove(prev, oldIndex, newIndex);
        updateOrder(next);
        return next;
      });
      showMessage('Порядок сохранён', 'update');
    },
    [updateOrder, showMessage]
  );

  const handleFormDelete = useCallback(
    (id) => {
      deleteFeatured(id);
      showMessage('Проект удален с главной страницы', 'delete');
    },
    [deleteFeatured, showMessage]
  );

  const handleAdd = useCallback(async () => {
    const found = projects.find((p) => p.id === +searchId);

    if (!found) {
      showMessage('Проект с таким id не найден', 'error');
      return;
    }
    if (list.some((p) => p.IdProject === +searchId)) {
      showMessage('Проект уже добавлен на главную', 'error');
      return;
    }

    addFeatured(found);
    setSearchId('');
    setIsButtonDisabled(true);
    showMessage('Проект добавлен', 'ok');
  }, [addFeatured, list, projects, searchId, showMessage]);

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
          {activeId ? <Item id={activeId} isDragging onDelete={handleFormDelete} /> : null}
        </DragOverlay>
      </DndContext>

      <div className={styles.wrapInput} onKeyDown={(e) => e.key === 'Enter' && handleAdd()}>
        <UiMarksInput
          type="number"
          name="project-id"
          label="Добавить id проекта"
          placeholder="id проекта"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            setIsButtonDisabled(e.target.value === '');
          }}
        />
      </div>
      <UiMarksButton color="blue" disabled={isButtonDisabled} onClick={handleAdd} className={styles.btn}>
        Добавить на главную
      </UiMarksButton>

      <Notification text={message.text} type={message.type} />
    </UiMarksGrayWrap>
  );
}
