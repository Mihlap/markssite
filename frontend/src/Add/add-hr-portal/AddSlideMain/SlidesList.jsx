import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Slide from './Slide';
import {
  fetchSlides,
  updateSlidesOrderLocally,
  updateSlidesOrder,
} from '../../../store/Slice/vacancyMainSlideCardSlice';
import styles from '../../style/style-card.module.scss';

export default function SlidesList({
  user,
  deleteModalStateSlide,
  handleDeleteModalCloseSlide,
  handleDeleteModalOpenSlide,
  handleEditClick,
  handleFormDeleteSlide,
  handleLookClick,
}) {
  const dispatch = useDispatch();
  const slidesFromStore = useSelector((state) => state.formAddSlide.slides || []);
  const slides = useMemo(
    () =>
      [...slidesFromStore].sort((a, b) => {
        const ao = a.order ?? 0;
        const bo = b.order ?? 0;
        if (ao !== bo) return ao - bo;
        return (a.id ?? 0) - (b.id ?? 0);
      }),
    [slidesFromStore]
  );

  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    dispatch(fetchSlides());
  }, [dispatch]);

  const handleDragStart = useCallback(
    (e, index) => {
      const item = slides[index];
      setDraggedItem(item);     
      try {
        e.dataTransfer.setData('text/plain', String(item.id));
      } catch (_) {}
      e.dataTransfer.effectAllowed = 'move';
    },
    [slides]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    try {
      e.dataTransfer.dropEffect = 'move';
    } catch (_) {}
  }, []);

  const handleDrop = useCallback(
    async (e, index) => {
      e.preventDefault();
      if (!draggedItem) return;

      const draggedIndex = slides.findIndex((s) => s.id === draggedItem.id);
      if (draggedIndex === index) return;

      const updated = [...slides];
      const [removed] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, removed);
      
      const reindexed = updated.map((s, i) => ({ ...s, order: i }));
   
      dispatch(updateSlidesOrderLocally(reindexed));     
      try {
        await dispatch(updateSlidesOrder(reindexed)).unwrap();
      } finally {
        setDraggedItem(null);
      }
    },
    [dispatch, slides, draggedItem]
  );

  return (
    <div className={styles.card_components_admin__block__vacancy} role="list">
      {slides.map((el, index) => (
        <Slide
          key={el.id}
          el={el}
          index={index}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleLookClick={handleLookClick}
          handleEditClick={handleEditClick}
          handleDeleteModalOpenSlide={handleDeleteModalOpenSlide}
          deleteModalStateSlide={deleteModalStateSlide}
          handleDeleteModalCloseSlide={handleDeleteModalCloseSlide}
          handleFormDeleteSlide={handleFormDeleteSlide}
          user={user}
        />
      ))}
    </div>
  );
}
