import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styles from '../../style/style-card.module.scss';
import FormEditSlide from '../FormAddEditSlide/FormEditeSlide.jsx';
import FormAddSlide from '../FormAddEditSlide/FormAddSlide.jsx';
import { postVacancyData, fetchSlides } from '../../../store/Slice/vacancyMainSlideCardSlice';

export default function SlideModalManager({
  isModalOpenMain,
  setIsModalOpenMain,
  editSlideData,
  modalBlockHeight,
  handleEditClick,
}) {
  const dispatch = useDispatch();

  const handleAddSlide = useCallback(
    async (formData) => {
      try {
        await dispatch(postVacancyData(formData)).unwrap();
        dispatch(fetchSlides());
        setIsModalOpenMain(false);
      } catch (error) {
        console.error('Ошибка при добавлении слайда:', error);
      }
    },
    [dispatch, setIsModalOpenMain]
  );

  return (
    isModalOpenMain && (
      <div className={styles.card_components_admin__modal_container}>
        <div style={{ maxHeight: modalBlockHeight }} className={styles.card_components_admin__modal_block}>
          {editSlideData ? (
            <FormEditSlide
              setIsModalOpenMain={setIsModalOpenMain}
              editSlideData={editSlideData}
              formType="slide"
              className={styles.formAddProjectClass}
              handleEditClick={handleEditClick}
            />
          ) : (
            <FormAddSlide
              className={styles.formAddProjectClass}
              setIsModalOpenMain={setIsModalOpenMain}
              formType="slide"
              onSubmit={handleAddSlide}
            />
          )}
          <button
            className={styles.card_components_admin__close_button}
            onClick={() => setIsModalOpenMain(false)}
          ></button>
        </div>
      </div>
    )
  );
}
