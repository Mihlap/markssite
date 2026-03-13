import { forwardRef, useImperativeHandle, useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import compressImageFile from 'browser-image-compression';

import { UiMarksInput, UiMarksSelect, UiMarksGrayWrap, UiPhotoPreview, UiMarksButton } from '../../../ui';
import MarkdownEditor from '../Markdown/MarkdownEditor';

import {
  createJournal,
  updateJournal,
  fetchJournals,
  fetchJournalById,
  clearFormData,
  deleteMarkdownFile,
} from '../../../../store/Slice/journalSlice';

import { categoryOptions } from '../utils/journalCategoryOptions';
import { wrapAnnotationAndKeywords } from '../utils/markdownTransform';

import s from './JournalForm.module.css';

const issueOptions = Array.from({ length: 14 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `Выпуск ${i + 1}`,
}));

function getNextImageKey(journals) {
  const imageKeys = ['one', 'two'];
  const keyUsage = journals.reduce((acc, journal) => {
    if (journal.imageKey && imageKeys.includes(journal.imageKey)) {
      acc[journal.imageKey] = (acc[journal.imageKey] || 0) + 1;
    }
    return acc;
  }, {});
  let nextKey = imageKeys[0];
  let minUsage = keyUsage[nextKey] || 0;
  imageKeys.forEach((key) => {
    const usage = keyUsage[key] || 0;
    if (usage < minUsage) {
      nextKey = key;
      minUsage = usage;
    }
  });
  return nextKey;
}

const EMPTY_VALUES = {
  title: '',
  date: '',
  category: [],
  issueNumber: null,
  universities: [{ value: '' }],
  locations: [{ value: '' }],
};

const JournalForm = forwardRef(function JournalForm(
  { onValidityChange, onLoadingChange, editJournalData, onSuccess, onDirtyChange },
  ref
) {
  const dispatch = useDispatch();
  const markdown_content = useSelector((s) => s.journal.formData.markdown_content);
  const journals = useSelector((state) => state.journal.journals);

  const [authors, setAuthors] = useState([]);
  const [localImages, setLocalImages] = useState({});
  const [isLoadingData, setIsLoadingData] = useState(false);
  const tempFilesRef = useRef([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, isDirty },
  } = useForm({ mode: 'onChange' });

  const {
    fields: universityFields,
    append: appendUniversity,
    remove: removeUniversity,
  } = useFieldArray({
    control,
    name: 'universities',
  });

  const {
    fields: locationFields,
    append: appendLocation,
    remove: removeLocation,
  } = useFieldArray({
    control,
    name: 'locations',
  });

  useEffect(() => {
    onValidityChange?.(isValid && authors.length > 0);
  }, [isValid, authors.length, onValidityChange]);

  useEffect(() => {
    onLoadingChange?.(isSubmitting);
  }, [isSubmitting, onLoadingChange]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (authors.length === 0 && !editJournalData) {
      setAuthors([{ id: Date.now(), number: 1, name: '', image: null, isLoading: false }]);
    }
  }, [authors.length, editJournalData]);

  const compressImage = useCallback(async (file) => {
    try {
      return await compressImageFile(file, { maxSizeMB: 4, maxWidthOrHeight: 1920, useWebWorker: true });
    } catch {
      return file;
    }
  }, []);

  const handleUpdateAuthorBlock = useCallback((id, updatedData) => {
    setAuthors((prev) => prev.map((a) => (a.id === id ? { ...a, ...updatedData } : a)));
  }, []);

  const handleAddAuthorBlock = useCallback((e) => {
    e.preventDefault();
    setAuthors((prev) => [
      ...prev,
      {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
        number: prev.length + 1,
        name: '',
        image: null,
        isLoading: false,
      },
    ]);
  }, []);

  const handleRemoveAuthorBlock = useCallback((id) => {
    setAuthors((prev) => prev.filter((a) => a.id !== id).map((a, i) => ({ ...a, number: i + 1 })));
    setLocalImages((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleFileChange = useCallback(
    async (id, file) => {
      if (!file) return;
      handleUpdateAuthorBlock(id, { isLoading: true });
      try {
        const compressed = await compressImage(file);
        setLocalImages((prev) => ({ ...prev, [id]: compressed }));
        handleUpdateAuthorBlock(id, { image: compressed, isLoading: false });
      } catch {
        handleUpdateAuthorBlock(id, { isLoading: false });
      }
    },
    [compressImage, handleUpdateAuthorBlock]
  );

  const handleRemoveImage = useCallback(
    (id) => {
      handleUpdateAuthorBlock(id, { image: null });
      setLocalImages((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    },
    [handleUpdateAuthorBlock]
  );

  useImperativeHandle(
    ref,
    () => ({
      resetForm: () => {
        dispatch(clearFormData());
        setAuthors([]);
        setLocalImages({});
        reset(EMPTY_VALUES);
      },
    }),
    [dispatch, reset]
  );

  useEffect(() => {
    if (!editJournalData) {
      dispatch(clearFormData());
      setAuthors([]);
      setLocalImages({});
      reset(EMPTY_VALUES);
      return;
    }

    setIsLoadingData(true);
    dispatch(fetchJournalById(editJournalData.id)).then((action) => {
      const data = action.payload;
      if (!data) {
        setIsLoadingData(false);
        return;
      }

      setAuthors(
        Array.isArray(data.authors)
          ? data.authors.map((a) => ({
              ...a,
              image: a.image && !a.image.startsWith('blob:') ? a.image : null,
            }))
          : []
      );

      reset({
        title: data.title || '',
        date: data.publication_date || '',
        category: Array.isArray(data.category) ? data.category.map((c) => ({ value: c, label: c })) : [],
        issueNumber: data.issue_number
          ? { value: data.issue_number.toString(), label: `Выпуск ${data.issue_number}` }
          : null,
        universities: (data.organizations || []).map((org) => ({ value: org.value || org.name || '' })),
        locations: (data.locations || []).map((loc) => ({ value: loc.value || loc.name || '' })),
      });

      setIsLoadingData(false);
    });

    return () => {
      dispatch(clearFormData());
    };
  }, [editJournalData, dispatch, reset]);

  useEffect(() => {
    return () => {
      tempFilesRef.current.forEach((url) => {
        dispatch(deleteMarkdownFile(url)).unwrap().catch(console.error);
      });
      dispatch(clearFormData());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const formDataToSend = new FormData();

    formDataToSend.append('title', data.title);
    formDataToSend.append('publication_date', data.date);
    formDataToSend.append('category', JSON.stringify(data.category.map((c) => c.value)));
    formDataToSend.append('issue_number', data.issueNumber?.value || '');

    const sanitizedAuthors = authors.map((a) => ({
      ...a,
      image: typeof a.image === 'string' ? a.image : null,
    }));
    formDataToSend.append('authors', JSON.stringify(sanitizedAuthors));

    formDataToSend.append('organizations', JSON.stringify(data.universities.map((u) => ({ value: u.value }))));
    formDataToSend.append('locations', JSON.stringify(data.locations.map((l) => ({ value: l.value }))));

    const transformedMarkdown = wrapAnnotationAndKeywords(markdown_content || '');
    formDataToSend.append('markdown_content', transformedMarkdown);

    const imageKey = editJournalData ? editJournalData.imageKey || 'one' : getNextImageKey(journals);
    formDataToSend.append('imageKey', imageKey);

    authors.forEach((author) => {
      const file = localImages[author.id];
      if (file) {
        const uniqueName = `${Date.now()}_${file.name}`;
        formDataToSend.append('authorImages', file, uniqueName);
      }
    });

    if (editJournalData) {
      await dispatch(updateJournal({ journalId: editJournalData.id, formData: formDataToSend })).unwrap();
    } else {
      await dispatch(createJournal(formDataToSend)).unwrap();
      await dispatch(fetchJournals());
    }

    reset(EMPTY_VALUES);
    dispatch(clearFormData());
    tempFilesRef.current = [];
    onSuccess?.();
  };

  if (isLoadingData) {
    return <div className={s.loadingText}>Загрузка данных...</div>;
  }

  return (
    <form id="journal-form" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <UiMarksGrayWrap customStyles={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '32px 16px' }}>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              label="Название статьи"
              name="title"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="date"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              label="Дата, месяц, год"
              name="date"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="category"
          control={control}
          rules={{ validate: (v) => Array.isArray(v) && v.length > 0 }}
          render={({ field, fieldState }) => (
            <UiMarksSelect
              isMulti
              label="Категория фильтрации"
              placeholder="Выберите категорию"
              name="category"
              options={categoryOptions}
              error={fieldState.error && 'Обязательное поле'}
              customStyles={{ container: s.selectContainer }}
              {...field}
            />
          )}
        />
        <Controller
          name="issueNumber"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksSelect
              label="Номер выпуска"
              placeholder="Выберите номер выпуска"
              name="issueNumber"
              options={issueOptions}
              error={fieldState.error && 'Обязательное поле'}
              customStyles={{ container: s.selectContainer }}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>
      {authors.map((author) => (
        <UiMarksGrayWrap
          key={author.id}
          customStyles={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '38px 16px 32px 16px' }}
          colorStatus
          btnClose
          handlerClick={() => handleRemoveAuthorBlock(author.id)}>
          <UiMarksInput
            type="file"
            label="Фото автора"
            accept="image/*"
            onChange={(e) => handleFileChange(author.id, e.target.files?.[0])}
          />
          {author.image && <UiPhotoPreview files={[author.image]} onRemove={() => handleRemoveImage(author.id)} />}
          <UiMarksInput
            // label="ФИО"
            placeholder="ФИО"
            value={author.name || ''}
            maxLength={150}
            onChange={(e) => handleUpdateAuthorBlock(author.id, { name: e.target.value })}
          />
        </UiMarksGrayWrap>
      ))}
      <UiMarksButton blueDashed icon iconSize="small" onClick={handleAddAuthorBlock}>
        Добавить автора
      </UiMarksButton>
      {universityFields.map((field, index) => (
        <UiMarksGrayWrap
          key={field.id}
          customStyles={{ padding: '38px 16px 32px 16px' }}
          colorStatus
          btnClose
          handlerClick={() => removeUniversity(index)}>
          <Controller
            name={`universities.${index}.value`}
            control={control}
            render={({ field: f }) => (
              <UiMarksInput
                label="Университет или организация"
                name={`universities.${index}.value`}
                placeholder="Нет ограничений по символам"
                bordered
                {...f}
              />
            )}
          />
        </UiMarksGrayWrap>
      ))}

      <UiMarksButton blueDashed icon iconSize="small" onClick={() => appendUniversity({ value: '' })}>
        Добавить университет или организацию
      </UiMarksButton>
      {locationFields.map((field, index) => (
        <UiMarksGrayWrap
          key={field.id}
          customStyles={{ padding: '38px 16px 32px 16px' }}
          colorStatus
          btnClose
          handlerClick={() => removeLocation(index)}>
          <Controller
            name={`locations.${index}.value`}
            control={control}
            render={({ field: f }) => (
              <UiMarksInput
                label="Город, Страна"
                name={`locations.${index}.value`}
                placeholder="Нет ограничений по символам"
                bordered
                {...f}
              />
            )}
          />
        </UiMarksGrayWrap>
      ))}
      <UiMarksButton blueDashed icon iconSize="small" onClick={() => appendLocation({ value: '' })}>
        Добавить город, страну
      </UiMarksButton>
      <UiMarksGrayWrap customStyles={{ padding: '16px' }}>
        <div className={s.blockLabel}>Тело статьи</div>
        <MarkdownEditor onTempFilesChange={(files) => (tempFilesRef.current = files)} />
      </UiMarksGrayWrap>
    </form>
  );
});

export default JournalForm;
