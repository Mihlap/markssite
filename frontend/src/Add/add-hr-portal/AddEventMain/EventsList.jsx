import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventItem from './EventItem';
import styles from '../../style/style-card.module.scss';
import { fetchEvents, updateEventsOrder, updateEventsOrderLocally } from '../../../store/Slice/vacancyEventSlice';

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
    <div className={styles.card_components_admin__block__vacancy}>
      {events.map((el, index) => (
        <EventItem
          key={`${el.id}-${index}`}
          el={el}
          index={index}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleLookClick={handleLookClick}
          handleEditClick={handleEditClick}
          handleDeleteModalOpenEvent={handleDeleteModalOpenEvent}
          deleteModalStateEvent={deleteModalStateEvent}
          handleDeleteModalCloseEvent={handleDeleteModalCloseEvent}
          handleFormDeleteEvent={handleFormDeleteEvent}
          user={user}
        />
      ))}
    </div>
  );
}
