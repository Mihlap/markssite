import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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

const MAX_PER_ROW = 7;
const MAX_ROWS = 3;

const flatToRows = (flat) => {
  const rows = [];
  for (let i = 0; i < flat.length && rows.length < MAX_ROWS; i += MAX_PER_ROW) {
    rows.push(flat.slice(i, i + MAX_PER_ROW));
  }
  return rows;
};

const cascadeRows = (rows) => {
  const result = rows.map((row) => [...row]);
  for (let i = 0; i < result.length - 1; i++) {
    while (result[i].length > MAX_PER_ROW) {
      result[i + 1].unshift(result[i].pop());
    }
  }
  return result.filter((row) => row.length > 0);
};

export default function SearchVacancyMain({ vacancies, arrIdVacancy }) {
  const dispatch = useDispatch();
  const { message, showMessage } = useNotification();
  const [searchId, setSearchId] = useState('');
  const [savedId, setSavedId] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const list = useMemo(() => (arrIdVacancy ?? []).filter((v) => v && v.IdVacancy), [arrIdVacancy]);

  const [rows, setRows] = useState(() => flatToRows(list));
  const listIdsRef = useRef(new Set(list.map((v) => v.IdVacancy)));
  const [draggingFromRow, setDraggingFromRow] = useState(null);

  useEffect(() => {
    dispatch(getZaprosData());
  }, [dispatch]);

  useEffect(() => {
    const newIds = new Set(list.map((v) => v.IdVacancy));
    const cached = listIdsRef.current;
    const changed = newIds.size !== cached.size || list.some((v) => !cached.has(v.IdVacancy));
    listIdsRef.current = newIds;
    if (changed) setRows(flatToRows(list));
  }, [list]);

  const handleDragStart = useCallback((start) => {
    setDraggingFromRow(parseInt(start.source.droppableId.split('-')[1]));
  }, []);

  const handleDragEnd = useCallback(
    (result) => {
      setDraggingFromRow(null);
      const { source, destination } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      const srcIdx = parseInt(source.droppableId.split('-')[1]);
      const dstIdx = parseInt(destination.droppableId.split('-')[1]);

      const next = rows.map((row) => [...row]);
      const [moved] = next[srcIdx].splice(source.index, 1);
      next[dstIdx].splice(destination.index, 0, moved);

      const cascaded = cascadeRows(next);
      const updated = cascaded.flat();
      setRows(cascaded);
      dispatch(updateVacancyOrderSuccess(updated));
      dispatch(updateVacancyOrderReplacement(updated));
      showMessage('Порядок сохранён', 'update');
    },
    [rows, dispatch, showMessage]
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
        <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className={styles.list}>
            {rows.map((row, rowIdx) => (
              <Droppable
                key={rowIdx}
                droppableId={`row-${rowIdx}`}
                direction="horizontal"
                isDropDisabled={row.length >= MAX_PER_ROW && rowIdx !== draggingFromRow}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className={styles.row}>
                    {row.map((vacancy, idx) => (
                      <Draggable key={vacancy.IdVacancy} draggableId={String(vacancy.IdVacancy)} index={idx}>
                        {(provided) => (
                          <Item
                            project={vacancy}
                            id={vacancy.IdVacancy}
                            handleFormDelete={handleFormDelete}
                            ref={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

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
        <UiMarksButton color="blue" disabled={isButtonDisabled} onClick={filterVacanciesById} className={styles.btn}>
          Добавить на главную
        </UiMarksButton>

        <Notification text={message.text} type={message.type} />
      </UiMarksGrayWrap>
    </>
  );
}
