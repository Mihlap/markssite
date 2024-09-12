import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../../style/style-card.module.scss';
import FormEditEvent from '../FormAddEditEven/FormEditEvent.jsx';
import FormAddEvent from '../FormAddEditEven/FormAddEvent.jsx';
import { postVacancyData, fetchSlideById, fetchSlides } from '../../../store/Slice/vacancyMainSlideCardSlice';

export default function SlideModalManager({
  isModalOpenEvent,
  setIsModalOpenEvent,
  editSlideData,
  setEditSlideData,
  modalBlockHeight,
}) {
  const dispatch = useDispatch();

  const handleAddSlide = useCallback(
    async (formData) => {
      try {
        await dispatch(postVacancyData(formData)).unwrap();
        dispatch(fetchSlides());
      } catch (error) {
        console.error('Ошибка при добавлении слайда:', error);
      }
    },
    [dispatch]
  );

  const handleEditClick = useCallback(
    async (id) => {
      if (!id) {
        console.error('Некорректный идентификатор:', id);
        return;
      }
      try {
        const slideData = await dispatch(fetchSlideById(id)).unwrap();
        setEditSlideData(slideData);
        setIsModalOpenEvent(true);
      } catch (error) {
        console.error('Ошибка при загрузке данных слайда:', error);
      }
    },
    [dispatch, setEditSlideData, setIsModalOpenEvent]
  );

  return (
    isModalOpenEvent && (
      <div className={styles.card_components_admin__modal_container}>
        <div style={{ maxHeight: modalBlockHeight }} className={styles.card_components_admin__modal_block}>
          {editSlideData ? (
            <FormEditEvent
              setIsModalOpenMain={setIsModalOpenEvent}
              editSlideData={editSlideData}
              formType="slide"
              className={styles.formAddProjectClass}
              onSubmit={handleEditClick}
            />
          ) : (
            <FormAddEvent
              className={styles.formAddProjectClass}
              setIsModalOpenMain={setIsModalOpenEvent}
              formType="slide"
              onSubmit={handleAddSlide}
            />
          )}
          <button
            className={styles.card_components_admin__close_button}
            onClick={() => setIsModalOpenEvent(false)}
          ></button>
        </div>
      </div>
    )
  );
}
