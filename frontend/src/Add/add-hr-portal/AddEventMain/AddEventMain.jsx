import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventsList from './EventsList';
import EventModalManager from './EventModalManager';
import styles from '../../style/style-card.module.scss';
import { deleteEvent, fetchEventById, toggleEventVisibility } from '../../../store/Slice/vacancyEventSlice';

export default function AddEventMain({
  user,
  isModalOpenEvent,
  setIsModalOpenEvent,
  editEventData,
  setEditEventData,
  modalBlockHeight
}) {
  const dispatch = useDispatch();
  const events = useSelector(state => state.formAddEvent.events || []);
  const [deleteModalStateEvent, setDeleteModalStateEvent] = useState({});

  
  const handleOpenModalEvent = useCallback(() => {
    setIsModalOpenEvent(true);
    setEditEventData(null);
  }, []);


  const handleDeleteModalOpenEvent = useCallback((id) => {
    setDeleteModalStateEvent((prevState) => ({
      ...prevState,
      [id]: true,
    }));
  }, []);

  const handleDeleteModalCloseEvent = useCallback((id) => {
    setDeleteModalStateEvent((prevState) => {
      const newState = { ...prevState };
      delete newState[id];
      return newState;
    });
  }, []);


  const handleFormDeleteEvent = useCallback(
    (id) => {
      dispatch(deleteEvent(id));
      handleDeleteModalCloseEvent(id);
    },
    [dispatch, handleDeleteModalCloseEvent]
  );

  const handleLookClick = useCallback((id) => {
    const event = events.find(event => event.id === id);
    if (event) {
      dispatch(toggleEventVisibility({ id, hidden: !event.hidden }));
    } else {
      console.error("Слайд с таким ID не найден:", id);
    }
  }, [dispatch, events]);

  const handleEditClick = useCallback(
    async (id) => {
      try {
        const slideData = await dispatch(fetchEventById(id)).unwrap();
        setEditEventData(slideData);
        setIsModalOpenEvent(true);
      } catch (error) {
        console.error("Ошибка при загрузке данных слайда:", error);
      }
    },
    [dispatch, setEditEventData, setIsModalOpenEvent]
  );

  return (
    <div className={styles.card_components_admin__blockAddSlide}>
      <span className={styles.card_components_admin__title}>Ведущая компания в сфере проектирования</span>
      <div
        className={styles.card_components_admin__button_block}
        onClick={handleOpenModalEvent}
      >
        <button className={styles.card_components_admin__button}>
          <div>
            <svg
              className={styles.card_components_admin__icon}
              width="41"
              height="40"
              viewBox="0 0 41 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="icon">
                <circle id="Ellipse 4" cx="20.5" cy="20" r="20" fill="#F6F6F6" />
                <path
                  id="Vector 10"
                  d="M10.5 20H20.5M30.5 20H20.5M20.5 20V10M20.5 20V30"
                  stroke="#75BBFD"
                  strokeWidth="2"
                  strokeLinecap="square"
                />
              </g>
            </svg>
          </div>
          <div className={styles.card_components_admin__button_text}>Добавить мероприятие</div>
        </button>
      </div>

   
      <EventModalManager
        isModalOpenEvent={isModalOpenEvent}
        setIsModalOpenEvent={setIsModalOpenEvent}
        editEventData={editEventData}
        setEditEventData={setEditEventData}
        modalBlockHeight={modalBlockHeight}
      />

      <EventsList
        user={user}
        deleteModalStateEvent={deleteModalStateEvent}
        handleDeleteModalCloseEvent={handleDeleteModalCloseEvent}
        handleDeleteModalOpenEvent={handleDeleteModalOpenEvent}
        handleEditClick={handleEditClick}
        handleFormDeleteEvent={handleFormDeleteEvent}
        handleLookClick={handleLookClick}
      />
    </div>
  );
}