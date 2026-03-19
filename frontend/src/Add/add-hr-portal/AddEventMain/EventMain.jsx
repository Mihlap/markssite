import React, { useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EventsList from './EventsList';
import EventForm from './EventForm';
import { deleteEvent, fetchEventById, toggleEventVisibility } from '../../../store/Slice/vacancyEventSlice';
import { UiMarksButton, UiMarksDialog, UiMarksHeading } from '../../ui';

export default function AddEventMain({ user }) {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.formAddEvent.events || []);
  const [isModalOpenEvent, setIsModalOpenEvent] = useState(false);
  const [editEventData, setEditEventData] = useState(null);
  const [deleteModalStateEvent, setDeleteModalStateEvent] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);

  const handleOpenModalEvent = useCallback(() => {
    setIsModalOpenEvent(true);
    setEditEventData(null);
  }, [setIsModalOpenEvent, setEditEventData]);

  const handleDialogClose = useCallback(() => {
    if (isFormDirtyRef.current) {
      setShowExitWarning(true);
    } else {
      setIsModalOpenEvent(false);
      setEditEventData(null);
      setIsFormLoading(false);
    }
  }, [setIsModalOpenEvent, setEditEventData]);

  const handleForceClose = useCallback(() => {
    isFormDirtyRef.current = false;
    setShowExitWarning(false);
    setIsModalOpenEvent(false);
    setEditEventData(null);
    setIsFormLoading(false);
    formRef.current?.resetForm();
  }, [setIsModalOpenEvent, setEditEventData]);

  const handleDirtyChange = useCallback((dirty) => {
    isFormDirtyRef.current = dirty;
  }, []);

  const handleDeleteModalOpenEvent = useCallback((id) => {
    setDeleteModalStateEvent((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleDeleteModalCloseEvent = useCallback((id) => {
    setDeleteModalStateEvent((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleFormDeleteEvent = useCallback(
    (id) => {
      dispatch(deleteEvent(id));
      handleDeleteModalCloseEvent(id);
    },
    [dispatch, handleDeleteModalCloseEvent]
  );

  const handleLookClick = useCallback(
    (id) => {
      const event = events.find((e) => e.id === id);
      if (event) {
        dispatch(toggleEventVisibility({ id, hidden: !event.hidden }));
      }
    },
    [dispatch, events]
  );

  const handleEditClick = useCallback(
    async (id) => {
      try {
        const eventData = await dispatch(fetchEventById(id)).unwrap();
        setEditEventData(eventData);
        setIsModalOpenEvent(true);
      } catch (error) {
        console.error('Ошибка при загрузке данных мероприятия:', error);
      }
    },
    [dispatch, setEditEventData, setIsModalOpenEvent]
  );

  return (
    <div>
      <UiMarksHeading size="3xl">Жизнь на MARKS`e</UiMarksHeading>

      <UiMarksButton defaultStyle="blue" size="large" icon onClick={handleOpenModalEvent}>
        Добавить мероприятие
      </UiMarksButton>

      <UiMarksDialog
        isOpen={isModalOpenEvent}
        onClose={handleDialogClose}
        title={editEventData ? 'Редактирование мероприятия' : 'Новое мероприятие'}
        isSaveDisabled={!isFormValid}
        onSave={() => document.getElementById('event-form')?.requestSubmit()}
        isLoading={isFormLoading}
        isExit={showExitWarning}
        onExitConfirm={handleForceClose}
        onExitCancel={() => setShowExitWarning(false)}
        nameSpinner="Мероприятие">
        <EventForm
          ref={formRef}
          onValidityChange={setIsFormValid}
          onLoadingChange={setIsFormLoading}
          onDirtyChange={handleDirtyChange}
          editEventData={editEventData}
          onSuccess={() => {
            setIsModalOpenEvent(false);
            setEditEventData(null);
            setIsFormLoading(false);
          }}
        />
      </UiMarksDialog>

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
