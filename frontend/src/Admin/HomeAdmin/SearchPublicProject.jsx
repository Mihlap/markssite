import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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

  const [rows, setRows] = useState(() => flatToRows(list));
  const listIdsRef = useRef(new Set(list.map((p) => p.IdProject)));
  const [draggingFromRow, setDraggingFromRow] = useState(null);

  useEffect(() => {
    const newIds = new Set(list.map((p) => p.IdProject));
    const cached = listIdsRef.current;
    const changed = newIds.size !== cached.size || list.some((p) => !cached.has(p.IdProject));
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
      dispatch(updateProjectOrderSuccess(updated));
      dispatch(updateProjectOrderReplacement(updated));
      showMessage('Порядок сохранён', 'update');
    },
    [rows, dispatch, showMessage]
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
                  {row.map((proj, idx) => (
                    <Draggable key={proj.IdProject} draggableId={String(proj.IdProject)} index={idx}>
                      {(provided) => (
                        <Item
                          project={proj}
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
