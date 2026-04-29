import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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
  const isLoading = useSelector((state) => state.formAddSlide.isLoading);
  const error = useSelector((state) => state.formAddSlide.error);
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

  useEffect(() => {
    dispatch(fetchSlides());
  }, [dispatch]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;
    const updated = [...slides];
    const [removed] = updated.splice(from, 1);
    updated.splice(to, 0, removed);
    const reindexed = updated.map((s, i) => ({ ...s, order: i }));
    dispatch(updateSlidesOrderLocally(reindexed));
    await dispatch(updateSlidesOrder(reindexed)).unwrap();
  };

  if (isLoading) return <p className={styles.loading}>загрузка. . . </p>;
  if (error) return <p className={styles.error}>Ошибка загрузки данных.</p>;
  if (!slides.length) return <p className={styles.empty}>Слайдов пока нет.</p>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="slides-list">
        {(provided) => (
          <div className={styles.list} role="list" ref={provided.innerRef} {...provided.droppableProps}>
            {slides.map((el, index) => (
              <Draggable key={el.id} draggableId={String(el.id)} index={index}>
                {(provided) => (
                  <div
                    className={styles.draggableWrapper}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <UiMarksEntityRow
                      title={`Слайд ${el.id}`}
                      // id={el.id}
                      visible="slide"
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
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
