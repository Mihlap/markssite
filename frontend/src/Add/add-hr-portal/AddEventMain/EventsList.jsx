import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleDragStart = (e, index) => {
    setDraggedItem(events[index]);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (!draggedItem) return;
    const draggedIndex = events.findIndex((event) => event.id === draggedItem.id);
    if (draggedIndex === index) return;
    const updatedEvents = [...events];
    const [removed] = updatedEvents.splice(draggedIndex, 1);
    updatedEvents.splice(index, 0, removed);
    dispatch(updateEventsOrderLocally(updatedEvents));
    const eventsWithOrder = updatedEvents.map((event, idx) => ({ id: event.id, order: idx }));
    dispatch(updateEventsOrder(eventsWithOrder));
    setDraggedItem(null);
  };

  return (
    <div className={s.list}>
      {events.map((el, index) => (
        <div
          key={`${el.id}-${index}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, index)}>
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
      ))}
    </div>
  );
}
