import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { fetchEvents, updateEventsOrder, updateEventsOrderLocally } from '../../../store/Slice/vacancyEventSlice';
import { UiMarksEntityRow, UiMarksDeleteModal } from '../../ui';
import s from './EventForm.module.css';

const getRole = (user) => {
  if (['obezyankaa', 'Pokemon'].includes(user?.name)) return 'admin';
  return 'manager';
};

export default function EventsList({
  user,
  deleteModalStateEvent,
  handleDeleteModalCloseEvent,
  handleDeleteModalOpenEvent,
  handleEditClick,
  handleFormDeleteEvent,
  handleLookClick,
}) {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.formAddEvent.events || []);
  const isLoading = useSelector((state) => state.formAddEvent.isLoading);
  const error = useSelector((state) => state.formAddEvent.error);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;
    const updated = [...events];
    const [removed] = updated.splice(from, 1);
    updated.splice(to, 0, removed);
    dispatch(updateEventsOrderLocally(updated));
    const eventsWithOrder = updated.map((event, idx) => ({ id: event.id, order: idx }));
    dispatch(updateEventsOrder(eventsWithOrder));
  };

  if (isLoading) return <p className={s.loading}>загрузка. . . </p>;
  if (error) return <p className={s.error}>Ошибка загрузки данных.</p>;
  if (!events.length) return <p className={s.empty}>Мероприятий пока нет.</p>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="events-list">
        {(provided) => (
          <div className={s.list} ref={provided.innerRef} {...provided.droppableProps}>
            {events.map((el, index) => (
              <Draggable key={el.id} draggableId={String(el.id)} index={index}>
                {(provided) => (
                  <div
                    className={s.draggableWrapper}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <UiMarksEntityRow
                      title={el.title}
                      id={el.id}
                      visible="event"
                      role={getRole(user)}
                      hidden={el.hidden}
                      onToggle={() => handleLookClick(el.id)}
                      onEdit={() => handleEditClick(el.id)}
                      onDelete={() => handleDeleteModalOpenEvent(el.id)}
                    />
                    <UiMarksDeleteModal
                      isOpen={!!deleteModalStateEvent[el.id]}
                      title={
                        <>
                          Вы точно хотите удалить
                          <br />
                          мероприятие <strong>«{el.title}»</strong>?
                        </>
                      }
                      description="Удаленное мероприятие вернуть будет невозможно"
                      onConfirm={() => handleFormDeleteEvent(el.id)}
                      onClose={() => handleDeleteModalCloseEvent(el.id)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
