import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { UiMarksInput, UiMarksSelect, UiMarksTextarea, UiPhotoPreview, UiMarksGrayWrap } from '../../ui';
import { renameFile, convertOldToNewFormat } from '../../function/index';
import { tabFilterOptions } from './const/tabFilterSelection';
import ConstructorMain from '../../constructor/ConstructorMain';
import { fetchArticle, setArticleId } from '../../../store/Slice/articleSlice';

import { publications_news_items } from '../../constructor/config/config';
import { BLOCK_COMPONENTS } from '../../constructor/blocks';

import s from './Styles.module.css';

export default function ArticlesForm({ onValidityChange, onLoadingChange, editProjectData, onSuccess }) {
  const dispatch = useDispatch();
  const photoAvaRef = useRef(null);
  const dropPhotoRef = useRef(null);
  const imageOpenRef = useRef(null);
  const imageCloseRef = useRef(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: 'onChange',
  });

  const {
    fields: constructorBlocks,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'constructorBlocks',
  });

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  useEffect(() => {
    onLoadingChange?.(isSubmitting);
  }, [isSubmitting, onLoadingChange]);

  useEffect(() => {
    if (!editProjectData) {
      dispatch(setArticleId(null));
      reset({
        title: '',
        author: '',
        city: '',
        dataMonthYear: '',
        selectCompetencies: [],
        dropPhoto: [],
        titleTextBlock: '',
        descriptionArticle: '',
        photoAva: [],
        imageOpen: [],
        textBlock: '',
        imageClose: [],
        constructorBlocks: [],
      });
      return;
    }

    dispatch(setArticleId(editProjectData.id));

    const parseToOptions = (str) =>
      str ? str.split(',').map((item) => ({ value: item.trim(), label: item.trim() })) : [];

    const constructorData = editProjectData.ConstructorArticles?.[0]?.data;
    const newFormatBlocks = convertOldToNewFormat(constructorData);

    reset({
      title: editProjectData.title || '',
      author: editProjectData.author || '',
      city: editProjectData.city || '',
      dataMonthYear: editProjectData.dataMonthYear || '',
      selectCompetencies: parseToOptions(editProjectData.selectCompetencies),
      dropPhoto: editProjectData.imageTitle
        ? editProjectData.imageTitle.split(',').map((f) => f.trim()).filter(Boolean)
        : [],
      titleTextBlock: editProjectData.titleTextBlock || '',
      descriptionArticle: editProjectData.descriptionArticle || '',
      photoAva: editProjectData.imageAuthor ? [editProjectData.imageAuthor] : [],
      imageOpen: editProjectData.imageOpen ? [editProjectData.imageOpen] : [],
      textBlock: editProjectData.textBlock || '',
      imageClose: editProjectData.imageClose ? [editProjectData.imageClose] : [],
      constructorBlocks: newFormatBlocks,
    });

    return () => {
      dispatch(setArticleId(null));
    };
  }, [editProjectData, dispatch, reset]);

  const toOldFormat = (block) => {
    const processFiles = (files) => {
      if (!Array.isArray(files)) return [];
      return files.map((file) => (file instanceof File ? renameFile(file) : file));
    };

    switch (block.type) {
      case 'imageWithDesc':
        return [
          { type: 'file', label: 'Картинка с описанием', value: processFiles(block.image) },
          { type: 'text', label: 'Описание картинки', value: block.description || '' },
        ];
      case 'titleWithDesc':
        return [
          { type: 'text', label: 'Заголовок', value: block.title || '' },
          { type: 'text', label: 'Текстовый блок', value: block.description || '' },
        ];
      case 'video':
        return [{ type: 'text', label: 'Ссылка на видеоролик', value: block.description || '' }];
      case 'threeImages':
        return [{ type: 'file', label: 'Блок 3 картинки', value: processFiles(block.image) }];
      case 'twoImages':
        return [{ type: 'file', label: 'Блок 2е вертикальные картинки', value: processFiles(block.image) }];
      case 'slider':
        return [{ type: 'file', label: 'Слайдер *допускается загрузка 8ми изображений', value: processFiles(block.image) }];
      case 'textWithQuill':
        return [{ type: 'textarea', label: 'Текстовый блок', value: block.textarea || '' }];
      case 'textWithFrame':
        return [{ type: 'textarea', label: 'Текстовый блок в рамке', value: block.textarea || '' }];
      case 'textWithSelection':
        return [{ type: 'textarea', label: 'Текстовый блок выделенный', value: block.textarea || '' }];
      case 'quote':
        return [
          { type: 'text', label: 'Автор цитаты ( ФИО должность )', value: block.title || '' },
          { type: 'textarea', label: 'Текст цитаты', value: block.textarea || '' },
          { type: 'file', label: 'Фото автора статьи', value: processFiles(block.image) },
        ];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    const oldFormatBlocks = (data.constructorBlocks || []).map(toOldFormat);

    // Separate new File uploads from existing URL strings
    const photoAvaNew = (data.photoAva || []).filter((f) => f instanceof File);
    const photoAvaExisting = (data.photoAva || []).find((f) => !(f instanceof File)) || '';
    const dropPhotoNew = (data.dropPhoto || []).filter((f) => f instanceof File);
    const dropPhotoExisting = (data.dropPhoto || []).filter((f) => !(f instanceof File));

    const formattedData = {
      title: data.title || '',
      author: data.author || '',
      city: data.city || '',
      dataMonthYear: data.dataMonthYear || '',
      selectCompetencies: Array.isArray(data.selectCompetencies)
        ? data.selectCompetencies.map((o) => o.label).join(',')
        : '',
      // new files → req.files.dropPhoto (multer)
      dropPhoto: dropPhotoNew,
      // existing URLs → req.body.imageTitle (what backend reads)
      imageTitle: dropPhotoExisting,
      titleTextBlock: data.titleTextBlock || '',
      descriptionArticle: data.descriptionArticle || '',
      // new file → req.files.photoAva (multer)
      photoAva: photoAvaNew,
      // existing URL → req.body.imageAuthor (what backend reads)
      imageAuthor: photoAvaExisting,
      imageOpen: data.imageOpen || [],
      imageClose: data.imageClose || [],
      textBlock: data.textBlock || '',
      dynamicBlocks: oldFormatBlocks,
    };

    await dispatch(fetchArticle(formattedData));
    reset();
    onSuccess?.();
  };
  return (
    <form id="add-form-news" className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <UiMarksGrayWrap customStyles={{ padding: '24px 16px 32px 16px' }}>
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput label="Название" name="title" error={fieldState.error && 'Обязательное поле'} {...field} />
          )}
        />
        <Controller
          name="author"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput label="Автор" name="author" error={fieldState.error && 'Обязательное поле'} {...field} />
          )}
        />
        <Controller
          name="city"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              label="Издание, город"
              name="city"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="dataMonthYear"
          control={control}
          rules={{ required: true }}
          render={({ field, fieldState }) => (
            <UiMarksInput
              label="Дата, месяц, год"
              name="dataMonthYear"
              error={fieldState.error && 'Обязательное поле'}
              {...field}
            />
          )}
        />
        <Controller
          name="selectCompetencies"
          control={control}
          render={({ field }) => (
            <UiMarksSelect
              isMulti
              label="Выберите табы фильтрации"
              placeholder="Выберите табы фильтрации"
              name="selectCompetencies"
              customStyles={{
                container: s.selectContainer,
              }}
              options={tabFilterOptions}
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>
      <div className={s.photoUpload}>
        <Controller
          name="dropPhoto"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              {value?.length !== 4 && (
                <UiMarksInput
                  type="file"
                  name="dropPhoto"
                  accept="image/*"
                  multiple
                  inputRef={dropPhotoRef}
                  label="Слайдер *допускается загрузка 4х&nbsp;изображений"
                  color="grey"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length === 0) return;
                    const prev = value || [];
                    const next = [...prev, ...files].slice(0, 4);
                    onChange(next);
                    if (dropPhotoRef.current) {
                      dropPhotoRef.current.value = '';
                    }
                  }}
                />
              )}
              <UiPhotoPreview
                files={value}
                variant="grid-4"
                onRemove={(index) => {
                  const next = (value || []).filter((_, i) => i !== index);
                  onChange(next);
                }}
                label="Слайдер *допускается загрузка 4х&nbsp;изображений"
              />
            </>
          )}
        />
      </div>
      <UiMarksGrayWrap customStyles={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Controller
          name="titleTextBlock"
          control={control}
          render={({ field }) => (
            <UiMarksInput
              name="titleTextBlock"
              label="Заголовок текстового блока"
              placeholder="Не более 255 символов"
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 255) {
                  field.onChange(value);
                }
              }}
              value={field.value}
              maxLength={255}
            />
          )}
        />
        <Controller
          name="descriptionArticle"
          control={control}
          render={({ field }) => (
            <UiMarksTextarea
              name="descriptionArticle"
              label="Текст"
              placeholder="Нет ограничения по символам"
              richText
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>
      <Controller
        name="photoAva"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            {value?.length > 0 ? (
              <UiPhotoPreview
                files={value}
                variant="single"
                onRemove={() => {
                  onChange([]);
                  if (photoAvaRef.current) {
                    photoAvaRef.current.value = '';
                  }
                }}
                label="Фото автора текста"
              />
            ) : (
              <UiMarksInput
                type="file"
                name="photoAva"
                accept="image/*"
                inputRef={photoAvaRef}
                label="Фото автора текста"
                color="grey"
                onChange={(e) => {
                  const file = e.target.files[0];
                  onChange(file ? [file] : []);
                }}
              />
            )}
          </>
        )}
      />
      <Controller
        name="imageOpen"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            {value?.length > 0 ? (
              <UiPhotoPreview
                files={value}
                variant="single"
                onRemove={() => {
                  onChange([]);
                  if (imageOpenRef.current) {
                    imageOpenRef.current.value = '';
                  }
                }}
                label="Открывающая картинка"
              />
            ) : (
              <UiMarksInput
                type="file"
                name="imageOpen"
                accept="image/*"
                inputRef={imageOpenRef}
                label="Открывающая картинка"
                color="grey"
                onChange={(e) => {
                  const file = e.target.files[0];
                  onChange(file ? [file] : []);
                }}
              />
            )}
          </>
        )}
      />
      <UiMarksGrayWrap customStyles={{ padding: '1rem' }}>
        <Controller
          name="textBlock"
          control={control}
          render={({ field }) => (
            <UiMarksTextarea
              name="textBlock"
              label="Текстовый блок"
              placeholder="Нет ограничения по символам"
              richText
              {...field}
            />
          )}
        />
      </UiMarksGrayWrap>

      <ConstructorMain items={publications_news_items} onSelect={(item) => append({ type: item.id })} />

      {constructorBlocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type];
        if (!Component) return null;
        return <Component key={block.id} control={control} index={index} onRemove={() => remove(index)} />;
      })}
      <Controller
        name="imageClose"
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            {value?.length > 0 ? (
              <UiPhotoPreview
                files={value}
                variant="single"
                onRemove={() => {
                  onChange([]);
                  if (imageCloseRef.current) {
                    imageCloseRef.current.value = '';
                  }
                }}
                label="Закрывающая картинка"
              />
            ) : (
              <UiMarksInput
                type="file"
                name="imageClose"
                accept="image/*"
                inputRef={imageCloseRef}
                label="Закрывающая картинка"
                color="grey"
                onChange={(e) => {
                  const file = e.target.files[0];
                  onChange(file ? [file] : []);
                }}
              />
            )}
          </>
        )}
      />
      <DevTool control={control} />
    </form>
  );
}
