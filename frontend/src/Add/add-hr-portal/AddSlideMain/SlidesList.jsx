import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSlides,
  updateSlidesOrderLocally,
  updateSlidesOrder,
} from '../../../store/Slice/vacancyMainSlideCardSlice';
import { UiMarksEntityRow, UiMarksDeleteModal } from '../../ui';
import styles from './styles.module.css';

const getRole = (user) => {
  if (['obezyankaa', 'Pokemon'].includes(user?.name)) return 'admin';
  return 'manager';
};

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
      try { e.dataTransfer.setData('text/plain', String(item.id)); } catch (_) {}
      e.dataTransfer.effectAllowed = 'move';
    },
    [slides]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    try { e.dataTransfer.dropEffect = 'move'; } catch (_) {}
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
    <div className={styles.list} role="list">
      {slides.map((el, index) => (
        <div
          key={el.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, index)}>
          <UiMarksEntityRow
            title={`Слайд ${el.id}`}
            id={el.id}
            role={getRole(user)}
            hidden={el.hidden}
            onToggle={() => handleLookClick(el.id)}
            onEdit={() => handleEditClick(el.id)}
            onDelete={() => handleDeleteModalOpenSlide(el.id)}
          />
          <UiMarksDeleteModal
            isOpen={!!deleteModalStateSlide[el.id]}
            title={
              <>
                Вы точно хотите удалить <strong>«Слайд {el.id}»</strong>?
              </>
            }
            description="Удаленный слайд вернуть будет невозможно"
            onConfirm={() => handleFormDeleteSlide(el.id)}
            onClose={() => handleDeleteModalCloseSlide(el.id)}
          />
        </div>
      ))}
    </div>
  );
}
