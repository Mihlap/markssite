import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SlidesList from './SlidesList';
import SlideModalManager from './SlideModalManager';
import {
  deleteSlide,
  toggleSlideVisibility,
  fetchSlideById,
  updateSlidesOrderLocally
} from '../../../store/Slice/vacancyMainSlideCardSlice';
import styles from '../../style/style-card.module.scss';

export default function AddSlideMain({
  user,
  isModalOpenMain,
  setIsModalOpenMain,
  editSlideData,
  setEditSlideData,
  modalBlockHeight,
  deleteModalState,
  setDeleteModalState,
  handleDeleteModalClose,
  handleDeleteModalOpen
}) {
  const dispatch = useDispatch();
  const slides = useSelector(state => state.formAddSlide.slides || []);

  const handleOpenModal = () => {
    setEditSlideData(null);
    setIsModalOpenMain(true);
  };

  const handleFormDelete = useCallback(
    (id) => {
      dispatch(deleteSlide(id));
      handleDeleteModalClose(id);
    },
    [dispatch, handleDeleteModalClose]
  );

  const handleLookClick = useCallback((id) => {
    const slide = slides.find(slide => slide.id === id);
    if (slide) {
      dispatch(toggleSlideVisibility({ id, hidden: !slide.hidden }));
    } else {
      console.error("Слайд с таким ID не найден:", id);
    }
  }, [dispatch, slides]);

  const handleEditClick = useCallback(
    async (id) => {
      try {
        const slideData = await dispatch(fetchSlideById(id)).unwrap();
        setEditSlideData(slideData);
        setIsModalOpenMain(true);

        const updatedSlides = slides.map(slide => 
          slide.id === slideData.id ? slideData : slide
        );
        dispatch(updateSlidesOrderLocally(updatedSlides));
      } catch (error) {
        console.error("Ошибка при загрузке данных слайда:", error);
      }
    },
    [dispatch, setEditSlideData, setIsModalOpenMain]
  );

  return (
    <div className={styles.card_components_admin__blockAddSlide}>
      <span className={styles.card_components_admin__title}>Ведущая компания в сфере проектирования</span>
      <div className={styles.card_components_admin__button_block} onClick={handleOpenModal}>
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
          <div className={styles.card_components_admin__button_text}>Добавить слайд</div>
        </button>
      </div>

   
      <SlideModalManager
        isModalOpenMain={isModalOpenMain}
        setIsModalOpenMain={setIsModalOpenMain}
        editSlideData={editSlideData}
        setEditSlideData={setEditSlideData}
        modalBlockHeight={modalBlockHeight}
      />

      <SlidesList
        user={user}
        deleteModalState={deleteModalState}
        handleDeleteModalClose={handleDeleteModalClose}
        handleDeleteModalOpen={handleDeleteModalOpen}
        handleEditClick={handleEditClick}
        handleFormDelete={handleFormDelete}
        handleLookClick={handleLookClick}
      />
    </div>
  );
}