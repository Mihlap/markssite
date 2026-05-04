import { forwardRef, useImperativeHandle, useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import compressImageFile from 'browser-image-compression';

import { postVacancyData, editSlide, fetchSlides } from '../../../store/Slice/vacancyMainSlideCardSlice';
import { UiMarksInput, UiMarksTextarea, UiMarksGrayWrap, UiPhotoPreview, UiMarksHeading } from '../../ui';
import Calendar from '../FormEditSlide/Calendar';

import s from './styles.module.css';

const EMPTY = {
  photoAva: null,
  card1: { description: '', date: null },
  card2: { description: '', date: null },
  card3: { description: '', date: null },
};

const SlideForm = forwardRef(function SlideForm(
  { onValidityChange, onLoadingChange, editSlideData, onSuccess, onDirtyChange },
  ref
) {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm({ mode: 'onChange' });

  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);
  useEffect(() => {
    onLoadingChange?.(isSubmitting);
  }, [isSubmitting, onLoadingChange]);
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useImperativeHandle(
    ref,
    () => ({
      resetForm: () => {
        reset(EMPTY);
        setIsImageRemoved(false);
      },
    }),
    [reset]
  );

  useEffect(() => {
    if (!editSlideData) {
      reset(EMPTY);
      setIsImageRemoved(false);
    } else {
      reset({
        photoAva: editSlideData.photoAva || null,
        card1: {
          description: editSlideData.cardData?.card1?.description || '',
          date: editSlideData.cardData?.card1?.date ? new Date(editSlideData.cardData.card1.date) : null,
        },
        card2: {
          description: editSlideData.cardData?.card2?.description || '',
          date: editSlideData.cardData?.card2?.date ? new Date(editSlideData.cardData.card2.date) : null,
        },
        card3: {
          description: editSlideData.cardData?.card3?.description || '',
          date: editSlideData.cardData?.card3?.date ? new Date(editSlideData.cardData.card3.date) : null,
        },
      });
      setIsImageRemoved(false);
    }
  }, [editSlideData, reset]);

  const compressImage = useCallback(async (file) => {
    try {
      return await compressImageFile(file, { maxSizeMB: 4, maxWidthOrHeight: 1920, useWebWorker: true });
    } catch {
      return file;
    }
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      const fd = new FormData();
      fd.append(
        'details',
        JSON.stringify({
          card1: { description: data.card1.description, date: data.card1.date },
          card2: { description: data.card2.description, date: data.card2.date },
          card3: { description: data.card3.description, date: data.card3.date },
        })
      );

      if (editSlideData?.id) {
        if (isImageRemoved) fd.append('removePhotoAva', 'true');
        else if (data.photoAva instanceof File) fd.append('photoAva', data.photoAva);
        await dispatch(editSlide({ id: editSlideData.id, data: fd })).unwrap();
      } else {
        if (data.photoAva instanceof File) fd.append('photoAva', data.photoAva);
        await dispatch(postVacancyData(fd)).unwrap();
      }

      dispatch(fetchSlides());
      onSuccess?.();
    },
    [dispatch, editSlideData, isImageRemoved, onSuccess]
  );

  return (
    <form className={s.form} id="slide-form" onSubmit={handleSubmit(onSubmit)}>
      {[1, 2, 3].map((n) => {
        const key = `card${n}`;
        return (
          <div className={s.wrap} key={key}>
            <UiMarksHeading size="xl">{`Карточка ${n}`}</UiMarksHeading>
            <UiMarksGrayWrap customStyles={{ padding: '16px' }}>
              <Controller
                name={`${key}.description`}
                control={control}
                rules={{ required: true, maxLength: 150 }}
                render={({ field, fieldState }) => (
                  <UiMarksTextarea
                    maxLength={150}
                    label="Название конкурса"
                    name={`${key}.description`}
                    placeholder="Есть ограничение"
                    error={fieldState.error && 'Обязательное поле'}
                    {...field}
                  />
                )}
              />
            </UiMarksGrayWrap>
            <Controller
              name={`${key}.date`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => <Calendar date={field.value} setDate={field.onChange} />}
            />
          </div>
        );
      })}

      <Controller
        name="photoAva"
        control={control}
        rules={{ validate: (v) => !!v || 'Обязательное поле' }}
        render={({ field: { onChange, value } }) => (
          <>
            <UiMarksInput
              type="file"
              label="Изображение"
              name="photoAva"
              accept="image/*"
              color='grey'
              inputRef={fileInputRef}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setIsCompressing(true);
                const compressed = await compressImage(file);
                const finalFile = new File([compressed], file.name, { type: compressed.type });
                onChange(finalFile);
                setIsImageRemoved(false);
                setIsCompressing(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            />
            {isCompressing && <div>Загрузка . . .</div>}
            {value && (
              <UiPhotoPreview
                files={[value]}
                variant="single"
                onRemove={() => {
                  setIsImageRemoved(true);
                  onChange(null);
                }}
              />
            )}
          </>
        )}
      />
    </form>
  );
});

export default SlideForm;
