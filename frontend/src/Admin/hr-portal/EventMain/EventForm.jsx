import { forwardRef, useImperativeHandle, useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import compressImageFile from 'browser-image-compression';

import { postEventData, editEvent, fetchEvents } from '../../../store/Slice/vacancyEventSlice';
import { UiMarksInput, UiMarksGrayWrap, UiPhotoPreview, UiMarksButton } from '../../ui';

import s from './EventForm.module.css';

const EMPTY = { title: '', files: [] };

const EventForm = forwardRef(function EventForm(
  { onValidityChange, onLoadingChange, editEventData, onSuccess, onDirtyChange },
  ref
) {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm({ mode: 'onChange' });

  const [removedFiles, setRemovedFiles] = useState([]);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const [videoUrls, setVideoUrls] = useState(['']);
  const [photo, setPhoto] = useState([]);
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
        setRemovedFiles([]);
        setIsImageRemoved(false);
        setVideoUrls(['']);
        setPhoto([]);
      },
    }),
    [reset]
  );

  useEffect(() => {
    if (!editEventData) {
      reset(EMPTY);
      setRemovedFiles([]);
      setIsImageRemoved(false);
      setVideoUrls(['']);
      setPhoto([]);
    } else {
      reset({
        title: editEventData.title || '',
        files: editEventData.files || [],
      });
      setRemovedFiles([]);
      setIsImageRemoved(false);
      setVideoUrls(editEventData.eventData?.length ? editEventData.eventData : ['']);
    }
  }, [editEventData, reset]);

  const compressImage = useCallback(async (file) => {
    try {
      return await compressImageFile(file, { maxSizeMB: 4, maxWidthOrHeight: 1920, useWebWorker: true });
    } catch {
      return file;
    }
  }, []);

  const addVideoField = useCallback(() => setVideoUrls((prev) => [...prev, '']), []);
  const addPhotoField = useCallback(() => setPhoto((prev) => [...prev, []]), []);

  const changeVideoUrl = useCallback(
    (i, val) => setVideoUrls((prev) => prev.map((u, idx) => (idx === i ? val : u))),
    []
  );

  const onSubmit = useCallback(
    async (data) => {
      const fd = new FormData();
      fd.append('title', data.title);

      const filtered = videoUrls.filter(Boolean);

      if (editEventData?.id) {
        fd.append('videoUrls', JSON.stringify(filtered));
        if (isImageRemoved) fd.append('removePhotoAva', 'true');
        if (removedFiles.length) fd.append('removedFiles', JSON.stringify(removedFiles));
      } else {
        fd.append('details', JSON.stringify({ eventData: filtered }));
      }

      (data.files || []).forEach((file) => {
        if (file instanceof File) fd.append('files', file);
      });

      photo.forEach((files) => {
        files.forEach((file) => fd.append('photoFiles', file));
      });

      if (editEventData?.id) {
        await dispatch(editEvent({ id: editEventData.id, data: fd })).unwrap();
      } else {
        await dispatch(postEventData(fd)).unwrap();
      }

      await dispatch(fetchEvents());
      onSuccess?.();
    },
    [dispatch, editEventData, videoUrls, photo, removedFiles, isImageRemoved, onSuccess]
  );

  return (
    <form id="event-form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <UiMarksGrayWrap customStyles={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 16px' }}>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              label="Название мероприятия"
              name="title"
              // maxLength={30}
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>
      <UiMarksGrayWrap customStyles={{ padding: '1rem' }}>
        <div className={s.photoUpload}>
          <Controller
            name="files"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value } }) => (
              <>
                <UiMarksInput
                  type="file"
                  label="Слайдер"
                  name="files"
                  multiple
                  accept="image/*"
                  buttonText="Загрузить изображения"
                  inputRef={fileInputRef}
                  onChange={async (e) => {
                    const selected = Array.from(e.target.files);
                    if (!selected.length) return;
                    setIsCompressing(true);
                    const compressed = await Promise.all(
                      selected.map(async (f) => {
                        const c = await compressImage(f);
                        return new File([c], f.name, { type: c.type });
                      })
                    );
                    onChange([...(value || []), ...compressed]);
                    setIsCompressing(false);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                />
                {isCompressing && <div className={s.loading}>Загрузка . . .</div>}
                <UiPhotoPreview
                  files={value}
                  variant="multi"
                  onRemove={(index) => {
                    const fileToRemove = value[index];
                    if (typeof fileToRemove === 'string') {
                      setRemovedFiles((prev) => [...prev, fileToRemove]);
                    }
                    const updated = value.filter((_, i) => i !== index);
                    if (updated.length === 0) setIsImageRemoved(true);
                    onChange(updated);
                  }}
                />
              </>
            )}
          />
        </div>
      </UiMarksGrayWrap>
      {photo.map((files, i) => (
        <UiMarksGrayWrap
          key={i}
          customStyles={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <UiMarksInput
            type="file"
            label="Слайдер"
            multiple
            name={`photo-${i}`}
            accept="image/*"
            onChange={async (e) => {
              const selected = Array.from(e.target.files);
              if (!selected.length) return;
              setIsCompressing(true);
              const compressed = await Promise.all(
                selected.map(async (f) => {
                  const c = await compressImage(f);
                  return new File([c], f.name, { type: c.type });
                })
              );
              setPhoto((prev) => prev.map((p, idx) => (idx === i ? [...p, ...compressed] : p)));
              setIsCompressing(false);
            }}
          />
          {files.length > 0 && (
            <UiPhotoPreview
              files={files}
              variant="multi"
              onRemove={(fileIdx) =>
                setPhoto((prev) => prev.map((p, idx) => (idx === i ? p.filter((_, fi) => fi !== fileIdx) : p)))
              }
            />
          )}
        </UiMarksGrayWrap>
      ))}
      <UiMarksButton icon iconSize="small" blueDashed onClick={addPhotoField}>
        Добавить фотографии
      </UiMarksButton>
      {videoUrls.map((url, i) => (
        <UiMarksGrayWrap
          key={i}
          customStyles={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <UiMarksInput
            name={`video-${i}`}
            label={'Ссылка на видеоролик'}
            placeholder="ссылка на видеоролик"
            bordered
            value={url}
            onChange={(e) => changeVideoUrl(i, e.target.value)}
          />
        </UiMarksGrayWrap>
      ))}
      <UiMarksButton icon iconSize="small" blueDashed onClick={addVideoField}>
        Добавить видео
      </UiMarksButton>
    </form>
  );
});

export default EventForm;
