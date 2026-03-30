import { useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SlidesList from './SlidesList';
import SlideForm from './SlideForm';
import {
  deleteSlide,
  toggleSlideVisibility,
  fetchSlideById,
  updateSlidesOrderLocally,
} from '../../../store/Slice/vacancyMainSlideCardSlice';
import { UiMarksButton, UiMarksDialog, UiMarksHeading } from '../../ui';


export default function AddSlideMain({ user }) {
  const dispatch = useDispatch();
  const slides = useSelector((state) => state.formAddSlide.slides || []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSlideData, setEditSlideData] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [deleteModalStateSlide, setDeleteModalStateSlide] = useState({});

  const isFormDirtyRef = useRef(false);
  const formRef = useRef(null);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    setEditSlideData(null);
  }, []);

  const handleDialogClose = useCallback(() => {
    if (isFormDirtyRef.current) {
      setShowExitWarning(true);
    } else {
      setIsModalOpen(false);
      setEditSlideData(null);
      setIsFormLoading(false);
    }
  }, []);

  const handleForceClose = useCallback(() => {
    isFormDirtyRef.current = false;
    setShowExitWarning(false);
    setIsModalOpen(false);
    setEditSlideData(null);
    setIsFormLoading(false);
    formRef.current?.resetForm();
  }, []);

  const handleDirtyChange = useCallback((dirty) => {
    isFormDirtyRef.current = dirty;
  }, []);

  const handleDeleteModalOpenSlide = useCallback((id) => {
    setDeleteModalStateSlide((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handleDeleteModalCloseSlide = useCallback((id) => {
    setDeleteModalStateSlide((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleFormDeleteSlide = useCallback(
    (id) => {
      dispatch(deleteSlide(id));
      handleDeleteModalCloseSlide(id);
    },
    [dispatch, handleDeleteModalCloseSlide]
  );

  const handleLookClick = useCallback(
    (id) => {
      const slide = slides.find((s) => s.id === id);
      if (slide) dispatch(toggleSlideVisibility({ id, hidden: !slide.hidden }));
    },
    [dispatch, slides]
  );

  const handleEditClick = useCallback(
    async (id) => {
      try {
        const slideData = await dispatch(fetchSlideById(id)).unwrap();
        setEditSlideData(slideData);
        setIsModalOpen(true);
        const updatedSlides = slides.map((s) => (s.id === slideData.id ? slideData : s));
        dispatch(updateSlidesOrderLocally(updatedSlides));
      } catch (error) {
        console.error('Ошибка при загрузке данных слайда:', error);
      }
    },
    [dispatch, slides]
  );

  return (
    <>
      <UiMarksHeading size="3xl" pb="xl" pt="40px">
        Ведущая компания в сфере проектирования
      </UiMarksHeading>
      <UiMarksButton color="blue" size="large" icon onClick={handleOpenModal}>
        Добавить слайд
      </UiMarksButton>

      <UiMarksDialog
        isOpen={isModalOpen}
        onClose={handleDialogClose}
        title={editSlideData ? 'Редактирование слайда' : 'Новый слайд'}
        isSaveDisabled={!isFormValid}
        onSave={() => document.getElementById('slide-form')?.requestSubmit()}
        isLoading={isFormLoading}
        isExit={showExitWarning}
        onExitConfirm={handleForceClose}
        onExitCancel={() => setShowExitWarning(false)}
        nameSpinner="Слайд">
        <SlideForm
          ref={formRef}
          onValidityChange={setIsFormValid}
          onLoadingChange={setIsFormLoading}
          onDirtyChange={handleDirtyChange}
          editSlideData={editSlideData}
          onSuccess={() => {
            setIsModalOpen(false);
            setEditSlideData(null);
            setIsFormLoading(false);
          }}
        />
      </UiMarksDialog>

      <SlidesList
        user={user}
        deleteModalStateSlide={deleteModalStateSlide}
        handleDeleteModalCloseSlide={handleDeleteModalCloseSlide}
        handleDeleteModalOpenSlide={handleDeleteModalOpenSlide}
        handleEditClick={handleEditClick}
        handleFormDeleteSlide={handleFormDeleteSlide}
        handleLookClick={handleLookClick}
      />
    </>
  );
}
