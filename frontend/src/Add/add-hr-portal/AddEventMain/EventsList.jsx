import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Event from './Event';
import {
  fetchSlides,
  updateSlidesOrderLocally,
  updateSlidesOrder,
} from '../../../store/Slice/vacancyMainSlideCardSlice';
import styles from '../../style/style-card.module.scss';

export default function EventsList({
  user,
  deleteModalState,
  handleDeleteModalClose,
  handleDeleteModalOpen,
  handleEditClick,
  handleFormDelete,
  handleLookClick,
}) {
  const dispatch = useDispatch();
  const slides = useSelector((state) => state.formAddSlide.slides || []);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchSlides());
  }, [dispatch]);

  const handleDragStart = (e, index) => {
    setDraggedItem(slides[index]);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();

    if (!draggedItem) return;

    const draggedIndex = slides.findIndex((slide) => slide.id === draggedItem.id);
    if (draggedIndex === index) return;

    const updatedSlides = [...slides];
    const [removed] = updatedSlides.splice(draggedIndex, 1);
    updatedSlides.splice(index, 0, removed);

    dispatch(updateSlidesOrderLocally(updatedSlides));

    const slidesWithOrder = updatedSlides.map((slide, idx) => ({ id: slide.id, order: idx }));
    dispatch(updateSlidesOrder(slidesWithOrder));
    setDraggedItem(null);
  };

  return (
    <div className={styles.card_components_admin__block__vacancy}>
      {slides.map((el, index) => (
        <Event
          key={el.id}
          el={el}
          index={index}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleLookClick={handleLookClick}
          handleEditClick={handleEditClick}
          handleDeleteModalOpen={handleDeleteModalOpen}
          deleteModalState={deleteModalState}
          handleDeleteModalClose={handleDeleteModalClose}
          handleFormDelete={handleFormDelete}
          user={user}
        />
      ))}
    </div>
  );
}
