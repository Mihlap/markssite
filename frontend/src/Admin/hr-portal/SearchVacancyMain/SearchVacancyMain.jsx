import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import Item from '../../HomeAdmin/Item';
import {
  deleteVacancy,
  getZaprosData,
  searchVacancyMainPostzapros,
  updateVacancyOrderSuccess,
  updateVacancyOrderReplacement,
} from '../../../store/Slice/searchVacancyMainSlice';
import { UiMarksButton, UiMarksInput, UiMarksGrayWrap, UiMarksHeading } from '../../ui';
import { useNotification } from '../../HomeAdmin/utils/useNotification';
import Notification from '../../HomeAdmin/Notification';
import styles from '../../HomeAdmin/HomeAdmin.module.scss';


export default function SearchVacancyMain({ vacancies, arrIdVacancy }) {
  const dispatch = useDispatch();
  const { message, showMessage } = useNotification();
  const [searchId, setSearchId] = useState('');
  const [savedId, setSavedId] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const list = useMemo(() => (arrIdVacancy ?? []).filter((v) => v && v.IdVacancy), [arrIdVacancy]);

  const [flatList, setFlatList] = useState(list);
  const [activeId, setActiveId] = useState(null);
  const listIdsRef = useRef(new Set(list.map((v) => v.IdVacancy)));

  useEffect(() => {
    dispatch(getZaprosData());
  }, [dispatch]);

  useEffect(() => {
    const newIds = new Set(list.map((v) => v.IdVacancy));
    const cached = listIdsRef.current;
    listIdsRef.current = newIds;
    const changed = newIds.size !== cached.size || list.some((v) => !cached.has(v.IdVacancy));
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
        const oldIndex = prev.findIndex((v) => v.IdVacancy === active.id);
        const newIndex = prev.findIndex((v) => v.IdVacancy === over.id);
        const next = arrayMove(prev, oldIndex, newIndex);
        dispatch(updateVacancyOrderSuccess(next));
        dispatch(updateVacancyOrderReplacement(next));
        return next;
      });
      showMessage('Порядок сохранён', 'update');
    },
    [dispatch, showMessage]
  );

  const handleFormDelete = useCallback(
    (id) => {
      dispatch(deleteVacancy(id));
      showMessage('Вакансия удалена с главной страницы', 'delete');
    },
    [dispatch, showMessage]
  );

  const filterVacanciesById = useCallback(async () => {
    const found = vacancies?.find((v) => v.id === +searchId);

    if (!found) {
      showMessage('Вакансия с таким id не найдена', 'error');
      return;
    }

    if (list.some((v) => v.IdVacancy === +searchId)) {
      showMessage('Вакансия уже добавлена на главную', 'error');
      return;
    }

    if (list.length >= 6) {
      showMessage('Нельзя добавить больше 6 вакансий', 'error');
      return;
    }

    try {
      dispatch(searchVacancyMainPostzapros(found, setSearchId, setSavedId));
      showMessage('Вакансия добавлена', 'ok');
    } catch {
      showMessage('Ошибка при сохранении вакансии', 'error');
    }
  }, [dispatch, list, vacancies, searchId, showMessage]);

  return (
    <>
      <UiMarksHeading size="3xl" pb="lg" pt="60px">
        Актуальные вакансии
      </UiMarksHeading>
      <UiMarksGrayWrap customStyles={{ padding: '24px' }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
          <SortableContext items={flatList.map((v) => v.IdVacancy)} strategy={rectSortingStrategy}>
            <div className={styles.list}>
              {flatList.map((el) => (
                <SortableItem el={el} key={el.IdVacancy} handleFormDelete={handleFormDelete} />
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

        <div className={styles.wrapInput} onKeyDown={(e) => e.key === 'Enter' && filterVacanciesById()}>
          <UiMarksInput
            type="number"
            name="vacancy-id"
            label="Добавить id вакансии"
            placeholder="id вакансии"
            value={savedId ?? searchId}
            onChange={(e) => {
              setSearchId(e.target.value);
              setIsButtonDisabled(e.target.value === '');
            }}
          />
        </div>
        <UiMarksButton color="blue" disabled={isButtonDisabled || list.length >= 6} onClick={filterVacanciesById} className={styles.btn}>
          Добавить на главную
        </UiMarksButton>

        <Notification text={message.text} type={message.type} />
      </UiMarksGrayWrap>
    </>
  );
}
